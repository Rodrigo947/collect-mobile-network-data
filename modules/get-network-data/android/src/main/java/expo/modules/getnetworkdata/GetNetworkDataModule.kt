package expo.modules.getnetworkdata

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class GetNetworkDataModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("GetNetworkData")

    AsyncFunction("getData") { value: String ->
    }
  }
}
