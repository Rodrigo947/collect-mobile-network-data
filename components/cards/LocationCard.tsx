import { Text, View } from 'react-native';
import useLocationCardStyle from '../../styles/components/locationCardStyle';

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
                <Text style={styles.text}>Latitude:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : latitude?.toFixed(4) || '-'}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>Longitude:</Text>
                <Text style={styles.text}>
                    {!isCollecting ? '-' : longitude?.toFixed(4) || '-'}
                </Text>
            </View>
        </View>
    );
}
