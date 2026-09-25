const defaultMorphology = [
    {
        label: 'Urbano denso (prédios altos)',
        value: 'Urbano denso (prédios altos)',
    },
    { label: 'Urbano (prédios baixos)', value: 'Urbano (prédios baixos)' },
    {
        label: 'Suburbano residencial (casas, prédios baixos)',
        value: 'Suburbano residencial (casas, prédios baixos)',
    },
    { label: 'Condomínio', value: 'Condomínio' },
    { label: 'Vegetação densa', value: 'Vegetação densa' },
    { label: 'Vegetação esparsa', value: 'Vegetação esparsa' },
    { label: "Espelho d'água", value: "Espelho d'água" },
    { label: 'Rural', value: 'Rural' },
    { label: 'Campo aberto', value: 'Campo aberto' },
    { label: 'Indoor', value: 'Indoor' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Estacionamento fechado', value: 'Estacionamento fechado' },
    {
        label: 'Estádio ou campo esportivo',
        value: 'Estádio ou campo esportivo',
    },
    { label: 'Rodovia', value: 'Rodovia' },
    { label: 'Estrada', value: 'Estrada' },
];

const defaultTopography = [
    { label: 'Subida íngrime', value: 'Subida íngrime' },
    { label: 'Subida', value: 'Subida' },
    { label: 'Plano', value: 'Plano' },
    { label: 'Descida', value: 'Descida' },
    { label: 'Descida íngrime', value: 'Descida íngrime' },
];

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL_BASE?.replace(/\/$/, '');

export interface dropdownItem {
    label: string;
    value: string;
}

interface EnvironmentResponse {
    morphology: string[];
    topography: string[];
    message?: string;
}

export async function getEnvironmentData(): Promise<{
    morphology: dropdownItem[];
    topography: dropdownItem[];
}> {
    if (!API_BASE_URL) {
        throw new Error('A URL base da API não foi configurada.');
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}/environment`, {
            method: 'GET',
        });
    } catch {
        return { morphology: defaultMorphology, topography: defaultTopography };
    }

    let payload: Partial<EnvironmentResponse> & { message?: string } = {};
    try {
        payload = await response.json();
    } catch {
        return { morphology: defaultMorphology, topography: defaultTopography };
    }

    if (!response.ok) {
        throw new Error(
            payload.message ?? 'Falha ao obter os dados do ambiente.',
        );
    }

    if (!payload.morphology || !payload.topography) {
        return { morphology: defaultMorphology, topography: defaultTopography };
    }

    const toOptions = (arr: string[]) =>
        arr.map((item: string) => ({ label: item, value: item }));
    return {
        morphology: toOptions(payload.morphology),
        topography: toOptions(payload.topography),
    };
}
