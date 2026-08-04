import { StyleSheet } from 'react-native';
import { Colors } from '../theme';

export default function useOnboardingStyleScreen(width: number) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
        },
        skipButton: {
            position: 'absolute',
            top: 26,
            right: 24,
            zIndex: 10,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            backgroundColor: Colors.backgroundLightGray,
        },
        skipText: {
            fontSize: 16,
            color: Colors.text,
            fontWeight: '600',
        },
        card: {
            width: width,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 40,
            paddingVertical: 60,
        },
        imagePlaceholder: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(255,255,255,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
        },
        imageText: {
            fontSize: 48,
            fontWeight: 'bold',
            color: '#fff',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 16,
        },
        description: {
            fontSize: 18,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: 20,
        },
        privacyHint: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginTop: 20,
        },
        link: {
            textDecorationLine: 'underline',
            fontWeight: '600',
        },
        footer: {
            height: 100,
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        dotsContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 24,
        },
        dot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginHorizontal: 6,
        },
        continueButton: {
            backgroundColor: Colors.primaryDark,
            paddingVertical: 14,
            paddingHorizontal: 40,
            borderRadius: 30,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        continueText: {
            fontSize: 18,
            fontWeight: '600',
            color: Colors.textLight,
        },
    });
    return styles;
}
