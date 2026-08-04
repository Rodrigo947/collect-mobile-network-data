package com.mobility.network.model

data class CellMetrics(
    val registered: Boolean,
    val technology: String,
    val cellId: Long?,
    val pci: Int?,
    val tac: Int?,
    val arfcn: Int?,
    val mcc: String?,
    val mnc: String?,
    val rsrp: Int?,
    val rsrq: Int?,
    val rssi: Int?,
    val sinr: Int?
)