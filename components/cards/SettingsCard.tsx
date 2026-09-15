import useSettingsCardStyle from '@/styles/components/settingsCardStyle';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme';

interface SettingsCardProps {
    title: string;
    leftIconName: string;
    onPressCard: () => void;
}

export default function SettingsCard({
    title,
    leftIconName,
    onPressCard,
}: SettingsCardProps) {
    const styles = useSettingsCardStyle();

    return (
        <TouchableOpacity
            onPress={() => {
                onPressCard();
            }}
            style={styles.container}
        >
            <View style={styles.iconContainer}>
                <FontAwesome5
                    name={leftIconName}
                    size={22}
                    color={Colors.textLabel}
                />
            </View>
            <Text style={styles.label}>{title}</Text>

            <FontAwesome5
                name={'angle-right'}
                size={30}
                color={Colors.textLabel}
            />
        </TouchableOpacity>
    );
}
