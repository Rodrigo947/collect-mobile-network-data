import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../../theme';

export default function useModalInfoStyle() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.navigationBackground + '99',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            padding: 20,
            margin: 25,
            backgroundColor: Colors.white,
            borderRadius: 8,
            shadowColor: Colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        contentLoading: {
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
        },
        contentConfirm: {
            marginBottom: 160,
        },
        title: {
            color: Colors.text,
            fontWeight: 'bold',
            fontSize: Typography.h4,
            textAlign: 'center',
            marginBottom: 10,
        },
        message: {
            color: Colors.textLabel,
            fontSize: Typography.body,
            textAlign: 'center',
            marginBottom: 20,
        },
        button: {
            backgroundColor: Colors.primary,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
        },
        buttonConfirm: {
            flex: 1,
            marginHorizontal: 10,
        },
        buttonText: {
            color: Colors.white,
            fontSize: Typography.body,
            textAlign: 'center',
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        input: {
            borderWidth: 1,
            borderColor: Colors.border,
            marginVertical: 10,
            color: Colors.text,
            padding: 10,
        },
        inputPlaceholder: {
            color: Colors.placeholder,
            fontSize: Typography.body,
        },
        error: {
            color: Colors.danger,
            fontSize: Typography.body,
            marginBottom: 15,
        },
        xClose: {
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 10,
        },
    });

    return styles;
}
