import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import AppButton from '../components/buttons/AppButton';
import SettingsCard from '../components/cards/SettingsCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import useSettingsStyleScreen from '../styles/settingsStyleScreen';

export default function SettingsScreen() {
    const styles = useSettingsStyleScreen();
    const router = useRouter();

    const handleProfile = () => {
        router.navigate('/profile');
    };

    const handleHistory = () => {
        router.navigate('/history');
    };

    const handlePrivacyPolicy = () => {
        router.navigate('/privacy');
    };

    return (
        <ScreenContainer style={styles.container}>
            <AppHeader title="Configurações" showBackButton={true} />
            <ScrollView>
                <View style={styles.cardContainer}>
                    <SettingsCard
                        title="Perfil"
                        leftIconName="user-alt"
                        onPressCard={() => {
                            handleProfile();
                        }}
                    />
                </View>
                <View style={styles.cardContainer}>
                    <SettingsCard
                        title="Minhas contribuições"
                        leftIconName="history"
                        onPressCard={() => {
                            handleHistory();
                        }}
                    />
                    <SettingsCard
                        title="Política de privacidade"
                        leftIconName="file-contract"
                        onPressCard={() => {
                            handlePrivacyPolicy();
                        }}
                    />
                </View>
                <View style={styles.excludeButtonContainer}>
                    <AppButton
                        title="Excluir meus dados"
                        onPress={() => {}}
                        styleButton={styles.excludeButton}
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
