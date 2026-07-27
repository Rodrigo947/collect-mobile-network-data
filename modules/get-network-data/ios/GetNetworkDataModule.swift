import ExpoModulesCore

public class GetNetworkDataModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GetNetworkData")

    AsyncFunction("getData") { (value: String) in
    }
  }
}
