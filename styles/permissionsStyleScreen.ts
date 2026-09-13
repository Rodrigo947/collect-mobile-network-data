import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function usePermissionsStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.white,
            padding: 30,
        },
        title: {
            fontSize: Typography.bodyLarge,
            fontWeight: 'bold',
            color: Colors.text,
            marginBottom: 20,
        },
        listItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10,
            marginLeft: 15,
        },
        bullet: {
            fontSize: Typography.h4,
            marginRight: 8,
            lineHeight: 22,
            color: Colors.text,
        },
        listText: {
            fontSize: Typography.body,
            flex: 1,
            color: Colors.text,
        },
        info: {
            fontSize: Typography.bodySmall,
            marginVertical: 20,
            color: Colors.textSecondary,
            fontStyle: 'italic',
            textAlign: 'justify',
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
