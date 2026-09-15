export interface Participant {
    id: string;
    appVersion: string | null;
    deviceModel: string | null;
    os: string | null;
    status: string;
    createdAt: string;
    lastSeenAt: string;
}
