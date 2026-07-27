package expo.modules.getnetworkdata

import android.Manifest
import android.content.Context
import android.telephony.CellInfo
import android.telephony.CellInfoCdma
import android.telephony.CellInfoGsm
import android.telephony.CellInfoLte
import android.telephony.CellInfoNr
import android.telephony.CellInfoTdscdma
import android.telephony.CellInfoWcdma
import android.telephony.CellSignalStrength
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat
import androidx.core.content.PermissionChecker
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GetNetworkDataModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GetNetworkData")

    AsyncFunction("getData") {
      val reactContext = appContext.reactContext
      if (reactContext == null) {
        return@AsyncFunction mapOf(
          "carrierName" to null,
          "networkType" to null,
          "technology" to null,
          "signalDbm" to null,
          "signalAsu" to null,
          "signalLevel" to null,
          "isConnected" to false,
          "isRoaming" to false,
          "permissionRequired" to false,
          "error" to "React context unavailable"
        )
      }

      val hasFineLocation = ContextCompat.checkSelfPermission(
        reactContext,
        Manifest.permission.ACCESS_FINE_LOCATION
      ) == PermissionChecker.PERMISSION_GRANTED

      val hasCoarseLocation = ContextCompat.checkSelfPermission(
        reactContext,
        Manifest.permission.ACCESS_COARSE_LOCATION
      ) == PermissionChecker.PERMISSION_GRANTED

      val hasPhoneState = ContextCompat.checkSelfPermission(
        reactContext,
        Manifest.permission.READ_PHONE_STATE
      ) == PermissionChecker.PERMISSION_GRANTED

      if (!hasFineLocation && !hasCoarseLocation) {
        return@AsyncFunction mapOf(
          "carrierName" to null,
          "networkType" to null,
          "technology" to null,
          "signalDbm" to null,
          "signalAsu" to null,
          "signalLevel" to null,
          "isConnected" to false,
          "isRoaming" to false,
          "permissionRequired" to true,
          "error" to "Location permission is required to read cellular signal data"
        )
      }

      val telephonyManager = reactContext.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager

      if (telephonyManager == null) {
        return@AsyncFunction mapOf(
          "carrierName" to null,
          "networkType" to null,
          "technology" to null,
          "signalDbm" to null,
          "signalAsu" to null,
          "signalLevel" to null,
          "isConnected" to false,
          "isRoaming" to false,
          "permissionRequired" to false,
          "error" to "Telephony service unavailable"
        )
      }

      val registeredCellInfo = telephonyManager.allCellInfo?.firstOrNull { it.isRegistered }
      val signal = registeredCellInfo.extractSignalSnapshot()
      val networkType = if (hasPhoneState) {
        runCatching { telephonyManager.dataNetworkType }.getOrNull()
      } else {
        null
      }

      mapOf(
        "carrierName" to telephonyManager.networkOperatorName.takeIf { it.isNotBlank() },
        "networkType" to networkType?.let { networkTypeName(it) },
        "technology" to signal.technology,
        "signalDbm" to signal.dbm,
        "signalAsu" to signal.asu,
        "signalLevel" to signal.level,
        "isConnected" to (telephonyManager.dataState == TelephonyManager.DATA_CONNECTED),
        "isRoaming" to telephonyManager.isNetworkRoaming,
        "permissionRequired" to false,
        "error" to null
      )
    }
  }

  private data class SignalSnapshot(
    val technology: String?,
    val dbm: Int?,
    val asu: Int?,
    val level: Int?
  )

  private fun CellInfo?.extractSignalSnapshot(): SignalSnapshot {
    if (this == null) {
      return SignalSnapshot(null, null, null, null)
    }

    return when (this) {
      is CellInfoLte -> with(cellSignalStrength) {
        SignalSnapshot("LTE", dbm, asuLevel, level)
      }
      is CellInfoNr -> with(cellSignalStrength) {
        SignalSnapshot("NR", dbm, asuLevel, level)
      }
      is CellInfoWcdma -> with(cellSignalStrength) {
        SignalSnapshot("WCDMA", dbm, asuLevel, level)
      }
      is CellInfoGsm -> with(cellSignalStrength) {
        SignalSnapshot("GSM", dbm, asuLevel, level)
      }
      is CellInfoCdma -> with(cellSignalStrength) {
        SignalSnapshot("CDMA", dbm, asuLevel, level)
      }
      is CellInfoTdscdma -> with(cellSignalStrength) {
        SignalSnapshot("TDSCDMA", dbm, asuLevel, level)
      }
      else -> {
        val genericStrength = signalStrength()
        SignalSnapshot(
          this.javaClass.simpleName.removePrefix("CellInfo").uppercase(),
          genericStrength?.dbm,
          genericStrength?.asuLevel,
          genericStrength?.level
        )
      }
    }
  }

  private fun CellInfo.signalStrength(): CellSignalStrength? {
    return when (this) {
      is CellInfoLte -> cellSignalStrength
      is CellInfoNr -> cellSignalStrength
      is CellInfoWcdma -> cellSignalStrength
      is CellInfoGsm -> cellSignalStrength
      is CellInfoCdma -> cellSignalStrength
      is CellInfoTdscdma -> cellSignalStrength
      else -> null
    }
  }

  private fun networkTypeName(networkType: Int): String? {
    return when (networkType) {
      TelephonyManager.NETWORK_TYPE_GPRS -> "GPRS"
      TelephonyManager.NETWORK_TYPE_EDGE -> "EDGE"
      TelephonyManager.NETWORK_TYPE_UMTS -> "UMTS"
      TelephonyManager.NETWORK_TYPE_CDMA -> "CDMA"
      TelephonyManager.NETWORK_TYPE_EVDO_0 -> "EVDO_0"
      TelephonyManager.NETWORK_TYPE_EVDO_A -> "EVDO_A"
      TelephonyManager.NETWORK_TYPE_1xRTT -> "1xRTT"
      TelephonyManager.NETWORK_TYPE_HSDPA -> "HSDPA"
      TelephonyManager.NETWORK_TYPE_HSUPA -> "HSUPA"
      TelephonyManager.NETWORK_TYPE_HSPA -> "HSPA"
      TelephonyManager.NETWORK_TYPE_IDEN -> "IDEN"
      TelephonyManager.NETWORK_TYPE_EVDO_B -> "EVDO_B"
      TelephonyManager.NETWORK_TYPE_LTE -> "LTE"
      TelephonyManager.NETWORK_TYPE_EHRPD -> "EHRPD"
      TelephonyManager.NETWORK_TYPE_HSPAP -> "HSPAP"
      TelephonyManager.NETWORK_TYPE_GSM -> "GSM"
      TelephonyManager.NETWORK_TYPE_TD_SCDMA -> "TD_SCDMA"
      TelephonyManager.NETWORK_TYPE_IWLAN -> "IWLAN"
      19 -> "LTE_CA"
      TelephonyManager.NETWORK_TYPE_NR -> "NR"
      TelephonyManager.NETWORK_TYPE_UNKNOWN -> null
      else -> "TYPE_$networkType"
    }
  }
}
