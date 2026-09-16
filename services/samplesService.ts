import { APISampleData } from '../types/sample';
import StorageService from './storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL_BASE?.replace(/\/$/, '');

export async function getMySamples(
    page = 1,
    limit = 8,
): Promise<APISampleData> {
    if (!API_BASE_URL) {
        throw new Error('A URL base da API não foi configurada.');
    }

    const token = await StorageService.getParticipantToken();

    if (!token) {
        throw new Error('Token de autenticação não encontrado.');
    }

    let response: Response;
    try {
        response = await fetch(
            `${API_BASE_URL}/data?page=${page}&limit=${limit}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
    } catch {
        throw new Error('Não foi possível conectar à API.');
    }

    let payload: Partial<APISampleData> = {};
    try {
        payload = await response.json();
    } catch {
        throw new Error('A API retornou uma resposta inválida.');
    }

    return payload as APISampleData;
}
