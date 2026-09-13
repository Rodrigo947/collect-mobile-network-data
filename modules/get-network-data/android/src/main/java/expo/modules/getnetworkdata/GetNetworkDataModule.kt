package expo.modules.getnetworkdata

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.Manifest
import android.content.Context
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
import android.os.Looper
import androidx.core.content.ContextCompat
import com.mobility.network.repository.TelephonyRepository
import com.mobility.network.model.CellMetrics
import com.mobility.network.model.NetworkSnapshot
import expo.modules.getnetworkdata.service.CollectionForegroundService
import expo.modules.getnetworkdata.service.CollectionBatchSender
import expo.modules.getnetworkdata.storage.CollectionDatabase
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class GetNetworkDataModule : Module(), SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var accelerometer: FloatArray? = null
    private var gyroscope: FloatArray? = null
    private var sensorsRegistered = false
    private var sensorReadyLatch: CountDownLatch? = null
    private var locationManager: LocationManager? = null
    private var locationListener: LocationListener? = null
    private var latestLocation: Location? = null

    override fun definition() = ModuleDefinition {

        Name("GetNetworkData")

        AsyncFunction("setParticipantCredentials") { participantId: String, token: String, apiBaseUrl: String ->
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")
            context.getSharedPreferences(PARTICIPANT_PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString(PARTICIPANT_ID_KEY, participantId)
                .putString(PARTICIPANT_TOKEN_KEY, token)
                .putString(API_BASE_URL_KEY, apiBaseUrl)
                .apply()
            mapOf("saved" to true)
        }

        AsyncFunction("initializeCollectionDatabase") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")
            CollectionDatabase.initialize(context)
            mapOf("initialized" to true)
        }

        AsyncFunction("startCollectionService") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")

            if (!hasLocationPermission(context)) {
                return@AsyncFunction mapOf(
                    "running" to false,
                    "error" to "PERMISSION",
                    "message" to "Location permission denied. ACCESS_FINE_LOCATION is required."
                )
            }

            CollectionDatabase.initialize(context)
            ContextCompat.startForegroundService(
                context,
                Intent(context, CollectionForegroundService::class.java)
            )
            mapOf("running" to true)
        }

        AsyncFunction("stopCollectionService") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")
            context.stopService(Intent(context, CollectionForegroundService::class.java))
            context.getSharedPreferences(
                CollectionForegroundService.STATUS_PREFS,
                Context.MODE_PRIVATE
            ).edit().putBoolean(CollectionForegroundService.STATUS_KEY, false).apply()
            mapOf("running" to false)
        }

        AsyncFunction("getCollectionServiceStatus") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")
            val running = context.getSharedPreferences(
                CollectionForegroundService.STATUS_PREFS,
                Context.MODE_PRIVATE
            ).getBoolean(CollectionForegroundService.STATUS_KEY, false)
            mapOf("running" to running)
        }

        AsyncFunction("getStoredSampleCount") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")
            mapOf("count" to CollectionDatabase(context).use { it.sampleCount() })
        }

        AsyncFunction("sendStoredSamples") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")
            CollectionBatchSender(context).send()
        }

        AsyncFunction("getNetworkMetrics") {

            val reactContext = appContext.reactContext
                ?: throw Exception("React context unavailable")

            val repository = TelephonyRepository(reactContext)

            if (!repository.hasPermission()) {
                return@AsyncFunction mapOf(
                    "error" to "PERMISSION",
                    "message" to "Location permission denied. ACCESS_FINE_LOCATION is required to read cell info."
                )
            }
            try {
                val snapshot = repository.freshSnapshot()

                snapshotToMap(snapshot)
            } catch (e: SecurityException) {
                mapOf(
                    "error" to "PERMISSION",
                    "message" to (e.message ?: "Missing permission")
                )
            } catch (e: Exception) {
                mapOf(
                    "error" to "NETWORK_METRICS_ERROR",
                    "message" to (e.message ?: "Failed to read network metrics")
                )
            }
        }

        AsyncFunction("getLocationData") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")

            if (!hasLocationPermission(context)) {
                return@AsyncFunction mapOf(
                    "error" to "PERMISSION",
                    "message" to "Location permission denied. ACCESS_FINE_LOCATION is required."
                )
            }

            try {
                startLocationUpdates(context)
                mapOf("location" to latestLocation?.let { locationToMap(it) })
            } catch (e: SecurityException) {
                mapOf(
                    "error" to "PERMISSION",
                    "message" to (e.message ?: "Missing permission")
                )
            }
        }

        AsyncFunction("getSensorData") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")

            try {
                startSensors(context)
                sensorReadyLatch?.await(1, TimeUnit.SECONDS)

                val currentAccelerometer = accelerometer
                    ?: throw IllegalStateException("Accelerometer data unavailable")
                val currentGyroscope = gyroscope
                    ?: throw IllegalStateException("Gyroscope data unavailable")

                mapOf(
                    "accelerometer" to vectorToMap(currentAccelerometer),
                    "gyroscope" to vectorToMap(currentGyroscope)
                )
            } catch (e: Exception) {
                mapOf(
                    "error" to "SENSOR_ERROR",
                    "message" to (e.message ?: "Failed to read sensors")
                )
            }
        }

        AsyncFunction("getCollectionData") {
            val context = appContext.reactContext
                ?: throw Exception("React context unavailable")

            if (!hasLocationPermission(context)) {
                return@AsyncFunction mapOf(
                    "error" to "PERMISSION",
                    "message" to "Location permission denied. ACCESS_FINE_LOCATION is required."
                )
            }

            try {
                startSensors(context)
                sensorReadyLatch?.await(1, TimeUnit.SECONDS)
                startLocationUpdates(context)
                val snapshot = TelephonyRepository(context).freshSnapshot()

                val currentAccelerometer = accelerometer
                    ?: throw IllegalStateException("Accelerometer data unavailable")
                val currentGyroscope = gyroscope
                    ?: throw IllegalStateException("Gyroscope data unavailable")

                mapOf(
                    "timestamp" to System.currentTimeMillis(),
                    "location" to latestLocation?.let { locationToMap(it) },
                    "motion" to mapOf(
                        "accelerometer" to vectorToMap(currentAccelerometer),
                        "gyroscope" to vectorToMap(currentGyroscope)
                    ),
                    "servingCell" to snapshot.cells.firstOrNull { it.registered }?.let { cellToMap(it) },
                    "neighboringCells" to snapshot.cells.filterNot { it.registered }.map { cellToMap(it) }
                )
            } catch (e: SecurityException) {
                mapOf(
                    "error" to "PERMISSION",
                    "message" to (e.message ?: "Missing permission")
                )
            } catch (e: Exception) {
                mapOf(
                    "error" to "COLLECTION_ERROR",
                    "message" to (e.message ?: "Failed to collect data")
                )
            }
        }
    }

    private fun snapshotToMap(
        snapshot: NetworkSnapshot
    ): Map<String, Any?> {
        return mapOf(
            "timestamp" to snapshot.timestamp,
            "operator" to snapshot.operator,
            "networkType" to snapshot.networkType,
            "cells" to snapshot.cells.map { cellToMap(it) }
        )
    }

    private fun cellToMap(
        cell: CellMetrics
    ): Map<String, Any?> {
        return mapOf(
            "registered" to cell.registered,
            "technology" to cell.technology,
            "cellId" to cell.cellId,
            "pci" to cell.pci,
            "tac" to cell.tac,
            "arfcn" to cell.arfcn,
            "mcc" to cell.mcc,
            "mnc" to cell.mnc,
            "rsrp" to cell.rsrp,
            "rsrq" to cell.rsrq,
            "rssi" to cell.rssi,
            "sinr" to cell.sinr,
            "timingAdvance" to cell.timingAdvance
        )
    }

    private fun hasLocationPermission(context: Context): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun startSensors(context: Context) {
        if (sensorsRegistered) return

        sensorReadyLatch = CountDownLatch(2)
        sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val sensorDelay = SensorManager.SENSOR_DELAY_GAME
        sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.let {
            sensorManager?.registerListener(this, it, sensorDelay)
        }
        sensorManager?.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.let {
            sensorManager?.registerListener(this, it, sensorDelay)
        }
        sensorsRegistered = true
    }

    override fun onSensorChanged(event: SensorEvent) {
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                accelerometer = event.values.copyOf()
                sensorReadyLatch?.countDown()
            }
            Sensor.TYPE_GYROSCOPE -> {
                gyroscope = event.values.copyOf()
                sensorReadyLatch?.countDown()
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) = Unit

    private fun startLocationUpdates(context: Context) {
        if (locationListener != null) return

        val manager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        locationManager = manager
        val provider = when {
            manager.isProviderEnabled(LocationManager.GPS_PROVIDER) -> LocationManager.GPS_PROVIDER
            manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER) -> LocationManager.NETWORK_PROVIDER
            else -> return
        }

        val listener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                latestLocation = location
            }
        }
        locationListener = listener

        latestLocation = try {
            manager.getLastKnownLocation(provider)
        } catch (e: SecurityException) {
            null
        }

        manager.requestLocationUpdates(provider, 1000L, 0f, listener, Looper.getMainLooper())
    }

    private fun locationToMap(location: Location): Map<String, Any?> {
        return mapOf(
            "latitude" to location.latitude,
            "longitude" to location.longitude,
            "altitude" to location.altitude,
            "accuracy" to location.accuracy.toDouble(),
            "altitudeAccuracy" to if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && location.hasVerticalAccuracy()) location.verticalAccuracyMeters.toDouble() else null,
            "speed" to if (location.hasSpeed()) location.speed.toDouble() else null,
            "heading" to if (location.hasBearing()) location.bearing.toDouble() else null
        )
    }

    private fun vectorToMap(values: FloatArray): Map<String, Double> {
        return mapOf(
            "x" to values[0].toDouble(),
            "y" to values[1].toDouble(),
            "z" to values[2].toDouble()
        )
    }

    companion object {
        const val PARTICIPANT_PREFS = "participant_credentials"
        const val PARTICIPANT_ID_KEY = "participant_id"
        const val PARTICIPANT_TOKEN_KEY = "participant_token"
        const val API_BASE_URL_KEY = "api_base_url"
    }
}