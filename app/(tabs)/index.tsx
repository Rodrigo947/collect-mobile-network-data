import { getData, type NetworkData } from "@/modules/get-network-data";
import useTabsStyle from "@/styles/tabsStyle";
import { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function TabOneScreen() {
  const style = useTabsStyle();
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const loadNetworkData = async () => {
    setLoading(true);
    setStatus(null);

    try {
      if (Platform.OS === "android") {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ];

        const results = await PermissionsAndroid.requestMultiple(permissions);
        const hasLocationPermission =
          results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const hasPhoneStatePermission =
          results[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE] ===
          PermissionsAndroid.RESULTS.GRANTED;

        if (!hasLocationPermission || !hasPhoneStatePermission) {
          setStatus(
            "Permissões de localização e telefone são necessárias para ler a rede no Android.",
          );
        }
      }

      const data = await getData();
      setNetworkData(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNetworkData();
  }, []);

  return (
    <ScrollView>
      <View style={style.container}>
        <Text style={style.title}>Mobile Network</Text>
        <Text style={style.subtitle}>Dados capturados pelo módulo nativo</Text>

        <Pressable style={style.button} onPress={loadNetworkData}>
          <Text style={style.buttonText}>
            {loading ? "Atualizando..." : "Atualizar dados"}
          </Text>
        </Pressable>

        {status ? <Text style={style.error}>{status}</Text> : null}

        <View style={style.card}>
          <Text style={style.rowLabel}>Operadora</Text>
          <Text style={style.rowValue}>
            {networkData?.carrierName ?? "Sem dados"}
          </Text>

          <Text style={style.rowLabel}>Rede</Text>
          <Text style={style.rowValue}>
            {networkData?.networkType ?? "Sem dados"}
          </Text>

          <Text style={style.rowLabel}>Tecnologia</Text>
          <Text style={style.rowValue}>
            {networkData?.technology ?? "Sem dados"}
          </Text>

          <Text style={style.rowLabel}>RSSI / dBm</Text>
          <Text style={style.rowValue}>
            {networkData?.signalDbm ?? "Indisponível"}
          </Text>

          <Text style={style.rowLabel}>ASU</Text>
          <Text style={style.rowValue}>
            {networkData?.signalAsu ?? "Indisponível"}
          </Text>

          <Text style={style.rowLabel}>Nível</Text>
          <Text style={style.rowValue}>
            {networkData?.signalLevel ?? "Indisponível"}
          </Text>

          <Text style={style.rowLabel}>Conectado</Text>
          <Text style={style.rowValue}>
            {networkData?.isConnected ? "Sim" : "Não"}
          </Text>

          <Text style={style.rowLabel}>Roaming</Text>
          <Text style={style.rowValue}>
            {networkData?.isRoaming ? "Sim" : "Não"}
          </Text>

          {networkData?.error ? (
            <Text style={style.error}>{networkData.error}</Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}
