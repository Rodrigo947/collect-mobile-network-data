import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useHistoryCardStyle() {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors.white,
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            shadowColor: Colors.shadow,
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            elevation: 7,
        },
        label: {
            fontSize: Typography.bodyLarge,
            fontWeight: 'bold',
            color: Colors.textLabel,
            marginBottom: 5,
        },
        text: {
            fontSize: Typography.body,
            color: Colors.text,
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
