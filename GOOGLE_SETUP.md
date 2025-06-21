# Configuração do Google Places API

## Passo a Passo para Configurar o Google Places Autocomplete

### 1. Ativar APIs no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto ou crie um novo
3. Vá para "APIs & Services" > "Library"
4. Ative as seguintes APIs:
   - **Places API** (para autocomplete)
   - **Maps JavaScript API** (se ainda não estiver ativa)
   - **Geocoding API** (para conversão de endereços)

### 2. Criar API Key

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "API Key"
3. Copie a API Key gerada

### 3. Configurar Restrições (Recomendado)

1. Clique na API Key criada
2. Em "Application restrictions":
   - Para desenvolvimento: selecione "None"
   - Para produção: configure restrições apropriadas
3. Em "API restrictions":
   - Selecione "Restrict key"
   - Marque: Places API, Maps JavaScript API, Geocoding API

### 4. Configurar no App

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua as API Keys pelas suas chaves:

```env
# Google Maps e Places API
GOOGLE_MAPS_API_KEY=SUA_API_KEY_AQUI
GOOGLE_PLACES_API_KEY=SUA_API_KEY_AQUI
```

**Importante**: 
- Nunca commite o arquivo `.env` com suas API Keys reais
- Adicione `.env` ao `.gitignore` se ainda não estiver
- Use a mesma API Key para ambas as configurações se desejar

### 5. Funcionalidades Implementadas

✅ **Autocomplete de Endereços**
- Busca em tempo real enquanto digita
- Resultados filtrados para o Brasil
- Interface em português
- Debounce de 300ms para otimizar requisições

✅ **Configurações**
- Busca restrita ao Brasil (`components: 'country:br'`)
- Idioma português (`language: 'pt-BR'`)
- Detalhes completos dos lugares (`fetchDetails: true`)

### 6. Testando

1. Reinicie o servidor Expo: `npm start`
2. Abra o modal de rota
3. Digite nos campos "Origem" e "Destino"
4. Veja as sugestões aparecerem automaticamente

### 7. Custos

- **Places Autocomplete**: $2.83 por 1000 requisições
- **Places Details**: $17 por 1000 requisições
- Google oferece $200 de crédito gratuito por mês

### 8. Troubleshooting

**Erro "API Key inválida":**
- Verifique se a Places API está ativada
- Confirme se a API Key está correta no `app.json`
- Aguarde alguns minutos após criar a API Key

**Sem resultados:**
- Verifique a conexão com internet
- Confirme se as restrições da API Key não estão bloqueando

**Performance:**
- O debounce de 300ms evita muitas requisições
- Resultados são limitados automaticamente
- Cache interno do componente otimiza a experiência