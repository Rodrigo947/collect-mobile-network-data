import GetNetworkDataModule from "./GetNetworkDataModule";

export function getData(): Promise<string> {
  return GetNetworkDataModule.getData();
}
