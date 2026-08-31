import { Accelerometer, Gyroscope } from 'expo-sensors';

import { MotionData, SensorData } from '../types/sensor';

let latestAccelerometer: SensorData | null = null;
let latestGyroscope: SensorData | null = null;

let accelerometerSubscription: ReturnType<
    typeof Accelerometer.addListener
> | null = null;

let gyroscopeSubscription: ReturnType<typeof Gyroscope.addListener> | null =
    null;

let initialized = false;

export function startSensorService(interval: number = 1000): void {
    if (initialized) return;

    Accelerometer.setUpdateInterval(interval);
    Gyroscope.setUpdateInterval(interval);

    accelerometerSubscription = Accelerometer.addListener(data => {
        latestAccelerometer = {
            x: data.x,
            y: data.y,
            z: data.z,
        };
    });

    gyroscopeSubscription = Gyroscope.addListener(data => {
        latestGyroscope = {
            x: data.x,
            y: data.y,
            z: data.z,
        };
    });

    initialized = true;
}

export async function getSensorData(): Promise<MotionData> {
    if (!initialized) {
        startSensorService();
    }

    if (!latestAccelerometer || !latestGyroscope) {
        throw new Error('Dados dos sensores ainda não disponíveis.');
    }

    return {
        accelerometer: latestAccelerometer,
        gyroscope: latestGyroscope,
    };
}

export function stopSensorService(): void {
    if (accelerometerSubscription) {
        accelerometerSubscription.remove();
        accelerometerSubscription = null;
    }

    if (gyroscopeSubscription) {
        gyroscopeSubscription.remove();
        gyroscopeSubscription = null;
    }

    latestAccelerometer = null;
    latestGyroscope = null;
    initialized = false;
}
