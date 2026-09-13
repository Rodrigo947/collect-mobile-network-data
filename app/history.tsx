import { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Button,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import HistoryCard from '../components/cards/HistoryCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import {
    getStoredSampleCount,
    sendStoredSamples,
} from '../services/networkService';
import StorageService from '../services/storage';
import useHistoryStyleScreen from '../styles/historyStyleScreen';
import { Colors } from '../theme';
import { SampleData } from '../types/sample';

export default function HistoryScreen() {
    const styles = useHistoryStyleScreen();
    const [loading, setLoading] = useState(true);
    const [samples, setSamples] = useState<SampleData[][]>([]);
    const [storedSampleCount, setStoredSampleCount] = useState(0);

    useEffect(() => {
        const fetchSamples = async () => {
            const storedSamples = await StorageService.getSamples();
            setSamples(storedSamples);
            setStoredSampleCount(await getStoredSampleCount());
            setLoading(false);
        };

        fetchSamples();
    }, []);

    const handleSendStoredSamples = async () => {
        try {
            const sent = await sendStoredSamples();
            if (sent) {
                setStoredSampleCount(await getStoredSampleCount());
            }
            Toast.show({
                type: sent ? 'success' : 'error',
                text1: sent ? 'Coletas enviadas' : 'Falha ao enviar coletas',
                text2: sent
                    ? 'Os dados foram enviados com sucesso.'
                    : 'Nenhum dado foi enviado.',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Falha ao enviar coletas',
                text2:
                    error instanceof Error ? error.message : 'Tente novamente.',
            });
        }
    };

    return (
        <>
            <ScreenContainer>
                <AppHeader title="Histórico" showBackButton={true} />
                <Text>Coletas armazenadas: {storedSampleCount}</Text>
                <Button
                    title="Enviar coletas"
                    onPress={handleSendStoredSamples}
                />
                {loading ? (
                    <View style={styles.noSamplesContainer}>
                        <ActivityIndicator
                            size="large"
                            color={Colors.primary}
                            style={styles.loader}
                        />
                    </View>
                ) : samples.length === 0 ? (
                    <View style={styles.noSamplesContainer}>
                        <Text style={styles.noSamplesText}>
                            Nenhuma coleta encontrada.
                        </Text>
                    </View>
                ) : (
                    <ScrollView style={styles.container}>
                        {samples.map((sampleGroup, index) => (
                            <HistoryCard key={index} samples={sampleGroup} />
                        ))}
                    </ScrollView>
                )}
            </ScreenContainer>
        </>
    );
}
