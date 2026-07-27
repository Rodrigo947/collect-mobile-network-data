# Requisitos

- Node 24.08
- Yarn: `$ npm install -g yarn`
- EAS: `$ npm install -g eas-cli`
- Android Studio

# Comandos úteis

- Criar um novo módulo nativo: `$ npx create-expo-module@latest --local`
- Criar pastas nativas: `$ yarn expo prebuild --clean`
- Executar o aplicativo nativo em um dispositivo físico: `$ yarn android|ios -d`
- Criar development build: `$ eas build --platform android --profile development`

# Entrega

- Verificar se existem pacotes disponíveis para atualização: npx expo-doctor
- Buildar versão e entregar na loja: eas build --platform android|ios --profile production
