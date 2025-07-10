# 🚀 Instrucciones de Despliegue para HealthAI-SaaS

## Despliegue Automático con Script

Ejecuta el siguiente comando para desplegar automáticamente:

```bash
./deploy.sh
```

## Despliegue Manual Paso a Paso

### 1. Crear Repositorio en GitHub

Ve a https://github.com/new y crea un repositorio con:
- Nombre: `healthai-saas`
- Descripción: "Sistema integral de salud con IA - Entrenador personal, nutricionista, chef y psicólogo"
- Visibilidad: Público
- NO inicialices con README, .gitignore o licencia

### 2. Configurar Git y Push

```bash
# Si no has inicializado git
git init
git branch -m main

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit: HealthAI SaaS - Sistema integral de salud con IA"

# Agregar remote (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/healthai-saas.git

# Push al repositorio
git push -u origin main
```

### 3. Desplegar en Vercel

```bash
# Instalar Vercel CLI si no lo tienes
npm install -g vercel

# Desplegar
vercel
```

Durante el despliegue de Vercel:
1. Inicia sesión con tu cuenta de GitHub
2. Confirma que es un nuevo proyecto
3. Acepta las configuraciones detectadas (Next.js)
4. Vincula con tu repositorio de GitHub

### 4. Configurar Variables de Entorno en Vercel

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = (tu URL de Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (tu clave anónima de Supabase)

### 5. URLs Importantes

- **Desarrollo local**: http://localhost:3000
- **Producción**: https://healthai-saas.vercel.app (o tu dominio personalizado)
- **Dashboard Vercel**: https://vercel.com/dashboard
- **Repositorio**: https://github.com/TU_USUARIO/healthai-saas

## Comandos Útiles

```bash
# Ver estado de git
git status

# Ver remotes configurados
git remote -v

# Hacer nuevo despliegue
vercel --prod

# Ver logs de Vercel
vercel logs

# Desarrollo local
npm run dev

# Build local
npm run build

# Iniciar producción local
npm start
```

## Solución de Problemas

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/healthai-saas.git
```

### Puerto 3000 ocupado
```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 npm run dev
```