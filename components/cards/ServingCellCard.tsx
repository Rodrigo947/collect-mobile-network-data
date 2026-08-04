import { Text, View } from 'react-native';
import useServingCellCardStyle from '../../styles/components/servingCellCardStyle';

interface Props {
    isCollecting: boolean;
    isLoading: boolean;
    cellID?: number | null;
    technology?: string | null;
    RSRP?: number | null;
    RSRQ?: number | null;
    RSSI?: number | null;
    SINR?: number | null;
}

export default function ServingCellCard({
    isCollecting,
    isLoading,
    cellID,
    technology,
    RSRP,
    RSRQ,
    RSSI,
    SINR,
}: Props) {
    const styles = useServingCellCardStyle();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Célula Servidora</Text>
            <View style={styles.row}>
                <Text style={styles.text}>ID da célula:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : cellID || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Tecnologia:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : technology || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>RSRP:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : RSRP || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>RSRQ:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : RSRQ || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>RSSI:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : RSSI || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>SINR:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : SINR || '-'}
                </Text>
            </View>
        </View>
    );
}
