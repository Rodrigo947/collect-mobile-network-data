import { StyleSheet } from 'react-native';
import { Colors } from '../theme';

export default function useSettingsStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: Colors.white,
        },
        cardContainer: {
            backgroundColor: Colors.white,
            margin: 15,
            marginBottom: 5,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.border,
        },
        excludeButtonContainer: {
            margin: 15,
            marginTop: 5,
        },
        excludeButton: {
            backgroundColor: Colors.danger,
        },
    });

    return styles;
}
