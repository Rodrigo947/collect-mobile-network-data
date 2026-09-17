import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import AppButton from '../components/buttons/AppButton';
import ScreenContainer from '../components/layout/ScreenContainer';
import ModalInfo from '../components/modals/ModalInfo';
import { requestRequiredPermissions } from '../services/permissionsService';
import usePermissionsStyleScreen from '../styles/permissionsStyleScreen';

export default function PermissionsScreen() {
    const styles = usePermissionsStyleScreen();
    const router = useRouter();
    const [requesting, setRequesting] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleNext = async () => {
        if (requesting) return;

        setRequesting(true);
        try {
            const granted = await requestRequiredPermissions();
            if (granted) {
                router.replace('/home');
            } else {
                setModalMessage(
                    'Não foi possível conceder todas as permissões necessárias. Por favor, conceda todas as permissões para continuar.',
                );
                setShowModal(true);
            }
        } catch (error) {
            setModalMessage(
                'Ocorreu um erro ao solicitar as permissões. Tente novamente.',
            );
            setShowModal(true);
        } finally {
            setRequesting(false);
        }
    };

    return (
        <ScreenContainer style={styles.container} showStatusBar={false}>
            <ModalInfo
                title={'Aviso'}
                visible={showModal}
                message={modalMessage}
                onClose={() => setShowModal(false)}
            />
            <Text style={styles.title}>
                Para utilizar o aplicativo, é necessário conceder as seguintes
                permissões:
            </Text>
            <View style={styles.listItem}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.listText}>
                    Local (no modo "Permitir o tempo todo")
                </Text>
            </View>

            <View style={styles.listItem}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.listText}>Telefone</Text>
            </View>

            <View style={styles.listItem}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={styles.listText}>
                    Notificações (Android 13 ou superior)
                </Text>
            </View>

            <Text style={styles.info}>
                Para entender melhor o motivo dessas permissões, acesse a seção
                nossa política de privacidade e termos de uso no menu do
                aplicativo.
            </Text>

            <AppButton
                title="Permitir e Continuar"
                styleButton={styles.continueButton}
                styleText={styles.continueText}
                onPress={handleNext}
            />
        </ScreenContainer>
    );
}
