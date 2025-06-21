# Rotas4me Mobile

Aplicativo móvel para navegação e avaliação de rotas seguras, desenvolvido com React Native e Expo.

## 📱 Sobre o Projeto

O Rotas4me é um aplicativo que permite aos usuários encontrar e avaliar rotas seguras, reportar incidentes e compartilhar informações sobre segurança urbana.

## 🚀 Tecnologias Utilizadas

- **React Native** 0.79.4
- **Expo** ~53.0.12
- **Expo Router** ~5.1.0
- **React Native Maps** 1.20.1
- **TypeScript** ~5.8.3
- **Axios** para requisições HTTP
- **Google Maps API** para mapas e autocompletar

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para desenvolvimento Android)
- [Xcode](https://developer.apple.com/xcode/) (para desenvolvimento iOS - apenas macOS)

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd Rotas4me-mobile
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL da API Backend
EXPO_PUBLIC_BACKEND_URL=https://api.rotas4me.com

# Google Maps e Places API Keys
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_google_maps_api_key_aqui
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=sua_google_places_api_key_aqui

# Environment
EXPO_PUBLIC_ENVIRONMENT=development
```

### 🗝️ Configuração das API Keys do Google

Para obter as chaves da API do Google Maps:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
4. Crie credenciais (API Key)
5. Configure as restrições de API conforme necessário

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
npm start
# ou
yarn start
```

### Plataformas Específicas

```bash
# Android
npm run android
# ou
yarn android

# iOS (apenas macOS)
npm run ios
# ou
yarn ios

# Web
npm run web
# ou
yarn web
```

## 📱 Testando no Dispositivo

### Usando Expo Go

1. Instale o [Expo Go](https://expo.dev/client) no seu dispositivo
2. Execute `npx expo start --tunnel` no terminal utilizando um cabo, e `npx expo start` para utilizar a rede.
3. Escaneie o QR code com o Expo Go (Android) ou Camera (iOS)

## 📁 Estrutura do Projeto

```
Rotas4me-mobile/
├── app/                    # Páginas da aplicação (Expo Router)
│   ├── (tabs)/            # Abas principais
│   │   ├── index.tsx      # Tela principal (mapa)
│   │   ├── call.tsx       # Tela de chamadas de emergência
│   │   ├── info.tsx       # Informações e dicas
│   │   ├── profile.tsx    # Perfil do usuário
│   │   └── report.tsx     # Reportar incidentes
│   ├── _layout.tsx        # Layout raiz
│   ├── modal.tsx          # Modal screens
│   ├── navigation.tsx     # Navegação
│   └── route-evaluation.tsx # Avaliação de rotas
├── assets/                # Recursos estáticos
│   ├── fonts/             # Fontes customizadas (Poppins)
│   ├── icons/             # Ícones SVG
│   ├── images/            # Imagens
│   └── markers/           # Marcadores do mapa
├── components/            # Componentes reutilizáveis
│   ├── AddressAutocomplete.tsx
│   ├── CustomTabBar.tsx
│   └── ...
├── constants/             # Constantes e configurações
├── services/              # Serviços e APIs
│   ├── ApiService.ts      # Serviço principal da API
│   ├── NavigationService.ts
│   └── NominatimService.ts
├── app.json              # Configuração do Expo
├── eas.json              # Configuração do EAS Build
└── package.json          # Dependências do projeto
```

## 🌐 API Backend

O aplicativo está integrado com a API Rotas4me. Os principais endpoints utilizados são:

### Marcadores de Segurança
- **GET** `/maps/safety-markers` - Buscar marcadores de segurança próximos
- **GET** `/maps/all-markers` - Buscar todos os marcadores
- **GET** `/maps/markers-by-type` - Buscar marcadores por tipo
- **GET** `/marker/nearby` - Buscar marcadores próximos com parâmetros de localização

### Cálculo de Rota
- **GET** `/maps/route` - Calcular rota evitando marcadores perigosos
- Parâmetros: `origin`, `destination`, `avoidDangerous` (boolean)

### Geocodificação
- **GET** `/maps/geocode` - Geocodificar endereço
- **GET** `/maps/reverse-geocode` - Geocodificação reversa
- **GET** `/maps/distance-matrix` - Calcular matriz de distância

### Usuários
- **GET** `/user/nearby` - Buscar usuários próximos
- **POST** `/user/{id}/emergency-alert` - Enviar alerta de emergência

### SMS
- **GET** `/sms/status` - Verificar status do serviço SMS (usado como health check)

## 🌍 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|----------|
| `EXPO_PUBLIC_BACKEND_URL` | URL da API backend | `https://api.rotas4me.com` |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Chave da API do Google Maps | `AIzaSy...` |
| `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` | Chave da API do Google Places | `AIzaSy...` |
| `EXPO_PUBLIC_ENVIRONMENT` | Ambiente de execução | `development`, `production` |

## 🔒 Segurança

- **Nunca** commite as chaves de API no repositório
- Use variáveis de ambiente para informações sensíveis
- Configure restrições adequadas nas APIs do Google Cloud
- Mantenha as dependências atualizadas

## 🐛 Solução de Problemas

### Erro de API Key não encontrada

```bash
# Limpe o cache e reinicie
npx expo start --clear
```
```bash
# Limpe node_modules e reinstale
rm -rf node_modules
npm install

# Limpe cache do Expo
npx expo install --fix
```

### Problemas com mapas

1. Verifique se as API Keys estão configuradas corretamente
2. Confirme se as APIs necessárias estão ativadas no Google Cloud
3. Verifique as restrições de API

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
