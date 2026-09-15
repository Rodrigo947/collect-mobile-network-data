import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useSettingsCardStyle() {
    const styles = StyleSheet.create({
        container: {
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        label: {
            fontSize: Typography.bodyLarge,
            fontWeight: 'bold',
            color: Colors.textLabel,
            marginBottom: 5,
            flex: 1,
        },
        iconContainer: {
            marginRight: 15,
            padding: 15,
            borderRadius: 5,
        },
    });
    return styles;
}
