import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import AppButton from '../components/buttons/AppButton';
import SettingsCard from '../components/cards/SettingsCard';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import ModalConfirm from '../components/modals/ModalConfirm';
import ModalInfo from '../components/modals/ModalInfo';
import { deleteParticipant } from '../services/participantService';
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

    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [isModalInfoVisible, setIsModalInfoVisible] = useState(false);
    const [infoError, setInfoError] = useState<string>('');

    const handleShowModal = () => {
        setIsModalConfirmVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalConfirmVisible(false);
    };

    const handleConfirmDeleteData = async () => {
        try {
            await deleteParticipant();
            router.replace('/');
        } catch (error) {
            setInfoError(
                error instanceof Error
                    ? error.message
                    : 'Ocorreu um erro ao excluir os dados. Verifique sua conexão e tente novamente.',
            );
            setIsModalInfoVisible(true);
        }
    };

    return (
        <ScreenContainer style={styles.container}>
            <AppHeader title="Configurações" showBackButton={true} />
            <ModalConfirm
                visible={isModalConfirmVisible}
                title="Excluir dados"
                message="Tem certeza que deseja excluir seus dados? Esta ação não pode ser desfeita."
                onClose={() => {
                    handleCloseModal();
                }}
                onConfirm={() => {
                    handleConfirmDeleteData();
                }}
                buttonCloseText="Cancelar"
                buttonConfirmText="Excluir"
            />
            <ModalInfo
                visible={isModalInfoVisible}
                title="Erro"
                message={infoError}
                onClose={() => {
                    setIsModalInfoVisible(false);
                }}
                buttonText="Fechar"
            />
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
                        onPress={() => {
                            handleShowModal();
                        }}
                        styleButton={styles.excludeButton}
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
