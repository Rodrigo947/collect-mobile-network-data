package expo.modules.getnetworkdata.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.mobility.network.repository.TelephonyRepository
import expo.modules.getnetworkdata.storage.CollectionDatabase
import expo.modules.getnetworkdata.service.CollectionBatchSender

class CollectionForegroundService : Service(), SensorEventListener {
    private val handler = Handler(Looper.getMainLooper())
    private lateinit var database: CollectionDatabase
    private lateinit var telephonyRepository: TelephonyRepository
    private lateinit var batchSender: CollectionBatchSender
    private var sensorManager: SensorManager? = null
    private var locationManager: LocationManager? = null
    private var locationListener: LocationListener? = null
    private var latestLocation: Location? = null
    private var accelerometer: FloatArray? = null
    private var gyroscope: FloatArray? = null

    private val collectRunnable = object : Runnable {
        override fun run() {
            collectAndPersist()
            handler.postDelayed(this, COLLECTION_INTERVAL_MS)
        }
    }

    override fun onCreate() {
        super.onCreate()
        database = CollectionDatabase(this)
        telephonyRepository = TelephonyRepository(this)
        batchSender = CollectionBatchSender(this)
        startSensors()
        startLocationUpdates()
        startForeground(NOTIFICATION_ID, createNotification())
        setRunning(true)
        if (database.sampleCount() >= BATCH_SIZE) batchSender.sendAsync()
        handler.post(collectRunnable)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        batchSender.sendAsync()
        sensorManager?.unregisterListener(this)
        locationListener?.let { locationManager?.removeUpdates(it) }
        setRunning(false)
        database.close()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> accelerometer = event.values.copyOf()
            Sensor.TYPE_GYROSCOPE -> gyroscope = event.values.copyOf()
        }
    }

    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) = Unit

    private fun collectAndPersist() {
        if (!telephonyRepository.hasPermission()) return

        val snapshot = try {
            telephonyRepository.freshSnapshot()
        } catch (_: Exception) {
            return
        }

        database.insertSample(
            timestamp = System.currentTimeMillis(),
            location = latestLocation?.let { locationToMap(it) },
            accelerometer = accelerometer?.let { vectorToMap(it) },
            gyroscope = gyroscope?.let { vectorToMap(it) },
            snapshot = snapshot
        )
        val count = database.sampleCount()
        if (count >= BATCH_SIZE && count % BATCH_SIZE == 0) batchSender.sendAsync()
    }

    private fun startSensors() {
        sensorManager = getSystemService(SENSOR_SERVICE) as SensorManager
        val delay = SensorManager.SENSOR_DELAY_GAME
        sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.let {
            sensorManager?.registerListener(this, it, delay)
        }
        sensorManager?.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.let {
            sensorManager?.registerListener(this, it, delay)
        }
    }

    private fun startLocationUpdates() {
        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) return

        val manager = getSystemService(LOCATION_SERVICE) as LocationManager
        locationManager = manager
        val provider = when {
            manager.isProviderEnabled(LocationManager.GPS_PROVIDER) -> LocationManager.GPS_PROVIDER
            manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER) -> LocationManager.NETWORK_PROVIDER
            else -> return
        }
        latestLocation = manager.getLastKnownLocation(provider)
        val listener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                latestLocation = location
            }
        }
        locationListener = listener
        manager.requestLocationUpdates(provider, 1000L, 0f, listener, Looper.getMainLooper())
    }

    private fun locationToMap(location: Location): Map<String, Any?> = mapOf(
        "latitude" to location.latitude,
        "longitude" to location.longitude,
        "altitude" to location.altitude,
        "accuracy" to location.accuracy.toDouble(),
        "altitudeAccuracy" to if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && location.hasVerticalAccuracy()) location.verticalAccuracyMeters.toDouble() else null,
        "speed" to if (location.hasSpeed()) location.speed.toDouble() else null,
        "heading" to if (location.hasBearing()) location.bearing.toDouble() else null
    )

    private fun vectorToMap(values: FloatArray): Map<String, Double> = mapOf(
        "x" to values[0].toDouble(),
        "y" to values[1].toDouble(),
        "z" to values[2].toDouble()
    )

    private fun createNotification(): Notification {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(
                NotificationChannel(
                    NOTIFICATION_CHANNEL,
                    "Coleta de dados",
                    NotificationManager.IMPORTANCE_LOW
                )
            )
        }
        return NotificationCompat.Builder(this, NOTIFICATION_CHANNEL)
            .setContentTitle("collect-mobile-network-data")
            .setContentText("Coleta de dados em andamento")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .build()
    }

    private fun setRunning(value: Boolean) {
        getSharedPreferences(STATUS_PREFS, MODE_PRIVATE)
            .edit()
            .putBoolean(STATUS_KEY, value)
            .apply()
    }

    companion object {
        const val STATUS_PREFS = "collection_service_status"
        const val STATUS_KEY = "running"
        const val PARTICIPANT_PREFS = "participant_credentials"
        const val PARTICIPANT_TOKEN_KEY = "participant_token"
        const val API_BASE_URL_KEY = "api_base_url"
        private const val NOTIFICATION_CHANNEL = "collection_service"
        private const val NOTIFICATION_ID = 7401
        private const val COLLECTION_INTERVAL_MS = 1000L
        private const val BATCH_SIZE = 1800
    }
}