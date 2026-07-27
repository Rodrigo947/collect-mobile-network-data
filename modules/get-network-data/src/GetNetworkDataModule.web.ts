import { registerWebModule, NativeModule } from 'expo';

// GetNetworkDataModule is not available on the web platform.
class GetNetworkDataModule extends NativeModule<{}> {}

export default registerWebModule(GetNetworkDataModule, 'GetNetworkDataModule');
