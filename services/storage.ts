import AsyncStorage from '@react-native-async-storage/async-storage';
import { SampleData } from '../types/sample';

const TERMS_KEY = '@geonetcollect:acceptedTerms';

class StorageService {
    async hasAcceptedTerms(): Promise<boolean> {
        try {
            const value = await AsyncStorage.getItem(TERMS_KEY);

            return value === 'true';
        } catch (error) {
            console.error('Erro ao ler AsyncStorage:', error);

            return false;
        }
    }

    async acceptTerms(): Promise<void> {
        try {
            await AsyncStorage.setItem(TERMS_KEY, 'true');
        } catch (error) {
            console.error('Erro ao salvar AsyncStorage:', error);
        }
    }

    async insertSamples(samples: SampleData[]): Promise<void> {
        try {
            const samplesJson = await AsyncStorage.getItem('samples');
            const existingSamples = samplesJson ? JSON.parse(samplesJson) : [];
            existingSamples.push(samples);
            await AsyncStorage.setItem(
                'samples',
                JSON.stringify(existingSamples),
            );
        } catch (error) {
            console.error('Erro ao inserir amostra:', error);
        }
    }

    async getSamples(): Promise<SampleData[][]> {
        try {
            const samplesJson = await AsyncStorage.getItem('samples');
            return samplesJson ? JSON.parse(samplesJson) : [];
        } catch (error) {
            console.error('Erro ao obter amostras:', error);
            return [];
        }
    }

    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error(error);
        }
    }
}

export default new StorageService();
