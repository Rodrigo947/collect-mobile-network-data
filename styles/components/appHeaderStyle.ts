import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useAppHeaderStyle() {
    const styles = StyleSheet.create({
        headerContainer: {
            backgroundColor: Colors.white,
            borderBottomWidth: 1,
            borderBottomColor: Colors.backgroundLightGray,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            height: 56,
        },
        backButton: {
            padding: 4,
        },
        title: {
            flex: 1,
            fontSize: Typography.h4,
            fontWeight: '600',
            color: Colors.text,
            textAlign: 'center',
            marginHorizontal: 8,
        },
    });
    return styles;
}
