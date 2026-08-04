import { FontAwesome5 } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import useAppButtonStyle from '../../styles/components/appButtonStyle';
import { Colors } from '../../theme';

interface Props {
    title: string;
    styleButton?: object;
    styleText?: object;
    rightIcon?: string;
    onPress: () => void;
}

export default function AppButton({
    title,
    styleButton,
    styleText,
    rightIcon,
    onPress,
}: Props) {
    const styles = useAppButtonStyle();
    return (
        <TouchableOpacity
            style={[styles.button, styleButton]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Text style={[styles.text, styleText]}>{title}</Text>
            {rightIcon && (
                <FontAwesome5 name={rightIcon} size={20} color={Colors.white} />
            )}
        </TouchableOpacity>
    );
}
