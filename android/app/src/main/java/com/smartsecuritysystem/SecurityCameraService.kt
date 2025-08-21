package com.smartsecuritysystem

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleRegistry
import java.io.File
import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import android.os.Handler
import android.os.Looper
import android.Manifest
import android.content.pm.PackageManager
import android.os.Environment

class SecurityCameraService : Service(), LifecycleOwner {

    companion object {
        private const val NOTIFICATION_ID = 1002
        private const val CHANNEL_ID = "SecurityCameraChannel"
        private const val TAG = "SecurityCameraService"
        
        // Action to trigger camera capture
        const val ACTION_CAPTURE_PHOTOS = "com.smartsecuritysystem.CAPTURE_PHOTOS"
    }

    private lateinit var cameraExecutor: ExecutorService
    private var imageCapture: ImageCapture? = null
    private var cameraProvider: ProcessCameraProvider? = null
    private var isCapturing = false
    private val lifecycleRegistry = LifecycleRegistry(this)

    override val lifecycle: Lifecycle = lifecycleRegistry

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        cameraExecutor = Executors.newSingleThreadExecutor()
        lifecycleRegistry.currentState = Lifecycle.State.CREATED
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "SecurityCameraService started")

        when (intent?.action) {
            ACTION_CAPTURE_PHOTOS -> {
                Log.d(TAG, "Received camera capture request")
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    startForeground(
                        NOTIFICATION_ID,
                        createNotification(),
                        0x00000008
                    )
                } else {
                    startForeground(NOTIFICATION_ID, createNotification())
                }
                // Start lifecycle for CameraX
                lifecycleRegistry.currentState = Lifecycle.State.STARTED
                captureSecurityPhotos()
            }
            else -> {
                Log.d(TAG, "Service started without action")
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    startForeground(
                        NOTIFICATION_ID,
                        createNotification(),
                        0x00000008
                    )
                } else {
                    startForeground(NOTIFICATION_ID, createNotification())
                }
            }
        }

        return START_NOT_STICKY
    }

    private fun captureSecurityPhotos() {
        if (isCapturing) {
            Log.d(TAG, "Camera capture already in progress")
            return
        }

        if (!hasCameraPermission()) {
            Log.e(TAG, "Camera permission not granted")
            stopSelf()
            return
        }

        isCapturing = true
        Log.d(TAG, "Starting security photo capture sequence")
        
        // Start camera capture process
        startCameraCapture()
    }

    private fun hasCameraPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun startCameraCapture() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()
                captureBackCamera()
            } catch (e: Exception) {
                Log.e(TAG, "CameraX initialization failed: ${e.message}")
                finishCapture()
            }
        }, ContextCompat.getMainExecutor(this))
    }

    private fun captureBackCamera() {
        try {
            val imageCapture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .build()

            cameraProvider?.unbindAll()
            // Now we can use the service as lifecycle owner since it implements LifecycleOwner
            cameraProvider?.bindToLifecycle(
                this,
                CameraSelector.DEFAULT_BACK_CAMERA,
                imageCapture
            )

            this.imageCapture = imageCapture

            // Wait for camera to be ready, then capture
            Handler(Looper.getMainLooper()).postDelayed({
                takePhoto("back") { backPhotoPath ->
                    Log.d(TAG, "Back camera photo captured: $backPhotoPath")
                    // Switch to front camera after back camera
                    Handler(Looper.getMainLooper()).postDelayed({
                        captureFrontCamera(backPhotoPath)
                    }, 1000)
                }
            }, 1000)

        } catch (e: Exception) {
            Log.e(TAG, "Back camera setup failed: ${e.message}")
            finishCapture()
        }
    }

    private fun captureFrontCamera(backPhotoPath: String) {
        try {
            val imageCapture = ImageCapture.Builder()
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                .build()

            cameraProvider?.unbindAll()
            // Now we can use the service as lifecycle owner since it implements LifecycleOwner
            cameraProvider?.bindToLifecycle(
                this,
                CameraSelector.DEFAULT_FRONT_CAMERA,
                imageCapture
            )

            this.imageCapture = imageCapture

            // Wait for front camera to be ready
            Handler(Looper.getMainLooper()).postDelayed({
                takePhoto("front") { frontPhotoPath ->
                    Log.d(TAG, "Front camera photo captured: $frontPhotoPath")
                    Log.d(TAG, "Security photos captured successfully: back=$backPhotoPath, front=$frontPhotoPath")
                    
                    // Both photos captured successfully
                    finishCapture()
                }
            }, 1000)

        } catch (e: Exception) {
            Log.e(TAG, "Front camera setup failed: ${e.message}")
            finishCapture()
        }
    }

    private fun takePhoto(cameraType: String, onComplete: (String) -> Unit) {
        val capture = imageCapture ?: return

        val photoFile = createImageFile(cameraType)
        val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()

        capture.takePicture(
            outputOptions,
            ContextCompat.getMainExecutor(this),
            object : ImageCapture.OnImageSavedCallback {
                override fun onImageSaved(output: ImageCapture.OutputFileResults) {
                    Log.d(TAG, "$cameraType camera photo saved: ${photoFile.absolutePath}")
                    onComplete(photoFile.absolutePath)
                }

                override fun onError(exception: ImageCaptureException) {
                    Log.e(TAG, "$cameraType camera photo failed: ${exception.message}")
                    onComplete("") // Empty string indicates failure
                }
            }
        )
    }

    private fun createImageFile(cameraType: String): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val imageFileName = "SECURITY_${cameraType}_${timeStamp}_"
        
        // Try to save to external storage (Downloads folder) first
        val externalDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
        if (externalDir.exists() && externalDir.canWrite()) {
            return File.createTempFile(imageFileName, ".jpg", externalDir)
        }
        
        // Fallback to private app directory if external storage not available
        val storageDir = getDir("security_photos", MODE_PRIVATE)
        return File.createTempFile(imageFileName, ".jpg", storageDir)
    }

    private fun finishCapture() {
        isCapturing = false
        cleanup()
        
        // Stop the service after capture is complete
        Log.d(TAG, "Security photo capture completed, stopping service")
        stopSelf()
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

    private fun createNotification(): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Security Camera Active")
            .setContentText("Capturing security photos...")
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Security Camera Service Channel",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Channel for Security Camera Service notifications"
        }
        
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        cleanup()
        Log.d(TAG, "SecurityCameraService destroyed")
    }
}
