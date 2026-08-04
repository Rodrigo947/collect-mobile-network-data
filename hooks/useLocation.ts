import { useEffect, useState } from 'react';
import { LocationData } from '../types/location';
import { getCurrentLocation } from '../services/locationService';

export function useLocation() {
    const [location, setLocation] = useState<LocationData | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    async function updateLocation() {
        try {
            setLoading(true);

            const loc = await getCurrentLocation();

            setLocation(loc);

            setError(null);
            setLoading(false);
            return loc;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            return null;
        }
    }

    useEffect(() => {
        updateLocation();
    }, []);

    return {
        location,

        loading,

        error,

        refresh: updateLocation,
    };
}
