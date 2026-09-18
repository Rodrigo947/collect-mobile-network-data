import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useLocationCardStyle() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors.white,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            borderWidth: 1,
            borderColor: Colors.border,
        },
        title: {
            fontSize: Typography.h4,
            fontWeight: 'bold',
            color: Colors.textLabel,
            marginBottom: 5,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
        },
        item: {
            flex: 1,
            justifyContent: 'center',
            padding: 5,
            marginHorizontal: 5,
        },
        rowItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        label: {
            fontSize: Typography.bodyLarge,
            color: Colors.textLabel,
        },
        value: {
            fontSize: Typography.body,
            color: Colors.text,
        },
    });

    return styles;
}
