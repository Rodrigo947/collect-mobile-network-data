import { StyleSheet } from 'react-native';
import { Colors } from '../../theme';

export default function useScreenContainerStyle() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
        },
        content: {
            flex: 1,
            backgroundColor: Colors.background,
        },
    });

    return styles;
}
