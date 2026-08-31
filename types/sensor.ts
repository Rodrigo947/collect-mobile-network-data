export interface SensorData {
    x: number;
    y: number;
    z: number;
}

export interface MotionData {
    accelerometer: SensorData;
    gyroscope: SensorData;
}
