#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Carrega variáveis de ambiente
source .env

echo "🚀 Iniciando setup do banco de dados..."

# Conectar ao projeto
if ! supabase link --project-ref "$SUPABASE_PROJECT_ID"; then
    echo "${RED}❌ Falha ao conectar ao projeto${NC}"
    exit 1
fi

# Configurar senha do banco
if ! supabase db remote set --password "$SUPABASE_DB_PASSWORD"; then
    echo "${RED}❌ Falha ao configurar senha do banco${NC}"
    exit 1
fi

# Resetar o banco (apenas em desenvolvimento)
if [ "$NODE_ENV" != "production" ]; then
    echo "🗑️  Resetando banco de dados..."
    PGPASSWORD="$SUPABASE_DB_PASSWORD" supabase db reset
fi

# Aplicar migrações
echo "📦 Aplicando migrações..."
if ! PGPASSWORD="$SUPABASE_DB_PASSWORD" supabase db push; then
    echo "${RED}❌ Falha ao aplicar migrações${NC}"
    exit 1
fi

# Executar seeds em desenvolvimento
if [ "$NODE_ENV" != "production" ]; then
    echo "🌱 Inserindo dados iniciais..."
    for seed_file in supabase/seed/*.sql; do
        echo "Executando $seed_file..."
        if ! PGPASSWORD="$SUPABASE_DB_PASSWORD" psql "$DATABASE_URL" -f "$seed_file"; then
            echo "${RED}❌ Falha ao executar seed: $seed_file${NC}"
            exit 1
        fi
    done
fi

echo "${GREEN}✅ Setup concluído com sucesso!${NC}" 