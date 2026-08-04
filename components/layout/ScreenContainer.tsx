import React from 'react';
import { StatusBar, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import useScreenContainerStyle from '../../styles/components/screenContainerStyle';
import Colors from '../../theme/colors';

interface Props {
    children: React.ReactNode;
    showStatusBar?: boolean;
    style?: ViewStyle;
    statusBarBackgroundColor?: string;
}

export default function ScreenContainer({
    children,
    showStatusBar = true,
    style,
    statusBarBackgroundColor,
}: Props) {
    const styles = useScreenContainerStyle();
    return (
        <>
            <StatusBar
                hidden={!showStatusBar}
                barStyle="dark-content"
                backgroundColor={statusBarBackgroundColor || Colors.white}
                translucent={false}
            />
            <SafeAreaView style={styles.container}>
                <View style={[styles.content, style]}>{children}</View>
                <Toast />
            </SafeAreaView>
        </>
    );
}
