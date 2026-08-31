import { useEffect, useRef, useState } from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppButton from '../components/buttons/AppButton';
import LocationCard from '../components/cards/LocationCard';
import NeighboringCellCard from '../components/cards/NeighboringCellCard';
import ServingCellCard from '../components/cards/ServingCellCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import { useLocation } from '../hooks/useLocation';
import { useNetworkMetrics } from '../hooks/useNetworkMetrics';
import { useSensor } from '../hooks/useSensor';
import StorageService from '../services/storage';
import useHomeStyleScreen from '../styles/homeStyleScreen';
import { CellMetricsData } from '../types/network';
import { SampleData } from '../types/sample';

import { Colors } from '../theme';

export default function HomeScreen() {
    const styles = useHomeStyleScreen();
    const router = useRouter();

    const [isCollecting, setIsCollecting] = useState(false);
    const [seconds, setSeconds] = useState<number>(0);
    const [servingCell, setServingCell] = useState<CellMetricsData | null>(
        null,
    );
    const [neighboringCells, setNeighboringCells] = useState<CellMetricsData[]>(
        [],
    );
    const [samplesData, setSamplesData] = useState<SampleData[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const {
        location,
        loading: locLoading,
        error: locError,
        refresh: refreshLocation,
    } = useLocation();

    const {
        loading: netLoading,
        error: netError,
        refresh: refreshNetwork,
    } = useNetworkMetrics();

    const {
        accelerometer,
        gyroscope,
        error,
        refresh: refreshSensor,
    } = useSensor();

    const handleStartCollecting = () => {
        if (isCollecting) {
            setIsCollecting(false);
            StorageService.insertSamples(samplesData);
        } else {
            setIsCollecting(true);
            setSamplesData([]);
            setServingCell(null);
            setNeighboringCells([]);
            setSeconds(0);
        }
    };

    const handleHistory = () => {
        router.navigate('/history');
    };

    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
            2,
            '0',
        )}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (isCollecting) {
            intervalRef.current = setInterval(async () => {
                const [newLocation, newSnapshot, newMotion] = await Promise.all(
                    [refreshLocation(), refreshNetwork(), refreshSensor()],
                );

                setSeconds(prev => prev + 1);

                if (!newLocation || !newSnapshot || !newMotion) {
                    return;
                }

                const serving =
                    newSnapshot.cells.find(
                        (cell: CellMetricsData) => cell.registered,
                    ) || null;
                const neighboring = newSnapshot.cells.filter(
                    (cell: CellMetricsData) => !cell.registered,
                );

                setServingCell(serving);
                setNeighboringCells(neighboring);

                const newSample: SampleData = {
                    timestamp: Date.now(),
                    location: newLocation,
                    motion: newMotion,
                    servingCell: serving,
                    neighboringCells: neighboring,
                };
                setSamplesData(prev => [...prev, newSample]);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isCollecting, refreshLocation, refreshNetwork]);

    return (
        <>
            <ScreenContainer style={styles.container}>
                <AppHeader title="Coleta de Dados" showBackButton={false} />
                <ScrollView style={styles.content}>
                    <View style={styles.overviewContainer}>
                        <View style={styles.overview}>
                            <Entypo
                                name="stopwatch"
                                size={30}
                                color={Colors.text}
                            />
                            <View style={styles.overviewTextContainer}>
                                <Text
                                    style={[
                                        styles.overviewLabel,
                                        { fontWeight: 'bold' },
                                    ]}
                                >
                                    Tempo
                                </Text>
                                <Text style={styles.overviewText}>
                                    {isCollecting ? formatTime(seconds) : '-'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.overview}>
                            <Entypo
                                name="archive"
                                size={30}
                                color={Colors.text}
                            />
                            <View style={styles.overviewTextContainer}>
                                <Text
                                    style={[
                                        styles.overviewLabel,
                                        { fontWeight: 'bold' },
                                    ]}
                                >
                                    Amostras
                                </Text>
                                <Text style={styles.overviewText}>
                                    {isCollecting ? samplesData.length : '-'}
                                </Text>
                            </View>
                        </View>
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
                        isLoading={locLoading}
                        latitude={location?.latitude}
                        longitude={location?.longitude}
                    />
                    <ServingCellCard
                        isCollecting={isCollecting}
                        isLoading={netLoading}
                        cellID={servingCell?.pci}
                        technology={servingCell?.technology}
                        RSRP={servingCell?.rsrp}
                        RSRQ={servingCell?.rsrq}
                        RSSI={servingCell?.rssi}
                        SINR={servingCell?.sinr}
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
                                        {index <
                                            neighboringCells.length - 1 && (
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
                        onPress={handleStartCollecting}
                    />
                </View>
            </ScreenContainer>
        </>
    );
}
