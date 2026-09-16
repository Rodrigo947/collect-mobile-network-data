import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useHistoryCardStyle() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors.backgroundLight,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
        },
        label: {
            fontSize: Typography.bodyLarge,
            fontWeight: 'bold',
            color: Colors.textLabel,
            marginBottom: 5,
        },
        text: {
            fontSize: Typography.body,
            color: Colors.textLabel,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10,
        },
        group: {
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            paddingTop: 10,
        },
        subLabel: {
            fontSize: Typography.body,
            fontWeight: 'bold',
            color: Colors.textLabel,
        },
        rowItem: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        saveButton: {
            marginTop: 10,
            backgroundColor: Colors.primary,
        },
    });
    return styles;
}
