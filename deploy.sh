#!/bin/bash

# Script de despliegue automático para HealthAI-SaaS
# Autor: Claude Assistant
# Fecha: $(date)

echo "🚀 Iniciando despliegue de HealthAI-SaaS..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para preguntar al usuario
ask_user() {
    read -p "$1 (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Asegúrate de ejecutar este script desde el directorio del proyecto"
    exit 1
fi

# Paso 1: Verificar estado de Git
echo -e "${YELLOW}📋 Paso 1: Verificando estado de Git...${NC}"
if [ ! -d ".git" ]; then
    echo "Inicializando repositorio Git..."
    git init
    git branch -m main
fi

# Mostrar estado actual
git status

# Paso 2: Configurar usuario de GitHub
echo ""
echo -e "${YELLOW}📋 Paso 2: Configuración de GitHub${NC}"
echo "Usuario actual de GitHub: hulk84"
if ask_user "¿Es correcto este usuario?"; then
    GITHUB_USER="hulk84"
else
    read -p "Ingresa tu usuario de GitHub: " GITHUB_USER
fi

# Paso 3: Agregar archivos y hacer commit
echo ""
echo -e "${YELLOW}📋 Paso 3: Preparando commit...${NC}"
if ask_user "¿Quieres agregar todos los archivos al commit?"; then
    git add .
    git commit -m "Initial commit: HealthAI SaaS - Sistema integral de salud con IA" || echo "Ya existe un commit inicial"
fi

# Paso 4: Configurar remote
echo ""
echo -e "${YELLOW}📋 Paso 4: Configurando repositorio remoto...${NC}"
REPO_URL="https://github.com/${GITHUB_USER}/healthai-saas.git"

# Verificar si ya existe un remote
if git remote | grep -q "origin"; then
    echo "Remote 'origin' ya existe:"
    git remote -v
    if ask_user "¿Quieres actualizar el remote?"; then
        git remote remove origin
        git remote add origin $REPO_URL
    fi
else
    git remote add origin $REPO_URL
fi

# Paso 5: Crear repositorio en GitHub
echo ""
echo -e "${YELLOW}📋 Paso 5: Repositorio de GitHub${NC}"
echo -e "${GREEN}Por favor, crea el repositorio en GitHub:${NC}"
echo "1. Ve a: https://github.com/new"
echo "2. Nombre: healthai-saas"
echo "3. Descripción: Sistema integral de salud con IA - Entrenador personal, nutricionista, chef y psicólogo"
echo "4. Visibilidad: Público"
echo "5. NO inicialices con README, .gitignore o licencia"
echo ""
if ask_user "¿Ya creaste el repositorio en GitHub?"; then
    echo "¡Perfecto! Continuemos..."
else
    echo "Por favor, crea el repositorio y luego ejecuta este script nuevamente."
    exit 0
fi

# Paso 6: Push a GitHub
echo ""
echo -e "${YELLOW}📋 Paso 6: Subiendo código a GitHub...${NC}"
if ask_user "¿Hacer push a GitHub?"; then
    git push -u origin main || {
        echo -e "${RED}Error al hacer push. Posibles soluciones:${NC}"
        echo "1. Verifica que el repositorio exista en GitHub"
        echo "2. Verifica tus credenciales de Git"
        echo "3. Si el repo tiene contenido, intenta: git pull origin main --rebase"
        exit 1
    }
fi

# Paso 7: Verificar Vercel CLI
echo ""
echo -e "${YELLOW}📋 Paso 7: Verificando Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI no encontrado. Instalando..."
    npm install -g vercel
fi

# Paso 8: Desplegar en Vercel
echo ""
echo -e "${YELLOW}📋 Paso 8: Desplegando en Vercel...${NC}"
echo -e "${GREEN}Instrucciones para Vercel:${NC}"
echo "1. Inicia sesión con tu cuenta de GitHub"
echo "2. Confirma que es un nuevo proyecto"
echo "3. Acepta las configuraciones detectadas"
echo "4. Vincula con el repositorio: ${GITHUB_USER}/healthai-saas"
echo ""
if ask_user "¿Iniciar despliegue en Vercel?"; then
    vercel
fi

# Paso 9: Instrucciones finales
echo ""
echo -e "${GREEN}✅ ¡Despliegue completado!${NC}"
echo ""
echo -e "${YELLOW}📝 Siguientes pasos:${NC}"
echo "1. Configura las variables de entorno en Vercel:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "2. URLs importantes:"
echo "   - Desarrollo: http://localhost:3000"
echo "   - Producción: https://healthai-saas.vercel.app"
echo "   - Dashboard: https://vercel.com/dashboard"
echo "   - GitHub: https://github.com/${GITHUB_USER}/healthai-saas"
echo ""
echo "3. Para futuros despliegues, simplemente ejecuta:"
echo "   git push origin main"
echo "   (Vercel se actualizará automáticamente)"

# Guardar configuración
echo ""
echo -e "${YELLOW}💾 Guardando configuración...${NC}"
cat > .deploy-config <<EOF
GITHUB_USER=${GITHUB_USER}
REPO_URL=${REPO_URL}
LAST_DEPLOY=$(date)
EOF

echo -e "${GREEN}✨ ¡Listo! Tu proyecto está configurado.${NC}"