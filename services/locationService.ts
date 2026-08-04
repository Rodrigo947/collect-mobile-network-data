import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { LocationData } from '../types/location';

async function requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function getCurrentLocation(): Promise<LocationData> {
    const ok = await requestPermission();

    if (!ok) throw new Error('Permissão negada.');

    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
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
