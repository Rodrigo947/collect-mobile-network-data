import { requireNativeModule } from 'expo-modules-core';
import { NetworkSnapshotData } from '../types/network';
import { SampleData } from '../types/sample';

const GetNetworkData = requireNativeModule('GetNetworkData');

export async function getNetworkMetrics(): Promise<NetworkSnapshotData> {
    const result = await GetNetworkData.getNetworkMetrics();

    if (result?.error) {
        throw new Error(result.message ?? 'Falha ao obter dados de rede.');
    }

    return result as NetworkSnapshotData;
}

export async function getLocationData(): Promise<
    SampleData['location'] | null
> {
    const result = await GetNetworkData.getLocationData();

    if (result?.error) {
        throw new Error(result.message ?? 'Falha ao obter localização.');
    }

    return result.location as SampleData['location'] | null;
}

export async function getSensorData(): Promise<SampleData['motion']> {
    const result = await GetNetworkData.getSensorData();

    if (result?.error) {
        throw new Error(result.message ?? 'Falha ao obter sensores.');
    }

    return result as SampleData['motion'];
}

export async function getCollectionData(): Promise<SampleData> {
    const [network, location, motion] = await Promise.all([
        getNetworkMetrics(),
        getLocationData(),
        getSensorData(),
    ]);

    return {
        timestamp: network.timestamp,
        location,
        motion,
        servingCell: network.cells.find(cell => cell.registered) ?? null,
        neighboringCells: network.cells.filter(cell => !cell.registered),
    } as SampleData;
}
