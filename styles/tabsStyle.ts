import { StyleSheet } from 'react-native';

export default function useTabsStyle() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 72,
            gap: 20,
            backgroundColor: '#F4F7FB',
        },
        title: {
            fontSize: 30,
            fontWeight: '800',
            color: '#102A43',
        },
        subtitle: {
            fontSize: 15,
            color: '#52606D',
        },
        button: {
            alignSelf: 'flex-start',
            backgroundColor: '#0B69A3',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 14,
        },
        buttonText: {
            color: '#FFFFFF',
            fontWeight: '700',
        },
        card: {
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 18,
            gap: 6,
            shadowColor: '#102A43',
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            elevation: 4,
        },
        rowLabel: {
            marginTop: 8,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            color: '#627D98',
        },
        rowValue: {
            fontSize: 16,
            fontWeight: '600',
            color: '#102A43',
        },
        error: {
            marginTop: 8,
            color: '#B91C1C',
            fontSize: 13,
        },
    });

    return styles;
}
