# -----------------------------
# Etapa 1: Build da aplicação
# -----------------------------
FROM node:20-alpine AS build

# Define diretório
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Build de produção
RUN npm run build

# -----------------------------------
# Etapa 2: Servir com Nginx (produção)
# -----------------------------------
FROM nginx:alpine

# Limpa arquivos padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Porta
EXPOSE 80

# Inicializa o servidor
CMD ["nginx", "-g", "daemon off;"]
