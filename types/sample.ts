import { LocationData } from './location';
import { CellMetricsData } from './network';
import { MotionData } from './sensor';

export interface SampleData {
    timestamp: number;
    location: LocationData;
    motion: MotionData;
    servingCell: CellMetricsData | null;
    neighboringCells: CellMetricsData[];
}

export interface SampleMetrics {
    sampleCount: number;

    duration: {
        ms: number;
        seconds: number;
        formatted: string;
    };

    distance: {
        totalMeters: number;
        totalKm: number;
        averageSpeedKmh: number | null;
    };

    servingCell: {
        avgRSRP: number | null;
        avgRSRQ: number | null;
        avgRSSI: number | null;
        avgSINR: number | null;
        minRSRP: number | null;
        maxRSRP: number | null;
        registeredPercentage: number;
    };

    cellAvailability: {
        avgVisibleCells: number;
        minVisibleCells: number;
        maxVisibleCells: number;
        uniqueCellCount: number;
    };

    handovers: {
        count: number;
        ratePerKm: number | null;
    };

    technologyDistribution: Record<string, number>;
}
