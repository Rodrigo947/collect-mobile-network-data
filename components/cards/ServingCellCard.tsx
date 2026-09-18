import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import useServingCellCardStyle from '../../styles/components/servingCellCardStyle';
import { Colors } from '../../theme';

interface SignalGaugeProps {
    label: string;
    value?: number | null;
    minimum: number;
    maximum: number;
    color: string;
    isVisible: boolean;
}

function SignalGauge({
    label,
    value,
    minimum,
    maximum,
    color,
    isVisible,
}: SignalGaugeProps) {
    const styles = useServingCellCardStyle();
    const radius = 58;
    const circumference = Math.PI * radius;
    const progress =
        isVisible && value !== null && value !== undefined
            ? Math.min(1, Math.max(0, (value - minimum) / (maximum - minimum)))
            : 0;
    const displayValue =
        isVisible && value !== null && value !== undefined ? value : '-';

    return (
        <View style={styles.gauge}>
            <Svg width="140" height="78" viewBox="0 0 140 78">
                <Path
                    d="M 12 68 A 58 58 0 0 1 128 68"
                    fill="none"
                    stroke={Colors.disabled}
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                <Path
                    d="M 12 68 A 58 58 0 0 1 128 68"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={circumference * (1 - progress)}
                />
            </Svg>
            <View style={styles.gaugeValue}>
                <Text style={styles.gaugeNumber}>{displayValue}</Text>
                <Text style={styles.gaugeLabel}>{label}</Text>
            </View>
        </View>
    );
}

interface Props {
    isCollecting: boolean;
    isLoading: boolean;
    cellID?: number | null;
    pci?: number | null;
    arfcn?: number | null;
    timingAdvance?: number | null;
    technology?: string | null;
    RSRP?: number | null;
    RSRQ?: number | null;
}

export default function ServingCellCard({
    isCollecting,
    isLoading,
    cellID,
    pci,
    arfcn,
    timingAdvance,
    technology,
    RSRP,
    RSRQ,
}: Props) {
    const styles = useServingCellCardStyle();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Célula Servidora</Text>
            <View style={styles.row}>
                <Text style={styles.label}>ID da célula:</Text>
                <Text style={styles.value}>
                    {!isCollecting ? '-' : cellID || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>PCI:</Text>
                <Text style={styles.value}>
                    {!isCollecting ? '-' : pci || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Tecnologia:</Text>
                <Text style={styles.value}>
                    {!isCollecting ? '-' : technology || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>ARFCN:</Text>
                <Text style={styles.value}>
                    {!isCollecting ? '-' : arfcn || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Timing Advance:</Text>
                <Text style={styles.value}>
                    {!isCollecting ? '-' : timingAdvance || '-'}
                </Text>
            </View>
            <View style={styles.rowSignals}>
                <SignalGauge
                    label="RSRP"
                    value={RSRP}
                    minimum={-160}
                    maximum={-40}
                    color={Colors.primary}
                    isVisible={isCollecting && !isLoading}
                />
                <SignalGauge
                    label="RSRQ"
                    value={RSRQ}
                    minimum={-22}
                    maximum={-1}
                    color={Colors.secondary}
                    isVisible={isCollecting && !isLoading}
                />
            </View>
        </View>
    );
}
