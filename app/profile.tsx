import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import { getParticipant } from '../services/participantService';
import useProfileStyleScreen from '../styles/profileStyleScreen';
import { Colors } from '../theme';
import { Participant } from '../types/participant';

export default function ProfileScreen() {
    const styles = useProfileStyleScreen();
    const [participant, setParticipant] = useState<Participant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getParticipant()
            .then(setParticipant)
            .catch(error => {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar os dados do perfil.',
                );
            })
            .finally(() => setIsLoading(false));
    }, []);

    const dateFormatter = (date: string | null) => {
        if (!date) return 'Não informado';
        const d = new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        return d;
    };

    return (
        <ScreenContainer style={styles.container}>
            <AppHeader title="Perfil" showBackButton={true} />
            <ScrollView>
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color={Colors.primary}
                        />
                    </View>
                )}
                {!isLoading && error && (
                    <Text style={styles.error}>{error}</Text>
                )}
                {!isLoading && participant && (
                    <View style={styles.content}>
                        <Text style={styles.label}>ID</Text>
                        <Text style={styles.value}>{participant.id}</Text>
                        <Text style={styles.label}>Versão do aplicativo</Text>
                        <Text style={styles.value}>
                            {participant.appVersion ?? 'Não informado'}
                        </Text>
                        <Text style={styles.label}>Modelo do dispositivo</Text>
                        <Text style={styles.value}>
                            {participant.deviceModel ?? 'Não informado'}
                        </Text>
                        <Text style={styles.label}>
                            Sistema operacional (API)
                        </Text>
                        <Text style={styles.value}>
                            {participant.os ?? 'Não informado'}
                        </Text>
                        <Text style={styles.label}>Status</Text>
                        <Text style={styles.value}>{participant.status}</Text>
                        <Text style={styles.label}>Data de cadastro</Text>
                        <Text style={styles.value}>
                            {dateFormatter(participant.createdAt)}
                        </Text>
                        <Text style={styles.label}>Última coleta</Text>
                        <Text style={styles.value}>
                            {dateFormatter(participant.lastSeenAt)}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}
