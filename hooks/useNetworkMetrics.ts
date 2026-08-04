import { useCallback, useEffect, useState } from 'react';
import { getNetworkMetrics } from '../services/networkService';
import { NetworkSnapshotData } from '../types/network';

export function useNetworkMetrics() {
    const [snapshot, setSnapshot] = useState<NetworkSnapshotData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getNetworkMetrics();
            setSnapshot(result);
            setError(null);
            setLoading(false);
            return result;
        } catch (err: any) {
            setError(err?.message ?? String(err));
            setLoading(false);
            return null;
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { snapshot, loading, error, refresh };
}
