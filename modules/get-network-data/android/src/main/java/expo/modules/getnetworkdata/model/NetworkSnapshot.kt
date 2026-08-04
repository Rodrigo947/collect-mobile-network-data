package com.mobility.network.model

data class NetworkSnapshot(
    val timestamp: Long,
    val operator: String,
    val networkType: String,
    val cells: List<CellMetrics>
)