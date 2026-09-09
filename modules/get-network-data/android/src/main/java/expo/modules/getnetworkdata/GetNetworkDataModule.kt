package expo.modules.getnetworkdata

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import com.mobility.network.repository.TelephonyRepository
import com.mobility.network.model.CellMetrics
import com.mobility.network.model.NetworkSnapshot

class GetNetworkDataModule : Module() {

    override fun definition() = ModuleDefinition {

        Name("GetNetworkData")

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
                val snapshot = repository.snapshot()

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
    }
    private fun snapshotToMap(
        snapshot: NetworkSnapshot
    ): Map<String, Any?> {

        return mapOf(
            "timestamp" to snapshot.timestamp,
            "operator" to snapshot.operator,
            "networkType" to snapshot.networkType,
            "cells" to snapshot.cells.map {
                cellToMap(it)
            }
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
}