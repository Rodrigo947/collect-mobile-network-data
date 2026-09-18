import { useEffect, useRef, useState } from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppButton from '../components/buttons/AppButton';
import LocationCard from '../components/cards/LocationCard';
import NeighboringCellCard from '../components/cards/NeighboringCellCard';
import ServingCellCard from '../components/cards/ServingCellCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import ModalEnvironmentType from '../components/modals/ModalEnvironmentType';
import ModalInfo from '../components/modals/ModalInfo';
import {
    getCollectionData,
    getCollectionServiceStatus,
    setEnvironment,
    startCollectionService,
    stopCollectionService,
} from '../services/networkService';
import useHomeStyleScreen from '../styles/homeStyleScreen';
import { CellMetricsData } from '../types/network';
import { SampleData } from '../types/sample';

import { Colors } from '../theme';

export default function HomeScreen() {
    const styles = useHomeStyleScreen();
    const router = useRouter();

    const [isCollecting, setIsCollecting] = useState(false);
    const [servingCell, setServingCell] = useState<CellMetricsData | null>(
        null,
    );
    const [neighboringCells, setNeighboringCells] = useState<CellMetricsData[]>(
        [],
    );

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [location, setLocation] = useState<SampleData['location'] | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(true);
    const collectionInFlightRef = useRef(false);

    //Modal
    const [showModalEnv, setShowModalEnv] = useState(false);
    const [showModalInfo, setShowModalInfo] = useState(false);
    const handleModalSetEnvironmentAndStart = async (env: string) => {
        try {
            await setEnvironment(env);
            setShowModalEnv(false);
            const started = await startCollectionService();
            if (started) {
                setIsCollecting(true);
                setServingCell(null);
                setNeighboringCells([]);
            }
        } catch (error) {
            setShowModalInfo(true);
            console.warn(
                'Falha ao iniciar coleta em segundo plano:',
                error instanceof Error ? error.message : error,
            );
        }
    };

    const handleStartCollecting = async () => {
        if (isCollecting) {
            await stopCollectionService();
            setIsCollecting(false);
        } else {
            setShowModalEnv(true);
        }
    };

    const handleHistory = () => {
        router.navigate('/history');
    };

    const handleSettings = () => {
        router.navigate('/settings');
    };

    useEffect(() => {
        getCollectionServiceStatus()
            .then(setIsCollecting)
            .catch(error => {
                console.warn('Falha ao consultar status da coleta:', error);
            });
    }, []);

    useEffect(() => {
        if (isCollecting) {
            const collect = async () => {
                if (collectionInFlightRef.current) return;

                collectionInFlightRef.current = true;

                try {
                    const data = await getCollectionData();

                    if (
                        !data.location ||
                        !data.motion.accelerometer ||
                        !data.motion.gyroscope
                    ) {
                        if (!data.location) {
                            console.warn(
                                'Localização não disponível, aguardando fixo...',
                            );
                        }
                        return;
                    }

                    const serving = data.servingCell;
                    const neighboring = data.neighboringCells;

                    setServingCell(serving);
                    setNeighboringCells(neighboring);
                    setLocation(data.location);
                    setIsLoading(false);
                } catch (error) {
                    console.warn(
                        'Falha ao coletar dados:',
                        error instanceof Error ? error.message : error,
                    );
                } finally {
                    collectionInFlightRef.current = false;
                }
            };

            collect();
            intervalRef.current = setInterval(collect, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            collectionInFlightRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isCollecting]);

    return (
        <ScreenContainer style={styles.container}>
            <AppHeader
                title="Coleta de Dados"
                showRightButton={true}
                iconRightName="gear"
                onRightPress={handleSettings}
            />
            <ModalEnvironmentType
                visible={showModalEnv}
                onClose={() => setShowModalEnv(false)}
                onInsert={handleModalSetEnvironmentAndStart}
            />
            <ModalInfo
                visible={showModalInfo}
                title="Erro"
                message="Falha ao iniciar coleta em segundo plano."
                onClose={() => setShowModalInfo(false)}
            />
            <ScrollView style={styles.content}>
                <View style={styles.overviewContainer}>
                    <Text style={styles.statusText}>
                        Status: {isCollecting ? 'Coletando...' : 'Parado'}
                    </Text>
                    <TouchableOpacity
                        onPress={handleHistory}
                        style={styles.historyButton}
                        hitSlop={{
                            top: 10,
                            bottom: 10,
                            left: 10,
                            right: 10,
                        }}
                    >
                        <FontAwesome5
                            name="history"
                            size={30}
                            color={Colors.text}
                        />
                    </TouchableOpacity>
                </View>
                <LocationCard
                    isCollecting={isCollecting}
                    isLoading={isLoading}
                    latitude={location?.latitude}
                    longitude={location?.longitude}
                />
                <ServingCellCard
                    isCollecting={isCollecting}
                    isLoading={isLoading}
                    cellID={servingCell?.cellId}
                    pci={servingCell?.pci}
                    arfcn={servingCell?.arfcn}
                    timingAdvance={servingCell?.timingAdvance}
                    technology={servingCell?.technology}
                    RSRP={servingCell?.rsrp}
                    RSRQ={servingCell?.rsrq}
                />
                <View style={styles.neighboringCellsContainer}>
                    <Text style={styles.neighboringCellsTitle}>
                        Células Vizinhas
                    </Text>
                    {isCollecting ? (
                        neighboringCells && neighboringCells.length > 0 ? (
                            neighboringCells.map((cell, index) => (
                                <View key={index}>
                                    <NeighboringCellCard
                                        cellID={cell.pci}
                                        RSRP={cell.rsrp}
                                        RSRQ={cell.rsrq}
                                    />
                                    {index < neighboringCells.length - 1 && (
                                        <View style={styles.divisor} />
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noCell}>
                                Nenhuma célula vizinha encontrada.
                            </Text>
                        )
                    ) : (
                        <Text style={styles.noCell}>
                            Coleta de dados não iniciada.
                        </Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.startButtonContainer}>
                <AppButton
                    title={isCollecting ? 'Parar Coleta' : 'Iniciar Coleta'}
                    styleButton={{
                        ...styles.startButton,
                        backgroundColor: isCollecting
                            ? Colors.backgroundButtonStop
                            : Colors.backgroundButtonStart,
                    }}
                    rightIcon={isCollecting ? 'stop' : 'play'}
                    onPress={() => handleStartCollecting()}
                />
            </View>
        </ScreenContainer>
    );
}
