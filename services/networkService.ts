import { requireNativeModule } from 'expo-modules-core';
import { NetworkSnapshotData } from '../types/network';

const GetNetworkData = requireNativeModule('GetNetworkData');

export async function getNetworkMetrics(): Promise<NetworkSnapshotData> {
    return (await GetNetworkData.getNetworkMetrics()) as NetworkSnapshotData;
}
