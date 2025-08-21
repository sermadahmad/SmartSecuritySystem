package com.smartsecuritysystem

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.*
import android.os.Environment
import org.json.JSONArray
import org.json.JSONObject

class SecurityTriggerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "SecurityTriggerModule"
    }

    override fun getName(): String = "SecurityTriggerModule"

    @ReactMethod
    fun triggerSecurityCameraCapture(promise: Promise) {
        try {
            Log.d(TAG, "Triggering security camera capture from React Native")
            
            val intent = Intent(reactApplicationContext, SecurityCameraService::class.java).apply {
                action = SecurityCameraService.ACTION_CAPTURE_PHOTOS
            }
            
            reactApplicationContext.startForegroundService(intent)
            
            Log.d(TAG, "SecurityCameraService started successfully")
            promise.resolve("Camera capture triggered successfully")
            
        } catch (e: Exception) {
            Log.e(TAG, "Error triggering security camera capture: ${e.message}")
            promise.reject("SERVICE_START_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getSecurityPhotos(promise: Promise) {
        try {
            Log.d(TAG, "Fetching security photos from storage")
            
            val photos = mutableListOf<JSONObject>()
            
            // Check Downloads folder first
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            if (downloadsDir.exists() && downloadsDir.canRead()) {
                val downloadFiles = downloadsDir.listFiles { file ->
                    file.name.startsWith("SECURITY_") && file.extension == "jpg"
                }
                
                downloadFiles?.forEach { file ->
                    val photoInfo = createPhotoInfo(file, "downloads")
                    photos.add(photoInfo)
                }
            }
            
            // Check private app directory as fallback
            val privateDir = reactApplicationContext.getDir("security_photos", 0)
            if (privateDir.exists() && privateDir.canRead()) {
                val privateFiles = privateDir.listFiles { file ->
                    file.name.startsWith("SECURITY_") && file.extension == "jpg"
                }
                
                privateFiles?.forEach { file ->
                    val photoInfo = createPhotoInfo(file, "private")
                    photos.add(photoInfo)
                }
            }
            
            // Sort photos by timestamp (newest first)
            photos.sortByDescending { it.getString("timestamp") }
            
            // Convert to JSON array
            val photosArray = JSONArray()
            photos.forEach { photo ->
                photosArray.put(photo)
            }
            
            Log.d(TAG, "Found ${photos.size} security photos")
            promise.resolve(photosArray.toString())
            
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching security photos: ${e.message}")
            promise.reject("PHOTOS_FETCH_ERROR", e.message)
        }
    }

    private fun createPhotoInfo(file: File, storageType: String): JSONObject {
        val photoInfo = JSONObject()
        photoInfo.put("id", file.absolutePath.hashCode().toString())
        photoInfo.put("path", file.absolutePath)
        photoInfo.put("fileName", file.name)
        photoInfo.put("storageType", storageType)
        photoInfo.put("fileSize", file.length())
        photoInfo.put("lastModified", file.lastModified())
        
        // Extract camera type and timestamp from filename
        val fileName = file.name
        if (fileName.startsWith("SECURITY_")) {
            val parts = fileName.split("_")
            if (parts.size >= 3) {
                photoInfo.put("cameraType", parts[1]) // back or front
                
                // Parse timestamp from filename
                val timestampStr = "${parts[2]}_${parts[3]}"
                try {
                    val dateFormat = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault())
                    val date = dateFormat.parse(timestampStr)
                    val displayFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
                    photoInfo.put("timestamp", displayFormat.format(date))
                } catch (e: Exception) {
                    photoInfo.put("timestamp", timestampStr)
                }
            }
        }
        
        return photoInfo
    }

    @ReactMethod
    fun deleteSecurityPhoto(photoId: String, promise: Promise) {
        try {
            Log.d(TAG, "Deleting security photo with id: $photoId")
            var deleted = false

            // Search Downloads folder
            val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
            if (downloadsDir.exists() && downloadsDir.canRead()) {
                val downloadFiles = downloadsDir.listFiles { file ->
                    file.name.startsWith("SECURITY_") && file.extension == "jpg"
                }
                downloadFiles?.forEach { file ->
                    if (file.absolutePath.hashCode().toString() == photoId) {
                        deleted = file.delete()
                    }
                }
            }

            // Search private app directory
            val privateDir = reactApplicationContext.getDir("security_photos", 0)
            if (privateDir.exists() && privateDir.canRead()) {
                val privateFiles = privateDir.listFiles { file ->
                    file.name.startsWith("SECURITY_") && file.extension == "jpg"
                }
                privateFiles?.forEach { file ->
                    if (file.absolutePath.hashCode().toString() == photoId) {
                        deleted = file.delete()
                    }
                }
            }

            if (deleted) {
                promise.resolve(true)
            } else {
                promise.reject("DELETE_ERROR", "Photo not found or could not be deleted")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error deleting photo: ${e.message}")
            promise.reject("DELETE_ERROR", e.message)
        }
    }
}
