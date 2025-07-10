#!/bin/bash

# Script para configurar las variables de entorno en Vercel

echo "Configurando variables de entorno en Vercel..."

# Variables públicas
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Variable privada (service role key)
vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "Variables de entorno configuradas. Valores a ingresar:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL:"
echo "https://fulxozhozkeovsdvwjbl.supabase.co"
echo ""
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY:"
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bHhvemhvemtlb3ZzZHZ3amJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTM4MjQsImV4cCI6MjA2NzY2OTgyNH0.UWsV9DGCE-_pYRO_N2sdohmP5aAdFFl_BFdCnU_jvZE"
echo ""
echo "SUPABASE_SERVICE_ROLE_KEY:"
echo "sbp_59b60306e8646ac6ff83b0d86a87ee640439072d"
echo ""
echo "Después de configurar, ejecuta 'git push' para redesplegar."