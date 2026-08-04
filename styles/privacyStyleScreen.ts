import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function usePrivacyStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.background,
        },
        title: {
            fontSize: Typography.h1,
            color: Colors.text,
        },
    });
    return styles;
}
