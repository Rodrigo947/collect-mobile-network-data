export interface CellMetricsData {
    registered: boolean;
    technology: 'LTE' | 'NR' | 'WCDMA' | 'GSM' | 'UNKNOWN' | string;
    cellId?: number | null;
    pci?: number | null;
    tac?: number | null;
    arfcn?: number | null;
    mcc?: string | null;
    mnc?: string | null;
    rsrp?: number | null;
    rsrq?: number | null;
    rssi?: number | null;
    sinr?: number | null;
}

export interface NetworkSnapshotData {
    timestamp: number;
    operator: string;
    networkType: string;
    cells: CellMetricsData[];
}
