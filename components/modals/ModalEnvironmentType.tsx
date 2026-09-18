import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import useModalInfoStyle from '../../styles/components/modals/modalInfoConfirmStyle';
import { Colors } from '../../theme';

interface Props {
    visible: boolean;
    onClose: () => void;
    onInsert: (environment: string) => void;
}

export default function ModalEnvironmentType({
    visible,
    onClose,
    onInsert,
}: Props) {
    const styles = useModalInfoStyle();

    const [environment, setEnvironment] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setError('');
        if (environment.trim() === '') {
            setError('Por favor, especifique o ambiente.');
            return;
        }
        onInsert(environment.trim());
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={[styles.content, styles.contentConfirm]}>
                    <Text style={styles.title}>Ambiente</Text>
                    <Text style={styles.message}>
                        Especifique o ambiente em que você está coletando
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o ambiente"
                        placeholderTextColor={Colors.placeholder}
                        value={environment}
                        onChangeText={setEnvironment}
                    />
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <Pressable style={styles.button} onPress={handleClose}>
                        <Text style={styles.buttonText}>Inserir</Text>
                    </Pressable>
                    <Pressable style={styles.xClose} onPress={onClose}>
                        <Ionicons name="close" size={24} color={Colors.text} />
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
