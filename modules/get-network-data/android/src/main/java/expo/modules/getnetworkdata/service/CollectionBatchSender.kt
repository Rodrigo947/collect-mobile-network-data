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

    fun sendWithError(): Map<String, Any?> {
        return try {
            if (!hasInternet()) {
                return error("NETWORK_UNAVAILABLE", "Nao ha conexao com a internet.")
            }

            val preferences = context.getSharedPreferences(CollectionForegroundService.PARTICIPANT_PREFS, Context.MODE_PRIVATE)
            val baseUrl = preferences.getString(CollectionForegroundService.API_BASE_URL_KEY, null)?.trimEnd('/')
                ?: return error("MISSING_API_URL", "A URL da API nao foi configurada no modulo nativo.")
            val token = preferences.getString(CollectionForegroundService.PARTICIPANT_TOKEN_KEY, null)
                ?: return error("MISSING_TOKEN", "As credenciais do participante nao foram configuradas no modulo nativo.")
            val database = CollectionDatabase(context)
            val batch = database.pendingBatch() ?: run {
                database.close()
                return error("NO_PENDING_SAMPLES", "Nao ha coletas pendentes para enviar.")
            }

            try {
                val connection = (URL("$baseUrl/batches").openConnection() as HttpURLConnection).apply {
                    requestMethod = "POST"
                    connectTimeout = 10000
                    readTimeout = 30000
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json")
                    setRequestProperty("Authorization", "Bearer $token")
                }
                connection.outputStream.use { it.write(batch.body.toByteArray(Charsets.UTF_8)) }
                val responseCode = connection.responseCode
                val success = responseCode in 200..299
                val responseMessage = if (success) null else connection.errorStream?.bufferedReader()?.use { it.readText() }
                connection.disconnect()
                if (success) {
                    database.deleteSamples(batch.sampleIds)
                    mapOf("sent" to true, "count" to batch.sampleIds.size)
                } else {
                    error("HTTP_ERROR", responseMessage?.takeIf { it.isNotBlank() } ?: "A API retornou HTTP $responseCode.", responseCode)
                }
            } finally {
                database.close()
            }
        } catch (e: Exception) {
            error("SEND_ERROR", e.message ?: "Falha ao enviar as coletas.")
        }
    }

    private fun error(code: String, message: String, statusCode: Int? = null): Map<String, Any?> = buildMap {
        put("sent", false)
        put("error", code)
        put("message", message)
        statusCode?.let { put("statusCode", it) }
    }

    private fun hasInternet(): Boolean {
        val manager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val network = manager.activeNetwork ?: return false
        val capabilities = manager.getNetworkCapabilities(network) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }
}