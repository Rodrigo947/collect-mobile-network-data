import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../../theme';

export default function useNeighboringCellCardStyle() {
    const styles = StyleSheet.create({
        content: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
        },
        data: {
            flex: 1,
            paddingRight: 10,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5,
        },
        text: {
            fontSize: Typography.body,
            color: Colors.text,
        },
    });

    return styles;
}
