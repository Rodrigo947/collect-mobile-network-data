import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function useHistoryStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            padding: 10,
        },
        noSamplesContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noSamplesText: {
            fontSize: Typography.h4,
            color: Colors.text,
        },
        loader: {
            marginTop: 40,
        },
    });

    return styles;
}
