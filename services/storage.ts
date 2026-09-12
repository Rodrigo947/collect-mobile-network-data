import AsyncStorage from '@react-native-async-storage/async-storage';
import { SampleData } from '../types/sample';

const TERMS_KEY = '@geonetcollect:acceptedTerms';
const PARTICIPANT_ID_KEY = '@geonetcollect:participantId';
const PARTICIPANT_TOKEN_KEY = '@geonetcollect:participantToken';

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

    async saveParticipantCredentials(
        participantId: string,
        token: string,
    ): Promise<void> {
        await Promise.all([
            AsyncStorage.setItem(PARTICIPANT_ID_KEY, participantId),
            AsyncStorage.setItem(PARTICIPANT_TOKEN_KEY, token),
        ]);
    }

    async getParticipantId(): Promise<string | null> {
        return AsyncStorage.getItem(PARTICIPANT_ID_KEY);
    }

    async getParticipantToken(): Promise<string | null> {
        return AsyncStorage.getItem(PARTICIPANT_TOKEN_KEY);
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
