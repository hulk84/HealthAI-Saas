# 📊 Instrucciones de Supabase para HealthAI SaaS

## Tablas Creadas

### 1. `profiles`
- Información básica del usuario
- Se crea automáticamente al registrarse

### 2. `trainer_assessments`
- Evaluación inicial del entrenador personal
- Nivel fitness, objetivos, equipamiento disponible

### 3. `nutritionist_assessments`
- Evaluación del nutricionista
- Restricciones alimentarias, objetivos nutricionales

### 4. `chef_preferences`
- Preferencias culinarias
- Alimentos favoritos/no deseados

### 5. `psychologist_assessments`
- Evaluación psicológica inicial
- Estado motivacional, barreras identificadas

### 6. `chat_history`
- Historial de conversaciones con cada agente
- agent_type: 'trainer' | 'nutritionist' | 'chef' | 'psychologist'

### 7. `generated_plans`
- Planes generados por los agentes
- plan_type: tipo de plan (workout, meal, recipe, motivation)

## Configuración de Autenticación

### En Claude Desktop con MCP Supabase:

1. **Habilitar Email Auth**:
```sql
-- Ya debe estar habilitado, verificar en Authentication > Providers
```

2. **Configurar Email Templates** (si no está hecho):
- Ve a Authentication > Email Templates
- Personaliza los templates en español

3. **Políticas RLS** (Row Level Security):
Si no están creadas, ejecuta estos comandos:

```sql
-- Permitir a usuarios ver/editar su propio perfil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Permitir a usuarios ver sus propias evaluaciones
CREATE POLICY "Users can view own trainer assessments" ON trainer_assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own nutritionist assessments" ON nutritionist_assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own chef preferences" ON chef_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own psychologist assessments" ON psychologist_assessments
  FOR ALL USING (auth.uid() = user_id);

-- Chat history
CREATE POLICY "Users can view own chat history" ON chat_history
  FOR ALL USING (auth.uid() = user_id);

-- Generated plans
CREATE POLICY "Users can view own plans" ON generated_plans
  FOR ALL USING (auth.uid() = user_id);
```

## Triggers y Functions

### Crear perfil automáticamente al registrarse:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Datos de Prueba (Opcional)

Para crear usuarios de prueba:
```sql
-- Esto se hace desde la UI de Supabase en Authentication > Users
-- Click en "Invite User" y crea usuarios de prueba
```

## Verificación

1. **Tablas**: Verifica que todas las 7 tablas existan
2. **RLS**: Asegúrate de que RLS esté habilitado en todas las tablas
3. **Políticas**: Verifica que las políticas estén creadas
4. **Auth**: Email auth debe estar habilitado

## Notas Importantes

- **URL del Proyecto**: https://fulxozhozkeovsdvwjbl.supabase.co
- **Anon Key**: Ya configurada en variables de entorno
- **Service Role Key**: NO compartir, solo para operaciones del servidor

## Próximos Pasos

1. Implementar páginas de login/registro en Next.js
2. Crear componentes de autenticación
3. Implementar flujo de onboarding
4. Desarrollar interfaces de chat con agentes