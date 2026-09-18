package expo.modules.getnetworkdata.storage

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import org.json.JSONArray
import org.json.JSONObject
import com.mobility.network.model.CellMetrics
import com.mobility.network.model.NetworkSnapshot

class CollectionDatabase(context: Context) : SQLiteOpenHelper(
    context,
    DATABASE_NAME,
    null,
    DATABASE_VERSION
) {
    data class PendingBatch(val body: String, val sampleIds: List<Long>)
    override fun onCreate(database: SQLiteDatabase) {
        database.execSQL(
            """
            CREATE TABLE samples (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp INTEGER NOT NULL,
                sent INTEGER NOT NULL DEFAULT 0,
                operator TEXT,
                network_type TEXT,
                environment TEXT,
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
        if (oldVersion < 2) {
            val hasEnvironmentColumn = database.rawQuery("PRAGMA table_info(samples)", null).use { cursor ->
                val nameIndex = cursor.getColumnIndexOrThrow("name")
                generateSequence {
                    if (cursor.moveToNext()) cursor.getString(nameIndex) else null
                }.any { it == "environment" }
            }
            if (!hasEnvironmentColumn) {
                database.execSQL("ALTER TABLE samples ADD COLUMN environment TEXT")
            }
        }
    }

    fun insertSample(
        timestamp: Long,
        location: Map<String, Any?>?,
        accelerometer: Map<String, Double>?,
        gyroscope: Map<String, Double>?,
        environment: String?,
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
                putNullable("environment", environment)
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

    fun sampleCount(): Int {
        readableDatabase.rawQuery("SELECT COUNT(*) FROM samples", null).use { cursor ->
            return if (cursor.moveToFirst()) cursor.getInt(0) else 0
        }
    }

    fun clearContents() {
        val database = writableDatabase
        database.beginTransaction()
        try {
            database.delete("neighboring_cells", null, null)
            database.delete("samples", null, null)
            database.setTransactionSuccessful()
        } finally {
            database.endTransaction()
        }
    }

    fun pendingBatch(): PendingBatch? {
        val database = readableDatabase
        val samples = JSONArray()
        val sampleIds = mutableListOf<Long>()
        database.query("samples", null, "sent = 0", null, null, null, "id ASC").use { cursor ->
            while (cursor.moveToNext()) {
                val sampleId = cursor.getLong(cursor.getColumnIndexOrThrow("id"))
                sampleIds.add(sampleId)
                samples.put(sampleToJson(database, cursor, sampleId))
            }
        }
        if (sampleIds.isEmpty()) return null
        return PendingBatch(
            JSONObject().put("clientBatchId", java.util.UUID.randomUUID().toString())
                .put("measurements", samples).toString(),
            sampleIds
        )
    }

    fun deleteSamples(sampleIds: List<Long>) {
        if (sampleIds.isEmpty()) return
        val database = writableDatabase
        database.beginTransaction()
        try {
            sampleIds.forEach { sampleId ->
                database.delete("neighboring_cells", "sample_id = ?", arrayOf(sampleId.toString()))
                database.delete("samples", "id = ?", arrayOf(sampleId.toString()))
            }
            database.setTransactionSuccessful()
        } finally {
            database.endTransaction()
        }
    }

    private fun sampleToJson(database: SQLiteDatabase, cursor: android.database.Cursor, sampleId: Long): JSONObject {
        fun value(column: String): Any? {
            val index = cursor.getColumnIndexOrThrow(column)
            return if (cursor.isNull(index)) null else cursor.getDouble(index)
        }
        fun text(column: String): String? {
            val index = cursor.getColumnIndexOrThrow(column)
            return if (cursor.isNull(index)) null else cursor.getString(index)
        }
        fun cell(prefix: String): JSONObject? {
            val technology = text("${prefix}_technology") ?: return null
            return JSONObject().apply {
                put("registered", value("${prefix}_registered") == 1.0)
                put("technology", technology)
                putNumber("cellId", value("${prefix}_cell_id"))
                putNumber("pci", value("${prefix}_pci"))
                putNumber("tac", value("${prefix}_tac"))
                putNumber("arfcn", value("${prefix}_arfcn"))
                putNullable("mcc", text("${prefix}_mcc"))
                putNullable("mnc", text("${prefix}_mnc"))
                putNumber("rsrp", value("${prefix}_rsrp"))
                putNumber("rsrq", value("${prefix}_rsrq"))
                putNumber("rssi", value("${prefix}_rssi"))
                putNumber("sinr", value("${prefix}_sinr"))
                putNumber("timingAdvance", value("${prefix}_timing_advance"))
            }
        }
        val result = JSONObject().put("timestamp", cursor.getLong(cursor.getColumnIndexOrThrow("timestamp")))
        result.putNullable("environment", text("environment"))
        result.put("location", JSONObject().apply {
            putNumber("latitude", value("latitude")); putNumber("longitude", value("longitude"))
            putNumber("altitude", value("altitude")); putNumber("accuracy", value("accuracy"))
            putNumber("altitudeAccuracy", value("altitude_accuracy")); putNumber("speed", value("speed"))
            putNumber("heading", value("heading"))
        })
        result.put("motion", JSONObject().apply {
            put("accelerometer", vector(value("accelerometer_x"), value("accelerometer_y"), value("accelerometer_z")))
            put("gyroscope", vector(value("gyroscope_x"), value("gyroscope_y"), value("gyroscope_z")))
        })
        result.put("servingCell", cell("serving") ?: JSONObject.NULL)
        val neighbors = JSONArray()
        database.query("neighboring_cells", null, "sample_id = ?", arrayOf(sampleId.toString()), null, null, "id ASC").use { neighborCursor ->
            while (neighborCursor.moveToNext()) {
                neighbors.put(neighborToJson(neighborCursor))
            }
        }
        result.put("neighboringCells", neighbors)
        return result
    }

    private fun neighborToJson(cursor: android.database.Cursor): JSONObject {
        fun number(column: String): Any? {
            val index = cursor.getColumnIndexOrThrow(column)
            return if (cursor.isNull(index)) null else cursor.getDouble(index)
        }
        fun text(column: String): String? {
            val index = cursor.getColumnIndexOrThrow(column)
            return if (cursor.isNull(index)) null else cursor.getString(index)
        }
        return JSONObject().apply {
            put("registered", number("registered") == 1.0)
            put("technology", text("technology"))
            putNumber("cellId", number("cell_id")); putNumber("pci", number("pci"))
            putNumber("tac", number("tac")); putNumber("arfcn", number("arfcn"))
            putNullable("mcc", text("mcc")); putNullable("mnc", text("mnc"))
            putNumber("rsrp", number("rsrp")); putNumber("rsrq", number("rsrq"))
            putNumber("rssi", number("rssi")); putNumber("sinr", number("sinr"))
            putNumber("timingAdvance", number("timing_advance"))
        }
    }

    private fun vector(x: Any?, y: Any?, z: Any?) = JSONObject().apply {
        putNumber("x", x); putNumber("y", y); putNumber("z", z)
    }

    private fun JSONObject.putNullable(key: String, value: Any?) = put(key, value ?: JSONObject.NULL)

    private fun JSONObject.putNumber(key: String, value: Any?) = put(key, value ?: JSONObject.NULL)

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
        private const val DATABASE_VERSION = 2

        fun initialize(context: Context) {
            CollectionDatabase(context).writableDatabase.close()
        }
    }
}