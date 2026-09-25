import { ActivityIndicator, Modal, View } from 'react-native';
import useModalInfoStyle from '../../styles/components/modals/modalInfoConfirmStyle';
import { Colors } from '../../theme';

interface Props {
    visible: boolean;
}

export default function ModalLoading({ visible }: Props) {
    const styles = useModalInfoStyle();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.container}>
                <View style={[styles.content, styles.contentLoading]}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </View>
        </Modal>
    );
}
