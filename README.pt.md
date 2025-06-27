# Rotas4me

<div align="center">
<img src="https://github.com/user-attachments/assets/37340718-e074-4e7d-89b3-8c90f9570566" width="120" />
</div>
<br/>

<p align="center">
  <img src="https://img.shields.io/badge/project-active--development-yellow" />
  <img src="https://img.shields.io/badge/made%20with-React--Native-blue" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  <br/>
  <a href="README.pt.md">English version</a> | <strong>Portuguese version</strong>

</p>



## Descrição

O Roas4Me é um aplicativo que permite aos usuários encontrar e avaliar rotas seguras, reportar incidentes e compartilhar informações sobre segurança urbana.
Rotas4Me nasceu como uma resposta ousada e estratégica ao Desafio Mulher Mais Segura, promovido pela [CBR17](https://brasil.campus-party.org/cpbr17/hackathons/desafio-mulher-mais-segura/) no hackathon de 2025. Essa iniciativa teve como objetivo central incentivar o desenvolvimento de soluções tecnológicas voltadas à prevenção da violência contra a mulher no Distrito Federal.
<br/>
<br/>
Mais do que um simples aplicativo, o Rotas4Me é uma plataforma inteligente de mobilidade urbana com foco em segurança. Ele permite que usuários encontrem e avaliem rotas seguras em tempo real, relatem incidentes e compartilhem informações críticas sobre pontos de risco — tudo de forma colaborativa e com base em dados geolocalizados.
<br/>
<br/>
Criado para empoderar, proteger e transformar o cotidiano urbano, o Rotas4Me representa inovação com propósito e tecnologia com impacto social real.

<br/>

<div align="center">
<p>Pitch de apresentação</p>

[![Pitch Rotas4Me](https://img.youtube.com/vi/TQDn3RTcNbs/0.jpg)](https://www.youtube.com/watch?v=TQDn3RTcNbs)

</div>

## 🎯 Objetivo do projeto
Rotas4Me é um aplicativo mobile criado para ajudar mulheres a se locomoverem com mais segurança nas cidades. A proposta é simples, mas poderosa: permitir que usuárias encontrem e avaliem rotas seguras, relatem incidentes em tempo real e compartilhem informações relevantes sobre segurança urbana. 

Focado na prevenção, o app utiliza dados colaborativos e critérios geográficos para traçar caminhos que evitam áreas de risco — como ruas mal iluminadas, regiões com histórico de assaltos, pontos de tráfico e outros locais perigosos. Em contrapartida, prioriza trajetos com presença de comércios, câmeras de segurança, e proximidade de delegacias.


Na tela inicial, a usuária visualiza um mapa com sua localização atual e pode:

- Avaliar rotas e consultar avaliações de outras usuárias;

- Ver alertas em tempo real sinalizados por ícones interativos no mapa;

- Acionar um botão de emergência, que envia um SMS com pedido de socorro e localização para contatos de confiança previamente cadastrados;

- Iniciar rapidamente um boletim de ocorrência, localizar a delegacia mais próxima no DF e ligar para o 180, canal de apoio à mulher em situação de violência;

- Receber alertas sonoros automáticos ao se aproximar de áreas com registros de perigo.


Todo o conteúdo do app é construído com base em informações da própria comunidade, tornando o sistema vivo, escalável e conectado à realidade das ruas. O projeto completo — incluindo pitch, plano de negócios, aplicativo mobile e site — foi desenvolvido em apenas 48 horas durante o hackathon da CBR17, no contexto do Desafio Mulher Mais Segura.

Rotas4Me não é só um aplicativo. É uma comunidade que protege umas às outras. É sobre se sentir segura, ser ouvida, e saber que não está sozinha. Seja para ir pra casa, pro trabalho ou pra vida, caminhe com a gente!
<br/>

<div align="center">
<p>Vídeo demo</p>

[![Demo Rotas4Me](https://img.youtube.com/vi/B-SbikprP_s/0.jpg)](https://www.youtube.com/shorts/B-SbikprP_s)

</div>
Um detalhe importante: desenvolvi o Rotas4Me sem nunca ter tido contato prévio com desenvolvimento mobile. Tudo foi feito aprendendo em tempo real, com mão na massa, explorando novas tecnologias sob pressão e com foco total em entregar uma solução funcional e com propósito. Foi uma imersão intensa, desafiadora — e extremamente transformadora.
 
## 👨‍💻 Tecnologias Utilizadas


| Tecnologias         | Descrição                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **React Native**   | Framework para desenvolvimento de aplicativos mobile nativos com JavaScript e React. Permite criar apps para Android e iOS com uma única base de código. |
| **Expo**           | Plataforma que facilita o desenvolvimento com React Native, oferecendo ferramentas prontas para build, deploy e testes rápidos. Ideal para MVPs e prototipagem ágil. |
| **TypeScript**     | Superset do JavaScript que adiciona tipagem estática ao código, aumentando a robustez, legibilidade e segurança durante o desenvolvimento. |
| **Axios**          | Cliente HTTP baseado em Promises, usado para consumir APIs de forma simples, eficiente e com controle de erros refinado. |
| **Google Maps API**| API de geolocalização usada para exibir mapas, calcular rotas e integrar recursos de localização em tempo real no app. |


## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para desenvolvimento Android)
- [Xcode](https://developer.apple.com/xcode/) (para desenvolvimento iOS - apenas macOS)

## 🗺️ User map

<img width="8320" alt="Brainstorm _ Documentação" src="https://github.com/user-attachments/assets/2401f489-5920-421c-8fae-5b1f2869177b" />

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone <https://github.com/Fabricio-Antonio/Rotas4me-mobile>
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

# Equipe  👥

[Radymilla Camilo](https://www.linkedin.com/in/radymilla-cristiano/) - Product & Brand Designer <br/>
[Kayus Gracco](https://www.linkedin.com/in/engkayusgracco/) - Business & VideoMaker <br/>
[Luiza Juá](https://www.linkedin.com/in/luiza-ju%C3%A1-589b96311/) - Research & Data Analysis <br/>
[Fabrício Santos](https://www.linkedin.com/in/fabricio-ss/) - Web & Mobile Developer <br/>
[Thauan Rodrigues](https://www.linkedin.com/in/thauan-rodrigues-1744072a6/) Back-end Developer & DevOps <br/>

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
