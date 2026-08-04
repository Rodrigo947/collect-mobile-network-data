import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useOnBoardingCardStyle(width: number) {
    const styles = StyleSheet.create({
        icon: {
            width: 200,
            height: 200,
            marginBottom: 30,
        },
        card: {
            width: width,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
            paddingVertical: 60,
        },
        iconContainer: {
            marginBottom: 24,
        },
        title: {
            fontSize: Typography.h3,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 16,
            color: Colors.text,
        },
        description: {
            textAlign: 'center',

            color: Colors.textSecondary,
            fontSize: Typography.body,
            lineHeight: 24,
        },
        terms: {
            textAlign: 'center',
            marginTop: 26,
            color: Colors.textSecondary,
            fontSize: Typography.body,
            lineHeight: 30,
            padding: 0,
        },
        link: {
            color: Colors.primary,
            textDecorationLine: 'underline',
            fontSize: Typography.body,
        },
    });

    return styles;
}
