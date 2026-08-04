import {
    Dimensions,
    Image,
    ImageSourcePropType,
    Text,
    View,
} from 'react-native';

import { ImperativeRouter } from 'expo-router';
import useOnBoardingCardStyle from '../../styles/components/onBoardingCardStyle';

interface Props {
    icon: ImageSourcePropType;
    title: string;
    description: string;
    showPrivacyTerms: boolean;
    navigation: ImperativeRouter;
}

const { width } = Dimensions.get('window');

export default function FeatureCard({
    icon,
    title,
    description,
    showPrivacyTerms,
    navigation,
}: Props) {
    const styles = useOnBoardingCardStyle(width);
    return (
        <View style={styles.card}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.description}>{description}</Text>
            {showPrivacyTerms && (
                <View>
                    <Text style={styles.terms}>
                        Ao continuar, você concorda com nossos{' '}
                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate('/privacy')}
                        >
                            Termos de Uso
                        </Text>{' '}
                        e{' '}
                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate('/privacy')}
                        >
                            Política de Privacidade
                        </Text>
                        .
                    </Text>
                </View>
            )}
        </View>
    );
}
