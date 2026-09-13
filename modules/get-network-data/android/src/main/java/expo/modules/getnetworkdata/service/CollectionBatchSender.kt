package expo.modules.getnetworkdata.service

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import expo.modules.getnetworkdata.storage.CollectionDatabase
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

class CollectionBatchSender(private val context: Context) {
    private val sending = AtomicBoolean(false)
    private val executor = Executors.newSingleThreadExecutor()

    fun sendAsync() {
        if (!sending.compareAndSet(false, true)) return
        executor.execute {
            try { send() } finally { sending.set(false) }
        }
    }

    fun send(): Boolean {
        if (!hasInternet()) return false
        val preferences = context.getSharedPreferences(CollectionForegroundService.PARTICIPANT_PREFS, Context.MODE_PRIVATE)
        val baseUrl = preferences.getString(CollectionForegroundService.API_BASE_URL_KEY, null)?.trimEnd('/') ?: return false
        val token = preferences.getString(CollectionForegroundService.PARTICIPANT_TOKEN_KEY, null) ?: return false
        val database = CollectionDatabase(context)
        val batch = database.pendingBatch() ?: run { database.close(); return false }
        return try {
            val connection = (URL("$baseUrl/batches").openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 10000
                readTimeout = 30000
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("Authorization", "Bearer $token")
            }
            connection.outputStream.use { it.write(batch.body.toByteArray(Charsets.UTF_8)) }
            val success = connection.responseCode in 200..299
            connection.disconnect()
            if (success) database.deleteSamples(batch.sampleIds)
            success
        } catch (_: Exception) {
            false
        } finally {
            database.close()
        }
    }

    private fun hasInternet(): Boolean {
        val manager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = manager.activeNetwork ?: return false
        val capabilities = manager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}