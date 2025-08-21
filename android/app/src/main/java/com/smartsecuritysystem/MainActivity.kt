package com.smartsecuritysystem

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent
import androidx.core.app.ActivityCompat
import android.content.pm.PackageManager

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: android.os.Bundle?) {
    super.onCreate(savedInstanceState)

    // Request permissions for Android 14+ (SDK 34)
    if (android.os.Build.VERSION.SDK_INT >= 34) {
      val permissions = arrayOf(
        android.Manifest.permission.CAMERA,
        "android.permission.FOREGROUND_SERVICE_CAMERA"
      )
      ActivityCompat.requestPermissions(this, permissions, 1001)
    } else {
      ActivityCompat.requestPermissions(this, arrayOf(android.Manifest.permission.CAMERA), 1001)
    }

    // Start service only if permissions are already granted
    if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED &&
        (android.os.Build.VERSION.SDK_INT < 34 ||
         ActivityCompat.checkSelfPermission(this, "android.permission.FOREGROUND_SERVICE_CAMERA") == PackageManager.PERMISSION_GRANTED)
    ) {
      val serviceIntent = Intent(this, CameraForegroundService::class.java)
      startForegroundService(serviceIntent)
    }
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<out String>,
      grantResults: IntArray
  ) {
      super.onRequestPermissionsResult(requestCode, permissions, grantResults)
      if (requestCode == 1001) {
          val allGranted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }
          if (allGranted) {
              val serviceIntent = Intent(this, CameraForegroundService::class.java)
              startForegroundService(serviceIntent)
          }
      }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "SmartSecuritySystem"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
