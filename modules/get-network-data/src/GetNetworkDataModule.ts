import { NativeModule, requireNativeModule } from "expo";

declare class GetNetworkDataModule extends NativeModule<{}> {
  getData(): Promise<string>;
}

export default requireNativeModule<GetNetworkDataModule>("GetNetworkData");
