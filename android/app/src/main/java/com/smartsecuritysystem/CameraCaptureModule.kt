package com.smartsecuritysystem

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.content.ContextCompat
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import com.facebook.react.bridge.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import android.os.Handler
import android.os.Looper

class CameraCaptureModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "CameraCaptureModule"
    }

    override fun getName(): String = "CameraCaptureModule"

    private lateinit var cameraExecutor: ExecutorService
    private var imageCapture: ImageCapture? = null
    private var cameraProvider: ProcessCameraProvider? = null

    @ReactMethod
    fun captureSecurityPhotos(promise: Promise) {
        try {
            Log.d(TAG, "Starting automatic security photo capture")
            
            if (!hasCameraPermission()) {
                promise.reject("PERMISSION_DENIED", "Camera permission not granted")
                return
            }

            cameraExecutor = Executors.newSingleThreadExecutor()
            startCameraCapture(promise)
            
        } catch (e: Exception) {
            Log.e(TAG, "Error starting camera capture: ${e.message}")
            promise.reject("CAMERA_ERROR", e.message)
        }
    }

    private fun hasCameraPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun startCameraCapture(promise: Promise) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(reactApplicationContext)

        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()
                captureBackCamera(promise)
            } catch (e: Exception) {
                Log.e(TAG, "CameraX initialization failed: ${e.message}")
                promise.reject("CAMERA_INIT_ERROR", e.message)
            }
        }, ContextCompat.getMainExecutor(reactApplicationContext))
    }

    private fun captureBackCamera(promise: Promise) {
        try {
            val imageCapture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .build()

            cameraProvider?.unbindAll()
            cameraProvider?.bindToLifecycle(
                reactApplicationContext as androidx.lifecycle.LifecycleOwner,
                CameraSelector.DEFAULT_BACK_CAMERA,
                imageCapture
            )

            this.imageCapture = imageCapture

            // Wait for camera to be ready, then capture
            Handler(Looper.getMainLooper()).postDelayed({
                takePhoto("back") { backPhotoPath ->
                    // Switch to front camera after back camera
                    Handler(Looper.getMainLooper()).postDelayed({
                        captureFrontCamera(promise, backPhotoPath)
                    }, 1000)
                }
            }, 1000)

        } catch (e: Exception) {
            Log.e(TAG, "Back camera setup failed: ${e.message}")
            promise.reject("BACK_CAMERA_ERROR", e.message)
        }
    }

    private fun captureFrontCamera(promise: Promise, backPhotoPath: String) {
        try {
            val imageCapture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .build()

            cameraProvider?.unbindAll()
            cameraProvider?.bindToLifecycle(
                reactApplicationContext as androidx.lifecycle.LifecycleOwner,
                CameraSelector.DEFAULT_FRONT_CAMERA,
                imageCapture
            )

            this.imageCapture = imageCapture

            // Wait for front camera to be ready
            Handler(Looper.getMainLooper()).postDelayed({
                takePhoto("front") { frontPhotoPath ->
                    // Both photos captured successfully
                    val result = Arguments.createMap().apply {
                        putString("backPhoto", backPhotoPath)
                        putString("frontPhoto", frontPhotoPath)
                        putString("timestamp", SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date()))
                    }
                    
                    Log.d(TAG, "Security photos captured successfully: back=$backPhotoPath, front=$frontPhotoPath")
                    promise.resolve(result)
                    
                    // Clean up
                    cleanup()
                }
            }, 1000)

        } catch (e: Exception) {
            Log.e(TAG, "Front camera setup failed: ${e.message}")
            promise.reject("FRONT_CAMERA_ERROR", e.message)
        }
    }

    private fun takePhoto(cameraType: String, onComplete: (String) -> Unit) {
        val capture = imageCapture ?: return

        val photoFile = createImageFile(cameraType)
        val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

        capture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(reactApplicationContext),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    Log.d(TAG, "$cameraType camera photo saved: ${photoFile.absolutePath}")
                    onComplete(photoFile.absolutePath)
                }

                override fun onError(exception: ImageCaptureException) {
                    Log.e(TAG, "$cameraType camera photo failed: ${exception.message}")
                }
            }
        )
    }

    private fun createImageFile(cameraType: String): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val imageFileName = "SECURITY_${cameraType}_${timeStamp}_"
        val storageDir = reactApplicationContext.getDir("security_photos", Context.MODE_PRIVATE)
        return File.createTempFile(imageFileName, ".jpg", storageDir)
    }

    private fun cleanup() {
        try {
            cameraProvider?.unbindAll()
            if (::cameraExecutor.isInitialized) {
                cameraExecutor.shutdown()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error during cleanup: ${e.message}")
        }
    }
}
