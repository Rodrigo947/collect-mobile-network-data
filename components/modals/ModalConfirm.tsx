import { Modal, Pressable, Text, View } from 'react-native';
import useModalInfoStyle from '../../styles/components/modals/modalInfoConfirmStyle';
import { Colors } from '../../theme';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    buttonCloseText?: string;
    onConfirm: () => void;
    buttonConfirmText?: string;
}

export default function ModalConfirm({
    visible,
    title,
    message,
    onClose,
    buttonCloseText = 'Fechar',
    onConfirm,
    buttonConfirmText = 'Confirmar',
}: Props) {
    const styles = useModalInfoStyle();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonRow}>
                        <Pressable
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>
                                {buttonCloseText}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.button,
                                styles.buttonConfirm,
                                { backgroundColor: Colors.danger },
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonText}>
                                {buttonConfirmText}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
