import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useAppButtonStyle() {
    const styles = StyleSheet.create({
        button: {
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: Colors.primary,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 15,
        },

        text: {
            color: 'white',
            fontWeight: '700',
            fontSize: Typography.bodyLarge,
            marginRight: 12,
        },
        disabledButton: {
            backgroundColor: Colors.disabled,
        },
    });

    return styles;
}
