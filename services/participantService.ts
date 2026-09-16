import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

import { Participant } from '../types/participant';
import StorageService from './storage';

const GetNetworkData = requireNativeModule('GetNetworkData');
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL_BASE?.replace(/\/$/, '');

interface RegistrationResponse {
    participantId: string;
    token: string;
}

interface ParticipantResponse {
    participant: Participant;
    message?: string;
}

export async function getParticipant(): Promise<Participant> {
    if (!API_BASE_URL) {
        throw new Error('A URL base da API não foi configurada.');
    }

    const token = await StorageService.getParticipantToken();

    if (!token) {
        throw new Error('Token de autenticação não encontrado.');
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}/participant`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch {
        throw new Error('Não foi possível conectar à API.');
    }

    let payload: Partial<ParticipantResponse> & { message?: string } = {};
    try {
        payload = await response.json();
    } catch {
        throw new Error('A API retornou uma resposta inválida.');
    }

    if (!response.ok) {
        throw new Error(
            payload.message ?? 'Falha ao obter os dados do participante.',
        );
    }

    if (!payload.participant) {
        throw new Error('A API não retornou os dados do participante.');
    }

    return payload.participant;
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
            body: JSON.stringify({
                appVersion: Constants.expoConfig?.version ?? 'unknown',
                deviceModel: Device.modelName ?? 'unknown',
                os: `${Platform.OS === 'android' ? 'Android' : Platform.OS} ${String(Platform.Version)}`,
            }),
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
        API_BASE_URL,
    );

    return {
        participantId: payload.participantId,
        token: payload.token,
    };
}

export async function deleteParticipant(): Promise<boolean> {
    if (!API_BASE_URL) {
        throw new Error('A URL base da API não foi configurada.');
    }

    const token = await StorageService.getParticipantToken();

    if (!token) {
        throw new Error('Token de autenticação não encontrado.');
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}/participant`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch {
        throw new Error('Não foi possível conectar à API.');
    }

    if (!response.ok) {
        throw new Error(
            'Falha ao excluir registro do usuário. Tente novamente mais tarde.',
        );
    }

    await StorageService.clear();
    await GetNetworkData.removeParticipantCredentials();
    await GetNetworkData.clearLocalData();

    return true;
}
