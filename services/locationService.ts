import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { LocationData } from '../types/location';

export async function requestLocationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function getCurrentLocation(): Promise<LocationData> {
    const ok = await requestLocationPermission();

    if (!ok) throw new Error('Permissão negada.');

    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    altitude: position.coords.altitude,
                    accuracy: position.coords.accuracy,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    speed: position.coords.speed,
                    heading: position.coords.heading,
                });
            },

            error => reject(error),

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 1000,
            },
        );
    });
}
