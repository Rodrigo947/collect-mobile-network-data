import { StyleSheet } from 'react-native';
import { Colors } from '../theme';

export default function useIndexStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.white,
        },
        content: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            width: 150,
            height: 150,
            marginBottom: 30,
        },
        title: {
            fontSize: 32,
            fontWeight: '700',
            color: Colors.text,
        },
        subtitle: {
            marginTop: 4,
            fontSize: 16,
            color: Colors.textSecondary,
        },
        loader: {
            marginTop: 40,
        },
        userId: {
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            textAlign: 'center',
            color: Colors.textSecondary,
        },
    });
    return styles;
}
