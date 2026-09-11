package expo.modules.getnetworkdata.storage

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.mobility.network.model.CellMetrics
import com.mobility.network.model.NetworkSnapshot

class CollectionDatabase(context: Context) : SQLiteOpenHelper(
    context,
    DATABASE_NAME,
    null,
    DATABASE_VERSION
) {
    override fun onCreate(database: SQLiteDatabase) {
        database.execSQL(
            """
            CREATE TABLE samples (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp INTEGER NOT NULL,
                sent INTEGER NOT NULL DEFAULT 0,
                operator TEXT,
                network_type TEXT,
                latitude REAL,
                longitude REAL,
                altitude REAL,
                accuracy REAL,
                altitude_accuracy REAL,
                speed REAL,
                heading REAL,
                accelerometer_x REAL,
                accelerometer_y REAL,
                accelerometer_z REAL,
                gyroscope_x REAL,
                gyroscope_y REAL,
                gyroscope_z REAL,
                serving_registered INTEGER,
                serving_technology TEXT,
                serving_cell_id INTEGER,
                serving_pci INTEGER,
                serving_tac INTEGER,
                serving_arfcn INTEGER,
                serving_mcc TEXT,
                serving_mnc TEXT,
                serving_rsrp INTEGER,
                serving_rsrq INTEGER,
                serving_rssi INTEGER,
                serving_sinr INTEGER,
                serving_timing_advance INTEGER
            )
            """.trimIndent()
        )
        database.execSQL(
            """
            CREATE TABLE neighboring_cells (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sample_id INTEGER NOT NULL,
                registered INTEGER NOT NULL,
                technology TEXT NOT NULL,
                cell_id INTEGER,
                pci INTEGER,
                tac INTEGER,
                arfcn INTEGER,
                mcc TEXT,
                mnc TEXT,
                rsrp INTEGER,
                rsrq INTEGER,
                rssi INTEGER,
                sinr INTEGER,
                timing_advance INTEGER,
                FOREIGN KEY(sample_id) REFERENCES samples(id) ON DELETE CASCADE
            )
            """.trimIndent()
        )
        database.execSQL("CREATE INDEX index_samples_sent ON samples(sent)")
        database.execSQL("CREATE INDEX index_neighboring_cells_sample ON neighboring_cells(sample_id)")
    }

    override fun onUpgrade(database: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        database.execSQL("DROP TABLE IF EXISTS neighboring_cells")
        database.execSQL("DROP TABLE IF EXISTS samples")
        onCreate(database)
    }

    fun insertSample(
        timestamp: Long,
        location: Map<String, Any?>?,
        accelerometer: Map<String, Double>?,
        gyroscope: Map<String, Double>?,
        snapshot: NetworkSnapshot
    ) {
        val database = writableDatabase
        database.beginTransaction()
        try {
            val values = ContentValues().apply {
                put("timestamp", timestamp)
                put("sent", 0)
                put("operator", snapshot.operator)
                put("network_type", snapshot.networkType)
                putNullable("latitude", location?.get("latitude"))
                putNullable("longitude", location?.get("longitude"))
                putNullable("altitude", location?.get("altitude"))
                putNullable("accuracy", location?.get("accuracy"))
                putNullable("altitude_accuracy", location?.get("altitudeAccuracy"))
                putNullable("speed", location?.get("speed"))
                putNullable("heading", location?.get("heading"))
                putNullable("accelerometer_x", accelerometer?.get("x"))
                putNullable("accelerometer_y", accelerometer?.get("y"))
                putNullable("accelerometer_z", accelerometer?.get("z"))
                putNullable("gyroscope_x", gyroscope?.get("x"))
                putNullable("gyroscope_y", gyroscope?.get("y"))
                putNullable("gyroscope_z", gyroscope?.get("z"))
                putCell("serving", snapshot.cells.firstOrNull { it.registered })
            }
            val sampleId = database.insertOrThrow("samples", null, values)

            snapshot.cells.filterNot { it.registered }.forEach { cell ->
                database.insertOrThrow(
                    "neighboring_cells",
                    null,
                    ContentValues().apply {
                        put("sample_id", sampleId)
                        putCellValues(cell)
                    }
                )
            }
            database.setTransactionSuccessful()
        } finally {
            database.endTransaction()
        }
    }

    private fun ContentValues.putCell(prefix: String, cell: CellMetrics?) {
        if (cell == null) return
        put("${prefix}_registered", if (cell.registered) 1 else 0)
        put("${prefix}_technology", cell.technology)
        putNullable("${prefix}_cell_id", cell.cellId)
        putNullable("${prefix}_pci", cell.pci)
        putNullable("${prefix}_tac", cell.tac)
        putNullable("${prefix}_arfcn", cell.arfcn)
        putNullable("${prefix}_mcc", cell.mcc)
        putNullable("${prefix}_mnc", cell.mnc)
        putNullable("${prefix}_rsrp", cell.rsrp)
        putNullable("${prefix}_rsrq", cell.rsrq)
        putNullable("${prefix}_rssi", cell.rssi)
        putNullable("${prefix}_sinr", cell.sinr)
        putNullable("${prefix}_timing_advance", cell.timingAdvance)
    }

    private fun ContentValues.putCellValues(cell: CellMetrics) {
        put("registered", if (cell.registered) 1 else 0)
        put("technology", cell.technology)
        putNullable("cell_id", cell.cellId)
        putNullable("pci", cell.pci)
        putNullable("tac", cell.tac)
        putNullable("arfcn", cell.arfcn)
        putNullable("mcc", cell.mcc)
        putNullable("mnc", cell.mnc)
        putNullable("rsrp", cell.rsrp)
        putNullable("rsrq", cell.rsrq)
        putNullable("rssi", cell.rssi)
        putNullable("sinr", cell.sinr)
        putNullable("timing_advance", cell.timingAdvance)
    }

    private fun ContentValues.putNullable(key: String, value: Any?) {
        when (value) {
            null -> putNull(key)
            is Double -> put(key, value)
            is Float -> put(key, value)
            is Long -> put(key, value)
            is Int -> put(key, value)
            is String -> put(key, value)
            else -> put(key, value.toString())
        }
    }

    companion object {
        private const val DATABASE_NAME = "collection_data.db"
        private const val DATABASE_VERSION = 1

        fun initialize(context: Context) {
            CollectionDatabase(context).writableDatabase.close()
        }
    }
}