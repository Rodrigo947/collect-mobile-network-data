import useTabsStyle from "@/styles/tabsStyle";
import { Text, View } from "react-native";

export default function TabOneScreen() {
  const style = useTabsStyle();
  return (
    <View style={style.container}>
      <Text style={style.title}>Tab One</Text>
      <View style={style.separator} />
    </View>
  );
}
