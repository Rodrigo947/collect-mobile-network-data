import ExpoModulesCore
import CoreTelephony

public class GetNetworkDataModule: Module {
  public func definition() -> ModuleDefinition {
    Name("GetNetworkData")

    AsyncFunction("getData") {
      let info = CTTelephonyNetworkInfo()
      let carrier = info.serviceSubscriberCellularProviders?.values.first
      let radioAccess = info.serviceCurrentRadioAccessTechnology?.values.first

      return [
        "carrierName": carrier?.carrierName as Any,
        "networkType": radioAccess as Any,
        "technology": radioAccess as Any,
        "signalDbm": nil,
        "signalAsu": nil,
        "signalLevel": nil,
        "isConnected": carrier != nil,
        "isRoaming": carrier?.allowsVOIP == false,
        "permissionRequired": false,
        "error": nil
      ]
    }
  }
}
