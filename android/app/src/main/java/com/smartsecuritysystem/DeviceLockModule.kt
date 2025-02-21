package com.smartsecuritysystem

import android.content.Intent
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class DeviceLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    init {
        DeviceLockService.reactContext = reactContext
    }

    override fun getName(): String {
        return "DeviceLock"
    }

    @ReactMethod
    fun startMonitoring() {
        val intent = Intent(reactApplicationContext, DeviceLockService::class.java)
        reactApplicationContext.startService(intent)
    }

    @ReactMethod
    fun stopMonitoring() {
        val intent = Intent(reactApplicationContext, DeviceLockService::class.java)
        reactApplicationContext.stopService(intent)
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter
    }
}
