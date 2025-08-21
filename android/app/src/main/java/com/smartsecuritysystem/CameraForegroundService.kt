package com.smartsecuritysystem

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat

class CameraForegroundService : Service() {

    companion object {
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "CameraServiceChannel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d("CameraService", "CameraForegroundService started")
        
        val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)
        
        // Keep service running for 1 minute to confirm it's working
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            stopSelf()
        }, 60000)
        
        return START_NOT_STICKY
    }

    private fun createNotification(): Notification {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Smart Security System")
            .setContentText("Security monitoring active")
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentIntent(pendingIntent)
            .build()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Camera Service Channel",
            NotificationManager.IMPORTANCE_LOW
        ).apply {
            description = "Channel for Smart Security System notifications"
        }
        
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.createNotificationChannel(channel)
    }

    override fun onBind(intent: Intent?): IBinder? = null
} 