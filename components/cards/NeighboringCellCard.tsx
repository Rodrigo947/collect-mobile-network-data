import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import useNeighboringCellCardStyle from '../../styles/components/neighboringCellCardStyle';
import { Colors } from '../../theme';

interface Props {
    cellID?: number | null;
    RSRP?: number | null;
    RSRQ?: number | null;
}

export default function NeighboringCellCard({ cellID, RSRP, RSRQ }: Props) {
    const styles = useNeighboringCellCardStyle();
    return (
        <View style={styles.content}>
            <View style={styles.data}>
                <Text style={styles.text}>ID: {cellID}</Text>
                <View style={styles.row}>
                    <Text style={styles.text}>RSRP: {RSRP}</Text>
                    <Text style={styles.text}>RSRQ: {RSRQ}</Text>
                </View>
            </View>
            <MaterialIcons
                name={
                    RSRP && RSRP >= -80
                        ? 'signal-cellular-alt'
                        : RSRP && RSRP >= -90
                          ? 'signal-cellular-alt-2-bar'
                          : 'signal-cellular-alt-1-bar'
                }
                size={40}
                color={
                    RSRP && RSRP >= -80
                        ? Colors.success
                        : RSRP && RSRP >= -90
                          ? Colors.warning
                          : Colors.danger
                }
            />
        </View>
    );
}
