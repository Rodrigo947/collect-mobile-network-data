import { useEffect, useState } from 'react';

import { FontAwesome5 } from '@expo/vector-icons';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import HistoryCard from '../components/cards/HistoryCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import ModalInfo from '../components/modals/ModalInfo';
import {
    getStoredSampleCount,
    sendStoredSamples,
} from '../services/networkService';
import { getMySamples } from '../services/samplesService';
import useHistoryStyleScreen from '../styles/historyStyleScreen';
import { Colors } from '../theme';
import { APISampleData } from '../types/sample';

export default function HistoryScreen() {
    const styles = useHistoryStyleScreen();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [samples, setSamples] = useState<APISampleData['batches']>([]);
    const [pagination, setPagination] = useState<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    } | null>(null);
    const [storedSampleCount, setStoredSampleCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        fetchSamples(1);
    }, []);

    const fetchSamples = async (page: number) => {
        try {
            if (page === 1) {
                setLoading(true);
                setError(null);
            } else {
                setLoadingMore(true);
            }

            const mySamples = await getMySamples(page);
            setSamples(previousSamples =>
                page === 1
                    ? mySamples.batches
                    : [...previousSamples, ...mySamples.batches],
            );
            setPagination(mySamples.pagination);
            setCurrentPage(mySamples.pagination.page);
            setStoredSampleCount(await getStoredSampleCount());
        } catch (err) {
            if (page === 1) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Ocorreu um erro ao buscar as coletas.',
                );
            } else {
                setModalTitle('Erro!');
                setModalMessage(
                    'Falha ao carregar mais coletas. Tente novamente.',
                );
                setShowModal(true);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (
            loading ||
            loadingMore ||
            !pagination ||
            currentPage >= pagination.totalPages
        ) {
            return;
        }

        fetchSamples(currentPage + 1);
    };

    const handleSendStoredSamples = async () => {
        try {
            if (storedSampleCount === 0) {
                setModalTitle('Nenhuma coleta para enviar');
                setModalMessage(
                    'Não há coletas armazenadas localmente para serem enviadas.',
                );
                setShowModal(true);
                return;
            }
            setLoading(true);
            const sent = await sendStoredSamples();
            if (sent) {
                setStoredSampleCount(await getStoredSampleCount());
                await fetchSamples(1);
                setModalTitle('Coletas enviadas');
                setModalMessage('Os dados foram enviados com sucesso.');
                setShowModal(true);
            }
        } catch (error) {
            setModalTitle('Erro');
            setModalMessage('Falha ao enviar coletas. Tente novamente.');
            setShowModal(true);
        }
    };

    return (
        <ScreenContainer style={styles.container}>
            <AppHeader title="Histórico" showBackButton={true} />
            <ModalInfo
                title={modalTitle}
                visible={showModal}
                message={modalMessage}
                onClose={() => setShowModal(false)}
            />
            <View style={styles.localSamples}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.localSamplesLabel}>
                        Coletas salvas localmente:{' '}
                    </Text>
                    <Text style={styles.localSamplesValue}>
                        {storedSampleCount}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleSendStoredSamples}
                    style={[
                        styles.localSamplesUploadButton,
                        {
                            backgroundColor:
                                storedSampleCount > 0
                                    ? Colors.primary
                                    : Colors.disabled,
                        },
                    ]}
                >
                    <FontAwesome5
                        name={'upload'}
                        size={22}
                        color={Colors.backgroundLight}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />
            {loading ? (
                <View style={styles.noSamplesContainer}>
                    <ActivityIndicator
                        size="large"
                        color={Colors.primary}
                        style={styles.loader}
                    />
                </View>
            ) : error ? (
                <View style={styles.noSamplesContainer}>
                    <Text style={styles.noSamplesText}>{error}</Text>
                </View>
            ) : samples.length === 0 ? (
                <View style={styles.noSamplesContainer}>
                    <Text style={styles.noSamplesText}>
                        Nenhuma coleta encontrada.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={samples}
                    keyExtractor={sample => sample.id}
                    style={styles.listContainer}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={
                        <Text style={styles.remoteSamplesLabel}>
                            Coletas salvas remotamente
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <HistoryCard samples={item.measurements} />
                    )}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator
                                size="small"
                                color={Colors.primary}
                                style={styles.loader}
                            />
                        ) : null
                    }
                />
            )}
        </ScreenContainer>
    );
}
