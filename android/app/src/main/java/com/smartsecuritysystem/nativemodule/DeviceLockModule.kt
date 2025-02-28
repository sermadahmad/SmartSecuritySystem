package com.smartsecuritysystem.nativemodule

import android.app.KeyguardManager
import android.content.Context
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactContext

class DeviceLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val handler = Handler(Looper.getMainLooper())
    private val keyguardManager: KeyguardManager =
        reactContext.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

    override fun getName(): String {
        return "DeviceLockModule"
    }

    @ReactMethod
    fun isDeviceLocked(promise: com.facebook.react.bridge.Promise) {
        try {
            val isLocked = keyguardManager.isDeviceLocked
            promise.resolve(isLocked)
        } catch (e: Exception) {
            promise.reject("ERROR_CHECKING_LOCK", "Failed to check lock status", e)
        }
    }

    private fun sendLockStatusEvent(isLocked: Boolean) {
        val reactContext = reactApplicationContext
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("onDeviceLockStatusChanged", isLocked)
    }

    fun startMonitoring() {
        handler.postDelayed(object : Runnable {
            override fun run() {
                val isLocked = keyguardManager.isDeviceLocked
                sendLockStatusEvent(isLocked)
                handler.postDelayed(this, 2000) // Check every 2 seconds
            }
        }, 2000)
    }

    // ✅ Add these two methods
    @ReactMethod
    fun addListener(eventName: String) {
        // Required for event emitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for event emitter
    }
}
