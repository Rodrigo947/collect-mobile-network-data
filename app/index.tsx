import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import ScreenContainer from '../components/layout/ScreenContainer';
import packageJson from '../package.json';
import { initializeCollectionDatabase } from '../services/networkService';
import storage from '../services/storage';
import useIndexStyle from '../styles/indexStyleScreen';
import { Colors } from '../theme';

const appName = packageJson.name;

export default function SplashScreen() {
    const styles = useIndexStyle();
    const router = useRouter();
    const [participantId, setParticipantId] = useState('');

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        const [accepted, storedParticipantId] = await Promise.all([
            storage.hasAcceptedTerms(),
            storage.getParticipantId(),
            initializeCollectionDatabase(),
        ]).then(([termsAccepted, id]) => [termsAccepted, id] as const);

        setParticipantId(storedParticipantId ?? '');

        await new Promise(resolve => setTimeout(resolve, 3000));

        if (accepted && storedParticipantId) {
            router.replace('/home');
        } else {
            router.replace('/onboarding');
        }
    };

    return (
        <ScreenContainer style={styles.container} showStatusBar={false}>
            <View>
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
            </View>
            <Text style={styles.userId}>{participantId}</Text>
        </ScreenContainer>
    );
}
