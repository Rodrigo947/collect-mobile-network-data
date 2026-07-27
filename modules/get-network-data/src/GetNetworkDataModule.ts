import { NativeModule, requireNativeModule } from "expo";
import { NetworkData } from "./GetNetworkData.types";

declare class GetNetworkDataModule extends NativeModule<{}> {
  getData(): Promise<NetworkData>;
}

export default requireNativeModule<GetNetworkDataModule>("GetNetworkData");
