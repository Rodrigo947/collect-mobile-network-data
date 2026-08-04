import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function useHomeStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.background,
        },

        content: {
            flex: 1,
            width: '100%',
            top: -20,
            padding: 10,
        },
        startButtonContainer: {
            width: '100%',
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        startButton: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },
        historyButton: {
            padding: 4,
        },
        overviewContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 20,
            gap: 10,
        },
        overview: {
            flex: 1,
            backgroundColor: Colors.white,
            padding: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: Colors.shadow,
            shadowOpacity: 0.29,
            shadowRadius: 4.65,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            elevation: 7,
        },
        overviewTextContainer: {
            paddingLeft: 10,
        },
        overviewLabel: {
            fontSize: Typography.bodySmall,
            color: Colors.textLabel,
        },
        overviewText: {
            fontSize: Typography.bodySmall,
            color: Colors.text,
        },
        neighboringCellsContainer: {
            backgroundColor: Colors.backgroundLight,
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
        neighboringCellsTitle: {
            fontSize: Typography.h4,
            fontWeight: 'bold',
            color: Colors.textLabel,
            marginBottom: 5,
        },
        divisor: {
            height: 1,
            backgroundColor: Colors.disabled,
        },
        noCell: {
            fontSize: Typography.body,
            color: Colors.text,
            textAlign: 'center',
            paddingVertical: 10,
        },
    });
    return styles;
}
