import { LocationData } from '../types/location';
import { CellMetricsData } from '../types/network';
import { SampleData, SampleMetrics } from '../types/sample';

function validNumbers(values: Array<number | null | undefined>): number[] {
    return values.filter(
        (v): v is number => v !== null && v !== undefined && !Number.isNaN(v),
    );
}

function average(values: Array<number | null | undefined>): number | null {
    const nums = validNumbers(values);
    if (nums.length === 0) return null;
    return nums.reduce((sum, v) => sum + v, 0) / nums.length;
}

function haversineDistanceMeters(a: LocationData, b: LocationData): number {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);

    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
}

function cellKey(cell: CellMetricsData | null | undefined): string | null {
    if (!cell || !cell.registered) return null;
    
    const id = cell.cellId ?? 'no-cellid';
    const pci = cell.pci ?? 'no-pci';
    return `${id}:${pci}`;
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}min`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
}

export function calculateDuration(
    samples: SampleData[],
): SampleMetrics['duration'] {
    if (samples.length < 2) {
        return { ms: 0, seconds: 0, formatted: '0s' };
    }
    const sorted = [...samples].sort((a, b) => a.timestamp - b.timestamp);
    const ms = sorted[sorted.length - 1].timestamp - sorted[0].timestamp;

    return {
        ms,
        seconds: ms / 1000,
        formatted: formatDuration(ms),
    };
}

export function calculateTotalDistance(samples: SampleData[]): number {
    if (samples.length < 2) return 0;
    const sorted = [...samples].sort((a, b) => a.timestamp - b.timestamp);

    let total = 0;
    for (let i = 1; i < sorted.length; i++) {
        total += haversineDistanceMeters(
            sorted[i - 1].location,
            sorted[i].location,
        );
    }
    return total;
}

export function calculateServingCellStats(
    samples: SampleData[],
): SampleMetrics['servingCell'] {
    const registeredSamples = samples.filter(s => s.servingCell?.registered);

    const rsrpValues = registeredSamples.map(s => s.servingCell?.rsrp);
    const rsrqValues = registeredSamples.map(s => s.servingCell?.rsrq);
    const rssiValues = registeredSamples.map(s => s.servingCell?.rssi);
    const sinrValues = registeredSamples.map(s => s.servingCell?.sinr);

    const validRsrp = validNumbers(rsrpValues);

    return {
        avgRSRP: average(rsrpValues),
        avgRSRQ: average(rsrqValues),
        avgRSSI: average(rssiValues),
        avgSINR: average(sinrValues),
        minRSRP: validRsrp.length ? Math.min(...validRsrp) : null,
        maxRSRP: validRsrp.length ? Math.max(...validRsrp) : null,
        registeredPercentage: samples.length
            ? (registeredSamples.length / samples.length) * 100
            : 0,
    };
}

export function calculateCellAvailability(
    samples: SampleData[],
): SampleMetrics['cellAvailability'] {
    const uniqueCells = new Set<string>();
    const visibleCounts: number[] = [];

    for (const sample of samples) {
        let count = 0;

        const servingKey = cellKey(sample.servingCell);
        if (servingKey) {
            count += 1;
            uniqueCells.add(servingKey);
        }

        for (const neighbor of sample.neighboringCells) {
            const key = cellKey(neighbor);
            if (key) {
                count += 1;
                uniqueCells.add(key);
            }
        }

        visibleCounts.push(count);
    }

    return {
        avgVisibleCells: average(visibleCounts) ?? 0,
        minVisibleCells: visibleCounts.length ? Math.min(...visibleCounts) : 0,
        maxVisibleCells: visibleCounts.length ? Math.max(...visibleCounts) : 0,
        uniqueCellCount: uniqueCells.size,
    };
}

export function calculateHandovers(
    samples: SampleData[],
    distanceMeters?: number,
): SampleMetrics['handovers'] {
    const sorted = [...samples].sort((a, b) => a.timestamp - b.timestamp);

    let count = 0;
    let lastKey: string | null = null;

    for (const sample of sorted) {
        const key = cellKey(sample.servingCell);
        if (key && lastKey && key !== lastKey) {
            count++;
        }
        if (key) lastKey = key;
    }

    const km = (distanceMeters ?? calculateTotalDistance(samples)) / 1000;
    const ratePerKm = km > 0 ? count / km : null;

    return { count, ratePerKm };
}

export function calculateTechnologyDistribution(
    samples: SampleData[],
): Record<string, number> {
    const counts: Record<string, number> = {};
    let total = 0;

    for (const sample of samples) {
        if (sample.servingCell?.registered) {
            const tech = sample.servingCell.technology || 'UNKNOWN';
            counts[tech] = (counts[tech] ?? 0) + 1;
            total++;
        }
    }

    const distribution: Record<string, number> = {};
    for (const [tech, count] of Object.entries(counts)) {
        distribution[tech] = total > 0 ? (count / total) * 100 : 0;
    }
    return distribution;
}
