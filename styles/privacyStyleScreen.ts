import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function usePrivacyStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.white,
        },
        section: {
            padding: 16,
        },
        title: {
            fontSize: Typography.h2,
            color: Colors.text,
        },
        subTitle: {
            fontSize: Typography.h3,
            color: Colors.text,
        },
        text: {
            fontSize: Typography.body,
            color: Colors.text,
            textAlign: 'justify',
            marginVertical: 8,
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
            textAlign: 'justify',
        },
    });
    return styles;
}
