import { NativeModule, registerWebModule } from "expo";
import { NetworkData } from "./GetNetworkData.types";

// GetNetworkDataModule is not available on the web platform.
class GetNetworkDataModule extends NativeModule<{}> {
  getData(): Promise<NetworkData> {
    return Promise.resolve({
      carrierName: null,
      networkType: null,
      technology: null,
      signalDbm: null,
      signalAsu: null,
      signalLevel: null,
      isConnected: false,
      isRoaming: false,
      permissionRequired: false,
      error: "Not available on web",
    });
  }
}

export default registerWebModule(GetNetworkDataModule, "GetNetworkDataModule");
