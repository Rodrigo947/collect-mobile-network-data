import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, Text } from 'react-native';
import ScreenContainer from '../components/layout/ScreenContainer';
import packageJson from '../package.json';
import storage from '../services/storage';
import useIndexStyle from '../styles/indexStyleScreen';
import { Colors } from '../theme';

const appName = packageJson.name;

export default function SplashScreen() {
    const styles = useIndexStyle();
    const router = useRouter();

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const accepted = await storage.hasAcceptedTerms();

        if (accepted) {
            router.replace('/home');
        } else {
            router.replace('/onboarding');
        }
    };

    return (
        <ScreenContainer style={styles.container} showStatusBar={false}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>{appName}</Text>

            <Text style={styles.subtitle}>Coletando sinais.</Text>

            <Text style={styles.subtitle}>Conectando posições.</Text>

            <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loader}
            />
        </ScreenContainer>
    );
}
