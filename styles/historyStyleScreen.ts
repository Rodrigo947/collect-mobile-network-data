import { StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

export default function useHistoryStyleScreen() {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
        },
        localSamples: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 10,
            padding: 15,
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: 8,
        },
        localSamplesLabel: {
            fontSize: Typography.body,
            color: Colors.textLabel,
        },
        localSamplesValue: {
            fontSize: Typography.body,
            color: Colors.text,
            fontWeight: 'bold',
        },
        localSamplesUploadButton: {
            margin: 1,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.primary,
            borderRadius: 8,
        },
        listContainer: {
            flex: 1,
            width: '100%',
            padding: 10,
            backgroundColor: Colors.white,
        },
        remoteSamplesLabel: {
            fontSize: Typography.body,
            color: Colors.text,
            textAlign: 'center',
            marginBottom: 5,
            marginLeft: 10,
        },
        separator: {
            height: 1,
            backgroundColor: Colors.border,
            marginVertical: 5,
            marginHorizontal: 10,
        },
        noSamplesContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        noSamplesText: {
            fontSize: Typography.h4,
            color: Colors.textLabel,
        },
        loader: {
            marginTop: 40,
        },
    });

    return styles;
}
