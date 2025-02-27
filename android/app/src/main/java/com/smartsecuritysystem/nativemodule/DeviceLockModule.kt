package com.smartsecuritysystem.nativemodule

import android.app.KeyguardManager
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceLockModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeviceLockModule"  // ✅ Make sure this matches the name in React Native
    }

    @ReactMethod
    fun isDeviceLocked(promise: Promise) {
        try {
            val keyguardManager = reactApplicationContext.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            val isLocked = keyguardManager.isDeviceLocked
            promise.resolve(isLocked)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to check device lock status", e)
        }
    }
}
