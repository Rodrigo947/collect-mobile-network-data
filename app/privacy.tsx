import { Text } from 'react-native';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import usePrivacyStyleScreen from '../styles/privacyStyleScreen';

export default function PrivacyScreen() {
    const styles = usePrivacyStyleScreen();
    return (
        <ScreenContainer>
            <AppHeader title="Política de Privacidade" showBackButton={true} />
            <Text style={styles.title}>Política de Privacidade</Text>
        </ScreenContainer>
    );
}
