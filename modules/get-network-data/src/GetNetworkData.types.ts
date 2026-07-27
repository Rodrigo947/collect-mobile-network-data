export type NetworkData = {
  carrierName: string | null;
  networkType: string | null;
  technology: string | null;
  signalDbm: number | null;
  signalAsu: number | null;
  signalLevel: number | null;
  isConnected: boolean;
  isRoaming: boolean;
  permissionRequired: boolean;
  error: string | null;
};
