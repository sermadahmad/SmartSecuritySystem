package com.smartsecuritysystem

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.IBinder
import android.app.KeyguardManager
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class DeviceLockService : Service() {

    companion object {
        var reactContext: ReactApplicationContext? = null

        fun sendEvent(eventName: String, isLocked: Boolean) {
            reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, isLocked)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, createNotification())

        val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

        Thread {
            while (true) {
                val isLocked = keyguardManager.isKeyguardLocked
                Log.d("DeviceLockService", "Phone Locked: $isLocked")

                // Send event to React Native
                sendEvent("DeviceLockStatus", isLocked)

                Thread.sleep(2000) // Check every 2 seconds
            }
        }.start()

        return START_STICKY
    }

    private fun createNotification(): Notification {
        val notificationChannelId = "DEVICE_LOCK_SERVICE"
        val channel = NotificationChannel(
            notificationChannelId,
            "Device Lock Monitoring",
            NotificationManager.IMPORTANCE_LOW
        )

        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)

        return Notification.Builder(this, notificationChannelId)
            .setContentTitle("Security Service Running")
            .setContentText("Monitoring device lock status...")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
