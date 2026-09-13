import { PermissionsAndroid, Platform } from 'react-native';

const runtimePermissions = [
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
];

function supportsBackgroundLocation(): boolean {
    return Platform.OS === 'android' && Number(Platform.Version) >= 29;
}

function supportsNotifications(): boolean {
    return Platform.OS === 'android' && Number(Platform.Version) >= 33;
}

export async function hasRequiredPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const permissions = [...runtimePermissions];
    if (supportsBackgroundLocation()) {
        permissions.push(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
    }
    if (supportsNotifications()) {
        permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const results = await Promise.all(
        permissions.map(permission => PermissionsAndroid.check(permission)),
    );
    return results.every(Boolean);
}

export async function requestRequiredPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    const foregroundResults =
        await PermissionsAndroid.requestMultiple(runtimePermissions);
    const foregroundGranted = runtimePermissions.every(
        permission =>
            foregroundResults[permission] ===
            PermissionsAndroid.RESULTS.GRANTED,
    );
    if (!foregroundGranted) return false;

    if (supportsBackgroundLocation()) {
        const backgroundResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        if (backgroundResult !== PermissionsAndroid.RESULTS.GRANTED) {
            return false;
        }
    }

    if (supportsNotifications()) {
        const notificationResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (notificationResult !== PermissionsAndroid.RESULTS.GRANTED) {
            return false;
        }
    }

    return hasRequiredPermissions();
}
