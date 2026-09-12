import { requireNativeModule } from 'expo-modules-core';

import StorageService from './storage';

const GetNetworkData = requireNativeModule('GetNetworkData');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL_BASE?.replace(/\/$/, '');

interface RegistrationResponse {
    participantId: string;
    token: string;
}

export async function registerParticipant(): Promise<RegistrationResponse> {
    if (!API_BASE_URL) {
        throw new Error('A URL base da API não foi configurada.');
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}/participant`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });
    } catch {
        throw new Error('Não foi possível conectar à API.');
    }

    let payload: Partial<RegistrationResponse> & { message?: string } = {};
    try {
        payload = await response.json();
    } catch {
        throw new Error('A API retornou uma resposta inválida.');
    }

    if (!response.ok) {
        throw new Error(payload.message ?? 'Falha ao registrar o aplicativo.');
    }

    if (!payload.participantId || !payload.token) {
        throw new Error('A API não retornou as credenciais do participante.');
    }

    await StorageService.saveParticipantCredentials(
        payload.participantId,
        payload.token,
    );
    await GetNetworkData.setParticipantCredentials(
        payload.participantId,
        payload.token,
    );

    return {
        participantId: payload.participantId,
        token: payload.token,
    };
}
