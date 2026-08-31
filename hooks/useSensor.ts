import { useEffect, useState } from 'react';

import {
    getSensorData,
    startSensorService,
    stopSensorService,
} from '../services/sensorService';

import { SensorData } from '../types/sensor';

export function useSensor() {
    const [accelerometer, setAccelerometer] = useState<SensorData | null>(null);

    const [gyroscope, setGyroscope] = useState<SensorData | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        startSensorService();

        return () => {
            stopSensorService();
        };
    }, []);

    async function refresh() {
        try {
            const data = await getSensorData();

            setAccelerometer(data.accelerometer);
            setGyroscope(data.gyroscope);
            setError(null);

            return data;
        } catch (err: any) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Erro ao obter dados dos sensores.';

            setError(message);

            return null;
        }
    }

    return {
        accelerometer,
        gyroscope,
        error,
        refresh,
    };
}
