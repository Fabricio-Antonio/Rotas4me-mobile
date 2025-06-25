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
  <strong>English version</strong> | <a href="README.pt.md">Portuguese version</a>
</p>




## Description
Roas4Me is an app that allows users to find and rate safe routes, report incidents, and share information about urban safety.

Rotas4Me was born as a bold and strategic response to the Safer Woman Challenge, promoted by [CBR17](https://brasil.campus-party.org/cpbr17/hackathons/desafio-mulher-mais-segura/) during the 2025 hackathon. This initiative aimed to encourage the development of tech solutions focused on preventing violence against women in the Federal District of Brazil.

More than just an app, Rotas4Me is a smart urban mobility platform focused on safety. It enables users to find and rate safe routes in real time, report incidents, and share critical information about risk areas — all collaboratively and based on geolocated data.

Designed to empower, protect, and transform daily urban life, Rotas4Me represents innovation with purpose and technology with real social impact.

<div align="center">
<p>Pitch of presentation</p>

[![Pitch Rotas4Me](https://img.youtube.com/vi/TQDn3RTcNbs/0.jpg)](https://www.youtube.com/watch?v=TQDn3RTcNbs)

</div>

## 🎯 Project Objective
Rotas4Me is a mobile app designed to help women navigate cities more safely. The concept is simple yet powerful: enable users to find and rate safe routes, report incidents in real time, and share relevant information about urban safety.

With a focus on prevention, the app uses collaborative data and geographical criteria to map routes that avoid high-risk areas — such as poorly lit streets, zones with a history of assaults, drug trafficking points, and other dangerous locations. Instead, it prioritizes paths near businesses, security cameras, and police stations.

On the home screen, the user sees a map with their current location and can:

Rate routes and check reviews from other users;

View real-time alerts marked by interactive icons on the map;

Trigger an emergency button that sends an SOS SMS with their location to trusted contacts previously registered;

Quickly start a police report, locate the nearest police station in the Federal District, and call 180, Brazil’s support hotline for women facing violence;

Receive automatic audio alerts when approaching areas with danger reports.

All content in the app is community-driven, making the system dynamic, scalable, and closely aligned with real street conditions. The entire project — including the pitch, business plan, mobile app, and website — was built in just 48 hours during the CBR17 Hackathon, as part of the Safer Woman Challenge.

Rotas4Me isn’t just an app.
It’s a community where women look out for each other. It’s about feeling safe, being heard, and knowing you're not alone. Whether you're heading home, to work, or anywhere life takes you — walk with us.
<br/>

<div align="center">
<p>Vídeo demo</p>

[![Demo Rotas4Me](https://img.youtube.com/vi/B-SbikprP_s/0.jpg)](https://www.youtube.com/shorts/B-SbikprP_s)

</div>
One important detail: I developed Rotas4Me without any prior experience in mobile development. Everything was built while learning in real time — hands-on, under pressure, and diving into new technologies with full focus on delivering a functional and purpose-driven solution. It was an intense, challenging, and truly transformative experience.

## 👨‍💻 Technologies Used

| Technologies         | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **React Native**   | Framework for building native mobile applications using JavaScript and React. It allows for creating Android and iOS apps with a single codebase. |
| **Expo**           | A platform that simplifies development with React Native, offering ready-to-use tools for building, deploying, and quick testing. Ideal for MVPs and rapid prototyping. |
| **TypeScript**     | A superset of JavaScript that adds static typing to the code, increasing robustness, readability, and development safety. |
| **Axios**          | A Promise-based HTTP client used to consume APIs in a simple, efficient way with refined error handling. |
| **Google Maps API**| A geolocation API used to display maps, calculate routes, and integrate real-time location features into the app. |

## 📋 Prerequisites
Before getting started, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development – macOS only)

## 🔧 Installation
Clone the repository:

```
git clone <https://github.com/Fabricio-Antonio/Rotas4me-mobile>
cd Rotas4me-mobile
```

Install dependencies:

```
npm install
# or
yarn install
```

Set up environment variables:

Create a .env file at the root of the project with the following variables:

```
# Backend API URL
EXPO_PUBLIC_BACKEND_URL=https://api.rotas4me.com

# Google Maps and Places API Keys
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Environment
EXPO_PUBLIC_ENVIRONMENT=development
```

### 🗝️ Google API Keys Configuration
To obtain your Google Maps API keys:
Go to the Google Cloud Console
Create a new project or select an existing one
Enable the following APIs:
- Maps SDK for Android
- Maps SDK for iOS
- Places API
Geocoding API
Create credentials (API Key)

Set up API restrictions as needed

### 🏃‍♂️ Running the Project
Development
```
# Start the development server
npm start
# or
yarn start
```

Platform-Specific Commands
```
# Android
npm run android
# or
yarn android

# iOS (macOS only)
npm run ios
# or
yarn ios

# Web
npm run web
# or
yarn web
```

## 📱 Testing on a Device
Using Expo Go
Install [Expo Go](https://expo.dev/client) on your device

Run ```npx expo start --tunnel``` in the terminal to use a USB connection, or ```npx expo start``` to use the local network

Scan the QR code using Expo Go (Android) or the Camera app (iOS)

## 📁 Project Structure
```
Rotas4me-mobile/
├── app/                    # Application pages (Expo Router)
│   ├── (tabs)/            # Main tabs
│   │   ├── index.tsx      # Main screen (map)
│   │   ├── call.tsx       # Emergency call screen
│   │   ├── info.tsx       # Safety tips and information
│   │   ├── profile.tsx    # User profile
│   │   └── report.tsx     # Incident reporting
│   ├── _layout.tsx        # Root layout
│   ├── modal.tsx          # Modal screens
│   ├── navigation.tsx     # Navigation
│   └── route-evaluation.tsx # Route evaluation
├── assets/                # Static assets
│   ├── fonts/             # Custom fonts (Poppins)
│   ├── icons/             # SVG icons
│   ├── images/            # Images
│   └── markers/           # Map markers
├── components/            # Reusable components
│   ├── AddressAutocomplete.tsx
│   ├── CustomTabBar.tsx
│   └── ...
├── constants/             # Constants and configurations
├── services/              # Services and APIs
│   ├── ApiService.ts      # Main API service
│   ├── NavigationService.ts
│   └── NominatimService.ts
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
└── package.json          # Project dependencies
```

## 🌐 Backend API
The app is integrated with the Rotas4me API. The main endpoints used are:

Safety Markers
- **GET** ```/maps/safety-markers``` – Fetch nearby safety markers

- **GET** ```/maps/all-markers``` – Fetch all markers

- **GET** ```/maps/markers-by-type``` – Fetch markers by type

- **GET** ```/marker/nearby``` – Fetch nearby markers using location parameters

Route Calculation
- **GET** ```/maps/route``` – Calculate route while avoiding dangerous markers

Parameters: origin, destination, avoidDangerous (boolean)

Geocoding
- **GET** ```/maps/geocode``` – Geocode an address

- **GET** ```/maps/reverse-geocode``` – Reverse geocoding

- **GET** ```/maps/distance-matrix``` – Calculate distance matrix

Users
- **GET** ```/user/nearby``` – Find nearby users

- **POST** ```/user/{id}/emergency-alert``` – Send emergency alert

SMS
- **GET** ```/sms/status``` – Check SMS service status (used as health check)

## 🌍 Environment Variables
| Variável | Descrição | Exemplo |
|----------|-----------|----------|
| `EXPO_PUBLIC_BACKEND_URL` | Backend API URL	 | `https://api.rotas4me.com` |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API Key	 | `AIzaSy...` |
| `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` | Google Places API Key	 | `AIzaSy...` |
| `EXPO_PUBLIC_ENVIRONMENT` | Runtime environment	 | `development`, `production` |

## 🔒 Security
- **Never** commit API keys to the repository
- Use environment variables for sensitive information
- Configure proper restrictions on Google Cloud APIs
- Keep dependencies up to date

## 🐛 Troubleshooting
API Key Not Found Error

```
# Clear cache and restart
npx expo start --clear
```
```
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear Expo cache and fix dependencies
npx expo install --fix
```

### Map Issues
1. Verify that API keys are configured correctly
2. Confirm the required APIs are enabled in Google Cloud
3. Check API restrictions settings

# Team  👥

[Radymilla Camilo](https://www.linkedin.com/in/radymilla-cristiano/) - Product & Brand Designer <br/>
[Kayus Gracco](https://www.linkedin.com/in/engkayusgracco/) - Business & VideoMaker <br/>
[Luiza Juá](https://www.linkedin.com/in/luiza-ju%C3%A1-589b96311/) - Research & Data Analysis <br/>
[Fabrício Santos](https://www.linkedin.com/in/fabricio-ss/) - Web & Mobile Developer <br/>
[Thauan Rodrigues](https://www.linkedin.com/in/thauan-rodrigues-1744072a6/) Back-end Developer & DevOps <br/>

📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

