import { useEffect, useState } from 'react';

import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import HistoryCard from '../components/cards/HistoryCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import StorageService from '../services/storage';
import useHistoryStyleScreen from '../styles/historyStyleScreen';
import { Colors } from '../theme';
import { SampleData } from '../types/sample';

export default function HistoryScreen() {
    const styles = useHistoryStyleScreen();
    const [loading, setLoading] = useState(true);
    const [samples, setSamples] = useState<SampleData[][]>([]);

    useEffect(() => {
        const fetchSamples = async () => {
            const storedSamples = await StorageService.getSamples();
            setSamples(storedSamples);
            setLoading(false);
        };

        fetchSamples();
    }, []);

    return (
        <>
            <ScreenContainer>
                <AppHeader title="Histórico" showBackButton={true} />
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
