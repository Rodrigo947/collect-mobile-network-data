import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useLocationCardStyle() {
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
        text: {
            fontSize: Typography.body,
            color: Colors.text,
        },
    });

    return styles;
}
