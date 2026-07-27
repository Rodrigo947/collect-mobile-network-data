import { NetworkData } from "./GetNetworkData.types";
import GetNetworkDataModule from "./GetNetworkDataModule";

export function getData(): Promise<NetworkData> {
  return GetNetworkDataModule.getData();
}
