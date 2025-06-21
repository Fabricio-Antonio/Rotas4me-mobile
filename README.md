# Rotas4me Mobile

Aplicativo mobile para cálculo de rotas seguras usando React Native e Expo.

## Configuração do Backend

### Variáveis de Ambiente

O aplicativo agora está configurado para usar um backend real. As configurações estão no arquivo `.env` e `app.json`.

#### Arquivo .env
```
BACKEND_URL=http://localhost:3000
ENVIRONMENT=development
```

#### Configuração no app.json
As variáveis são expostas através da seção `extra` no `app.json`:
```json
"extra": {
  "backendUrl": "http://localhost:3000",
  "environment": "development"
}
```

### Endpoints do Backend

O aplicativo está integrado com a API documentada no Swagger (`http://localhost:3000/api/docs-json`). Os principais endpoints utilizados são:

#### Marcadores de Segurança
- **GET** `/maps/safety-markers` - Buscar marcadores de segurança próximos
- **GET** `/maps/all-markers` - Buscar todos os marcadores
- **GET** `/maps/markers-by-type` - Buscar marcadores por tipo
- **GET** `/marker/nearby` - Buscar marcadores próximos com parâmetros de localização

#### Cálculo de Rota
- **GET** `/maps/route` - Calcular rota evitando marcadores perigosos
- Parâmetros: `origin`, `destination`, `avoidDangerous` (boolean)

#### Geocodificação
- **GET** `/maps/geocode` - Geocodificar endereço
- **GET** `/maps/reverse-geocode` - Geocodificação reversa
- **GET** `/maps/distance-matrix` - Calcular matriz de distância

#### Usuários
- **GET** `/user/nearby` - Buscar usuários próximos
- **POST** `/user/{id}/emergency-alert` - Enviar alerta de emergência

#### SMS
- **GET** `/sms/status` - Verificar status do serviço SMS (usado como health check)
- **POST** `/sms/send` - Enviar SMS

### APIs Externas

#### Google Maps API
Se você precisar usar a Google Maps API diretamente no frontend:

1. Obtenha uma chave da API no [Google Cloud Console](https://console.cloud.google.com/)
2. Adicione no `.env`:
```
GOOGLE_MAPS_API_KEY=sua_chave_aqui
```
3. Adicione no `app.json`:
```json
"extra": {
  "googleMapsApiKey": "sua_chave_aqui"
}
```

**Nota:** É recomendado usar a Google Maps API apenas no backend por questões de segurança.

### Fallback para Dados Simulados

O aplicativo possui um sistema de fallback robusto:

1. **Primeira tentativa**: Usa o backend real
2. **Se o backend estiver indisponível**: Usa dados simulados
3. **Se houver erro na requisição**: Tenta fallback para dados simulados

Isso garante que o aplicativo sempre funcione, mesmo sem conexão com o backend.

### Estrutura do Projeto

```
├── services/
│   └── ApiService.ts          # Serviço centralizado para chamadas de API
├── constants/
│   └── Config.ts              # Configurações centralizadas
├── app/
│   └── modal.tsx              # Modal de criação de rotas (atualizado)
├── .env                       # Variáveis de ambiente
└── app.json                   # Configuração do Expo
```

### Como Executar

1. **Instalar dependências**:
```bash
npm install
```

2. **Configurar o backend**:
   - Certifique-se de que seu backend está rodando em `http://localhost:3000`
   - Ou atualize a URL no `.env` e `app.json`

3. **Executar o aplicativo**:
```bash
npm start
```

### Logs e Debug

O aplicativo agora inclui logs detalhados:
- ✅ Sucesso ao carregar dados do backend
- ⚠️ Fallback para dados simulados
- ❌ Erros de conexão ou API

Verifique o console do Metro/Expo para acompanhar o status das requisições.

### Próximos Passos

1. **Implementar autenticação** (se necessário)
2. **Adicionar cache local** para markers e rotas
3. **Implementar sincronização offline**
4. **Adicionar testes unitários** para o ApiService
5. **Configurar diferentes ambientes** (dev, staging, prod)