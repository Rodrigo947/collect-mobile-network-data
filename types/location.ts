export interface LocationData {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy?: number | null;
    speed: number | null;
    heading: number | null;
}
