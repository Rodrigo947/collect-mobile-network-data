package com.mobility.network.repository

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.telephony.CellInfo
import android.telephony.CellInfoGsm
import android.telephony.CellInfoLte
import android.telephony.CellInfoNr
import android.telephony.CellInfoWcdma
import android.telephony.CellIdentityNr
import android.telephony.CellSignalStrengthNr
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat

import com.mobility.network.model.CellMetrics
import com.mobility.network.model.NetworkSnapshot

class TelephonyRepository(private val context: Context) {

    private val telephony: TelephonyManager =
        context.getSystemService(Context.TELEPHONY_SERVICE) as TelephonyManager

    fun hasPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    fun operatorName(): String {
        return telephony.networkOperatorName ?: "Unknown"
    }

    fun networkType(): String {
        return try {
            when (telephony.dataNetworkType) {
                TelephonyManager.NETWORK_TYPE_NR -> "NR"
                TelephonyManager.NETWORK_TYPE_LTE -> "LTE"
                TelephonyManager.NETWORK_TYPE_HSPAP -> "HSPA+"
                TelephonyManager.NETWORK_TYPE_HSPA -> "HSPA"
                TelephonyManager.NETWORK_TYPE_EDGE -> "EDGE"
                TelephonyManager.NETWORK_TYPE_GPRS -> "GPRS"
                else -> "UNKNOWN"
            }
        } catch (e: Exception) {
            "UNKNOWN"
        }
    }

    fun networkOperator(): String? {
        return try {
            telephony.networkOperator
        } catch (e: Exception) {
            null
        }
    }

    @SuppressLint("MissingPermission")
    fun snapshot(): NetworkSnapshot {
        val mccMnc = networkOperator()
        val mcc: String? = mccMnc?.takeIf { it.length >= 3 }?.substring(0, 3)
        val mnc: String? = mccMnc?.takeIf { it.length > 3 }?.substring(3)

        val cells: List<CellMetrics> = try {
            telephony.allCellInfo.orEmpty().mapNotNull { info: CellInfo ->
                mapCellInfo(info, mcc, mnc)
            }
        } catch (e: SecurityException) {
            emptyList()
        } catch (e: Exception) {
            emptyList()
        }

        return NetworkSnapshot(
            timestamp = System.currentTimeMillis(),
            operator = operatorName(),
            networkType = networkType(),
            cells = cells
        )
    }

    private fun mapCellInfo(
        info: CellInfo,
        mcc: String?,
        mnc: String?
    ): CellMetrics? {
        val registered: Boolean = info.isRegistered
        val type: String = cellTypeName(info)

        return when (info) {
            is CellInfoLte -> {
                val identity = info.cellIdentity
                val ss = info.cellSignalStrength
                CellMetrics(
                    registered = registered,
                    technology = type,
                    cellId = identity.ci.takeIf { it != Int.MAX_VALUE && it != -1 }?.toLong(),
                    pci = identity.pci.takeIf { it != Int.MAX_VALUE && it != -1 },
                    tac = identity.tac.takeIf { it != Int.MAX_VALUE && it != -1 },
                    arfcn = identity.earfcn.takeIf { it != Int.MAX_VALUE && it != -1 },
                    mcc = mcc,
                    mnc = mnc,
                    rsrp = ss.rsrp.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                    rsrq = ss.rsrq.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                    rssi = ss.rssi.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                    sinr = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        ss.rssnr.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 }
                    } else null,
                    timingAdvance = ss.timingAdvance.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 }
                )
            }

            is CellInfoNr -> {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
                    null
                } else {
                    val identity: CellIdentityNr? = info.cellIdentity as? CellIdentityNr
                    val ss: CellSignalStrengthNr? = info.cellSignalStrength as? CellSignalStrengthNr
                    CellMetrics(
                        registered = registered,
                        technology = type,
                        cellId = identity?.nci?.takeIf { it != -1L && it != Long.MAX_VALUE },
                        pci = identity?.pci?.takeIf { it != Int.MAX_VALUE && it != -1 },
                        tac = identity?.tac?.takeIf { it != Int.MAX_VALUE && it != -1 },
                        arfcn = identity?.nrarfcn?.takeIf { it != Int.MAX_VALUE && it != -1 },
                        mcc = mcc,
                        mnc = mnc,
                        rsrp = ss?.ssRsrp?.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                        rsrq = ss?.ssRsrq?.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                        rssi = null,
                        sinr = ss?.ssSinr?.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                        timingAdvance = null
                    )
                }
            }

            is CellInfoWcdma -> {
                val identity = info.cellIdentity
                val ss = info.cellSignalStrength
                CellMetrics(
                    registered = registered,
                    technology = type,
                    cellId = identity.cid.takeIf { it != Int.MAX_VALUE && it != -1 }?.toLong(),
                    pci = identity.psc.takeIf { it != Int.MAX_VALUE && it != -1 },
                    tac = identity.lac.takeIf { it != Int.MAX_VALUE && it != -1 },
                    arfcn = identity.uarfcn.takeIf { it != Int.MAX_VALUE && it != -1 },
                    mcc = mcc,
                    mnc = mnc,
                    rsrp = null,
                    rsrq = null,
                    rssi = ss.dbm.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                    sinr = null,
                    timingAdvance = null
                )
            }

            is CellInfoGsm -> {
                val identity = info.cellIdentity
                val ss = info.cellSignalStrength
                CellMetrics(
                    registered = registered,
                    technology = type,
                    cellId = identity.cid.takeIf { it != Int.MAX_VALUE && it != -1 }?.toLong(),
                    pci = null,
                    tac = identity.lac.takeIf { it != Int.MAX_VALUE && it != -1 },
                    arfcn = identity.arfcn.takeIf { it != Int.MAX_VALUE && it != -1 },
                    mcc = mcc,
                    mnc = mnc,
                    rsrp = null,
                    rsrq = null,
                    rssi = ss.dbm.takeIf { it != Int.MAX_VALUE && it != Int.MIN_VALUE && it != 2147483647 },
                    sinr = null,
                    timingAdvance = null
                )
            }

            else -> null
        }
    }

    private fun cellTypeName(info: CellInfo): String {
        return when (info) {
            is CellInfoLte -> "LTE"
            is CellInfoNr -> "NR"
            is CellInfoWcdma -> "WCDMA"
            is CellInfoGsm -> "GSM"
            else -> "UNKNOWN"
        }
    }
}
