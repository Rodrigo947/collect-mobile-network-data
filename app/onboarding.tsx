import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageSourcePropType,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AppButton from '../components/buttons/AppButton';
import OnBoardingCard from '../components/cards/OnBoardingCard';
import ScreenContainer from '../components/layout/ScreenContainer';
import { registerParticipant } from '../services/participantService';
import StorageService from '../services/storage';
import useOnboardingStyleScreen from '../styles/onboardingStyleScreen';
import { Colors } from '../theme';

type OnboardingItem = {
    id: string;
    icon: ImageSourcePropType;
    title: string;
    description: string;
};

const DATA: OnboardingItem[] = [
    {
        id: '1',
        icon: require('../assets/images/onboarding1.png'),
        title: '1. Coleta Inteligente',
        description:
            'O aplicativo coleta sinais de redes móveis (RSRP e RSRQ) das células próximas e sua localização GPS de forma segura.',
    },
    {
        id: '2',
        icon: require('../assets/images/onboarding2.png'),
        title: '2. Dados que Conectam',
        description:
            'As métricas coletadas ajudam a criar modelos de inteligência artificial para estimar a posição do usuário com mais precisão, utilizado para criar ferramentas de gestão de mobilidade',
    },
    {
        id: '3',
        icon: require('../assets/images/onboarding3.png'),
        title: '3. Colaboração',
        description:
            'Sua colaboração é muito importante! Juntos podemos construir soluções inovadoras para redes móveis mais inteligentes.',
    },
    {
        id: '4',
        icon: require('../assets/images/onboarding4.png'),
        title: '4. Privacidade e Segurança',
        description:
            'Seus dados são coletados de forma anônima e utilizados apenas para fins acadêmicos e de pesquisa.',
    },
];

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const styles = useOnboardingStyleScreen(width);
    const router = useRouter();
    const flatListRef = useRef<FlatList<OnboardingItem>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRegistering, setIsRegistering] = useState(false);

    const lastIndex = DATA.length - 1;

    const handleScroll = useCallback((event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    }, []);

    const scrollToIndex = useCallback((index: number) => {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setCurrentIndex(index);
    }, []);

    const handleNext = useCallback(async () => {
        if (currentIndex < lastIndex) {
            scrollToIndex(currentIndex + 1);
        } else {
            if (isRegistering) return;

            setIsRegistering(true);
            try {
                await registerParticipant();
                await StorageService.acceptTerms();
                router.replace('/home');
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Não foi possível registrar o aplicativo',
                    text2:
                        error instanceof Error
                            ? error.message
                            : 'Tente novamente.',
                });
            } finally {
                setIsRegistering(false);
            }
        }
    }, [currentIndex, lastIndex, scrollToIndex, router, isRegistering]);

    const handleSkip = useCallback(() => {
        scrollToIndex(lastIndex);
    }, [lastIndex, scrollToIndex]);

    const renderItem = useCallback(
        ({ item, index }: { item: OnboardingItem; index: number }) => (
            <OnBoardingCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                showPrivacyTerms={index === lastIndex}
                navigation={router}
            />
        ),
        [lastIndex, router],
    );

    const renderDots = useCallback(() => {
        return (
            <View style={styles.dotsContainer}>
                {DATA.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    index === currentIndex
                                        ? Colors.primaryDark
                                        : Colors.backgroundLightGray,
                            },
                        ]}
                    />
                ))}
            </View>
        );
    }, [currentIndex]);

    return (
        <ScreenContainer style={styles.container} showStatusBar={false}>
            <StatusBar barStyle="light-content" />
            {currentIndex < lastIndex && (
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkip}
                >
                    <Text style={styles.skipText}>Pular</Text>
                </TouchableOpacity>
            )}

            <FlatList
                ref={flatListRef}
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />

            <View style={styles.footer}>
                {renderDots()}
                {currentIndex === lastIndex && (
                    <AppButton
                        title="Concordar e Continuar"
                        styleButton={styles.continueButton}
                        styleText={styles.continueText}
                        onPress={handleNext}
                    />
                )}
            </View>
        </ScreenContainer>
    );
}
