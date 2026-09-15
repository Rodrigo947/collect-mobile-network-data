import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import useAppHeaderStyle from '../../styles/components/appHeaderStyle';
import { Colors } from '../../theme';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    showRightButton?: boolean;
    iconRightName?: React.ComponentProps<typeof FontAwesome5>['name'];
    onRightPress?: () => void;
}

export default function Header({
    title,
    showBackButton = false,
    onBackPress,
    showRightButton = false,
    iconRightName,
    onRightPress,
}: HeaderProps) {
    const styles = useAppHeaderStyle();
    const router = useRouter();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <View style={styles.headerContainer}>
            {showBackButton && (
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <FontAwesome5
                        name="arrow-left"
                        size={22}
                        color={Colors.text}
                    />
                </TouchableOpacity>
            )}

            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>

            {showRightButton && (
                <TouchableOpacity
                    onPress={onRightPress}
                    style={styles.rightButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <FontAwesome6
                        name={iconRightName}
                        size={22}
                        color={Colors.text}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}
