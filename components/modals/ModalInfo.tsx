import { Modal, Pressable, Text, View } from 'react-native';
import useModalInfoStyle from '../../styles/components/modals/modalInfoConfirmStyle';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
}

export default function ModalInfo({
    visible,
    title,
    message,
    onClose,
    buttonText = 'Fechar',
}: Props) {
    const styles = useModalInfoStyle();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <Pressable style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
