import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useServingCellCardStyle() {
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
        label: {
            fontSize: Typography.body,
            color: Colors.textLabel,
        },
        value: {
            fontSize: Typography.body,
            color: Colors.text,
        },
        rowSignals: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 5,
        },
        gauge: {
            width: '48%',
            height: 92,
            alignItems: 'center',
            position: 'relative',
        },
        gaugeValue: {
            position: 'absolute',
            top: 36,
            alignItems: 'center',
        },
        gaugeNumber: {
            fontSize: Typography.bodyLarge,
            fontWeight: 'bold',
            color: Colors.text,
        },
        gaugeLabel: {
            fontSize: Typography.bodySmall,
            color: Colors.textLabel,
        },
    });

    return styles;
}
