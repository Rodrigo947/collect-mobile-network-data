import { FontAwesome6 } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import useLocationCardStyle from '../../styles/components/locationCardStyle';
import { Colors } from '../../theme';

interface Props {
    isCollecting: boolean;
    isLoading: boolean;
    latitude?: number;
    longitude?: number;
}

export default function LocationCard({
    isCollecting,
    isLoading,
    latitude,
    longitude,
}: Props) {
    const styles = useLocationCardStyle();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Localização</Text>
            <View style={styles.row}>
                <View
                    style={[
                        styles.item,
                        {
                            borderRightWidth: 1,
                            borderRightColor: Colors.border,
                        },
                    ]}
                >
                    <View style={styles.rowItem}>
                        <FontAwesome6
                            name="location-dot"
                            size={20}
                            color={Colors.text}
                            style={{ marginRight: 10 }}
                        />
                        <View>
                            <Text style={styles.label}>Latitude:</Text>
                            <Text style={styles.value}>
                                {!isCollecting
                                    ? '-'
                                    : latitude?.toFixed(4) || '-'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.item}>
                    <View style={styles.rowItem}>
                        <FontAwesome6
                            name="location-dot"
                            size={20}
                            color={Colors.text}
                            style={{ marginRight: 10 }}
                        />
                        <View>
                            <Text style={styles.label}>Longitude:</Text>
                            <Text style={styles.value}>
                                {!isCollecting
                                    ? '-'
                                    : longitude?.toFixed(4) || '-'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
