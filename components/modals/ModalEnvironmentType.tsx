import { Dropdown } from '@carlos3g/element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import useModalInfoStyle from '../../styles/components/modals/modalInfoConfirmStyle';
import { Colors } from '../../theme';

interface dropdownItem {
    label: string;
    value: string;
}

interface Props {
    visible: boolean;
    dataMorphology: dropdownItem[];
    dataTopography: dropdownItem[];
    onClose: () => void;
    onInsert: (morphology: string, topography: string) => void;
}

export default function ModalEnvironmentType({
    visible,
    dataMorphology,
    dataTopography,
    onClose,
    onInsert,
}: Props) {
    const styles = useModalInfoStyle();

    const [morphology, setMorphology] = useState('');
    const [topography, setTopography] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setError('');
        if (morphology.trim() === '' && topography.trim() === '') {
            setError('Por favor, especifique a morfologia e a topografia.');
            return;
        }
        if (morphology.trim() === '') {
            setError('Por favor, especifique a morfologia.');
            return;
        }
        if (topography.trim() === '') {
            setError('Por favor, especifique a topografia.');
            return;
        }
        onInsert(morphology.trim(), topography.trim());
    };

    useEffect(() => {
        if (visible) {
            setMorphology('');
            setTopography('');
            setError('');
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={[styles.content, styles.contentConfirm]}>
                    <Text style={styles.title}>Ambiente</Text>
                    <Text style={styles.message}>
                        Especifique o ambiente em que você está coletando
                    </Text>
                    <Dropdown
                        style={styles.input}
                        data={dataMorphology}
                        labelField="label"
                        valueField="value"
                        placeholder="Morfologia"
                        placeholderStyle={styles.inputPlaceholder}
                        value={morphology}
                        onChange={item => setMorphology(item.value)}
                    />
                    <Dropdown
                        style={styles.input}
                        data={dataTopography}
                        labelField="label"
                        valueField="value"
                        placeholder="Topografia"
                        placeholderStyle={styles.inputPlaceholder}
                        value={topography}
                        onChange={item => setTopography(item.value)}
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
