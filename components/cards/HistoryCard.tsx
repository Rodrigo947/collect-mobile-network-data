import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import useHistoryCardStyle from '../../styles/components/historyCardStyle';
import { Colors } from '../../theme';
import { SampleData, SampleMetrics } from '../../types/sample';
import {
    calculateCellAvailability,
    calculateDuration,
    calculateHandovers,
    calculateServingCellStats,
    calculateTechnologyDistribution,
    calculateTotalDistance,
} from '../../utils/metrics';

interface Props {
    samples: SampleData[];
}

const data: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
};
const hour: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
};

export function calculateSampleMetrics(samples: SampleData[]): SampleMetrics {
    if (!samples || samples.length === 0) {
        return {
            sampleCount: 0,
            duration: { ms: 0, seconds: 0, formatted: '0s' },
            distance: { totalMeters: 0, totalKm: 0, averageSpeedKmh: null },
            servingCell: {
                avgRSRP: null,
                avgRSRQ: null,
                avgRSSI: null,
                avgSINR: null,
                minRSRP: null,
                maxRSRP: null,
                registeredPercentage: 0,
            },
            cellAvailability: {
                avgVisibleCells: 0,
                minVisibleCells: 0,
                maxVisibleCells: 0,
                uniqueCellCount: 0,
            },
            handovers: { count: 0, ratePerKm: null },
            technologyDistribution: {},
        };
    }

    const duration = calculateDuration(samples);
    const totalMeters = calculateTotalDistance(samples);
    const totalKm = totalMeters / 1000;
    const hours = duration.seconds / 3600;
    const averageSpeedKmh = hours > 0 ? totalKm / hours : null;

    return {
        sampleCount: samples.length,
        duration,
        distance: {
            totalMeters,
            totalKm,
            averageSpeedKmh,
        },
        servingCell: calculateServingCellStats(samples),
        cellAvailability: calculateCellAvailability(samples),
        handovers: calculateHandovers(samples, totalMeters),
        technologyDistribution: calculateTechnologyDistribution(samples),
    };
}

export default function HistoryCard({ samples }: Props) {
    const styles = useHistoryCardStyle();
    const [expanded, setExpanded] = useState(false);

    const metrics = calculateSampleMetrics(samples);

    let dateFormatted = '';
    let hourFormatted = '';
    if (samples && samples[0] && typeof samples[0].timestamp === 'string') {
        const firstDate = new Date(samples[0].timestamp);

        dateFormatted = samples[0]
            ? new Intl.DateTimeFormat('pt-BR', data).format(firstDate)
            : '';
        hourFormatted = samples[0]
            ? new Intl.DateTimeFormat('pt-BR', hour).format(firstDate)
            : '';
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>
                        Coleta: {dateFormatted} {hourFormatted}
                    </Text>
                    <Text style={styles.text}>Amostras: {samples.length}</Text>
                </View>
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <FontAwesome5
                        name={expanded ? 'angle-up' : 'angle-down'}
                        size={30}
                        color={Colors.textLabel}
                    />
                </TouchableOpacity>
            </View>
            {expanded && (
                <View>
                    <View style={styles.group}>
                        <Text style={styles.subLabel}>Percurso</Text>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>
                                Distância percorrida:{' '}
                            </Text>
                            <Text style={styles.text}>
                                {metrics.distance.totalKm.toFixed(2)} km
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>Velocidade média: </Text>
                            <Text style={styles.text}>
                                {metrics.distance.averageSpeedKmh?.toFixed(2) ||
                                    'N/A'}{' '}
                                km/h
                            </Text>
                        </View>
                    </View>
                    <View style={styles.group}>
                        <Text style={styles.subLabel}>Células</Text>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>Tempo de coleta:</Text>
                            <Text style={styles.text}>
                                {metrics.duration.formatted}
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>RSRP médio: </Text>
                            <Text style={styles.text}>
                                {metrics.servingCell.avgRSRP?.toFixed(2) ||
                                    'N/A'}{' '}
                                dBm
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>RSRQ médio: </Text>
                            <Text style={styles.text}>
                                {metrics.servingCell.avgRSRQ?.toFixed(2) ||
                                    'N/A'}{' '}
                                dB
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>RSSI médio: </Text>
                            <Text style={styles.text}>
                                {metrics.servingCell.avgRSSI?.toFixed(2) ||
                                    'N/A'}{' '}
                                dBm
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>SINR médio: </Text>
                            <Text style={styles.text}>
                                {metrics.servingCell.avgSINR?.toFixed(2) ||
                                    'N/A'}{' '}
                                dB
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>
                                Quantidade de células únicas:{' '}
                            </Text>
                            <Text style={styles.text}>
                                {metrics.cellAvailability.uniqueCellCount}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.group}>
                        <Text style={styles.subLabel}>Handovers</Text>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>
                                Quantidade de handovers:
                            </Text>
                            <Text style={styles.text}>
                                {metrics.handovers.count}
                            </Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={styles.text}>
                                Taxa de handovers por km:{' '}
                            </Text>
                            <Text style={styles.text}>
                                {metrics.handovers.ratePerKm?.toFixed(2) ||
                                    'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
