import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function useProfileStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: Colors.white,
        },
        content: {
            padding: 20,
        },
        loadingContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            paddingVertical: 40,
        },
        error: {
            color: Colors.text,
            textAlign: 'center',
            marginTop: 24,
            fontSize: Typography.body,
        },
        label: {
            color: Colors.textSecondary,
            fontSize: Typography.bodyLarge,
            marginTop: 16,
        },
        value: {
            color: Colors.text,
            fontSize: Typography.body,
            marginTop: 4,
        },
    });

    return styles;
}
