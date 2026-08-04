import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import { requireNativeModule } from "expo-modules-core";

const GetNetworkData = requireNativeModule("GetNetworkData");

export default function TestScreen() {
  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  async function readNetwork() {
    try {
      setLoading(true);

      const result = await GetNetworkData.getNetworkMetrics();

      console.log(result);

      setData(result);
    } catch (e) {
      console.error(e);

      setData({
        error: String(e),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Teste do módulo nativo</Text>

      <Button
        title={loading ? "Lendo..." : "Ler métricas"}
        onPress={readNetwork}
      />

      <View style={styles.result}>
        <Text selectable>{JSON.stringify(data, null, 2)}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,

    flexGrow: 1,

    justifyContent: "center",
  },

  title: {
    fontSize: 24,

    marginBottom: 20,

    fontWeight: "bold",

    textAlign: "center",
  },

  result: {
    marginTop: 20,

    padding: 10,

    borderWidth: 1,

    borderRadius: 8,
  },
});
