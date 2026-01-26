# 🚀 Guía Rápida: Inicializar Git y Crear Base de Datos

## Parte 1: Inicializar Git

### Si hay problemas con OneDrive:

**Opción A: Limpiar y reinicializar (Recomendado)**
```powershell
# Abre PowerShell en la carpeta del proyecto
cd "c:\Users\usuario\OneDrive\Fernando\OneDrive\Documentos\clip-del-anio-nordelta"

# Elimina la carpeta .git si existe (puede estar corrupta)
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

# Inicializa Git de nuevo
git init

# Configura tu usuario (reemplaza con tus datos)
git config user.name "Tu Nombre"
git config user.email "tu-email@ejemplo.com"

# Agrega todos los archivos
git add .

# Crea el commit inicial
git commit -m "Initial commit - Tournament voting app ready for deployment"
```

**Opción B: Usar Git desde línea de comandos fuera de OneDrive**
Si OneDrive sigue causando problemas, puedes:
1. Copiar el proyecto a una carpeta fuera de OneDrive temporalmente
2. Inicializar Git allí
3. Luego moverlo de vuelta o trabajar desde ahí

### Conectar con GitHub:

1. **Crea un repositorio en GitHub:**
   - Ve a [github.com](https://github.com) e inicia sesión
   - Haz clic en el botón "+" (arriba a la derecha) > "New repository"
   - Nombre: `clip-del-anio-nordelta` (o el que prefieras)
   - **NO marques** "Initialize with README"
   - Haz clic en "Create repository"

2. **Conecta tu repositorio local:**
   ```powershell
   # Reemplaza TU_USUARIO y TU_REPOSITORIO con tus datos
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

## Parte 2: Crear Base de Datos PostgreSQL

### Opción 1: Supabase (GRATIS y FÁCIL) ⭐ Recomendado

1. **Crea una cuenta:**
   - Ve a [supabase.com](https://supabase.com)
   - Haz clic en "Start your project"
   - Inicia sesión con GitHub (más fácil)

2. **Crea un nuevo proyecto:**
   - Haz clic en "New Project"
   - Nombre: `clip-del-anio-nordelta` (o el que prefieras)
   - Contraseña de base de datos: **Guárdala bien, la necesitarás**
   - Región: Elige la más cercana a ti
   - Haz clic en "Create new project"
   - Espera 2-3 minutos a que se cree

3. **Obtén la URL de conexión:**
   - Ve a Settings (⚙️) > Database
   - Busca "Connection string" > "URI"
   - Copia la URL (se ve así: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - **Reemplaza `[PASSWORD]` con la contraseña que creaste**

4. **Guarda esta URL** - La necesitarás para Vercel

### Opción 2: Vercel Postgres (Integrado con Vercel)

1. **Primero despliega en Vercel** (ver Parte 3)
2. En tu proyecto de Vercel, ve a la pestaña "Storage"
3. Haz clic en "Create Database" > "Postgres"
4. Copia la `DATABASE_URL` que te proporciona

### Opción 3: Railway (GRATIS para empezar)

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Haz clic en "New Project"
4. Selecciona "Database" > "PostgreSQL"
5. Railway creará la base de datos automáticamente
6. Haz clic en el servicio PostgreSQL
7. Ve a la pestaña "Variables"
8. Copia la `DATABASE_URL`

## Parte 3: Actualizar Prisma para PostgreSQL

Una vez que tengas tu `DATABASE_URL`, actualiza Prisma:

1. **Edita `prisma/schema.prisma`:**
   - Cambia la línea 9 de:
     ```prisma
     provider = "sqlite"
     ```
   - A:
     ```prisma
     provider = "postgresql"
     ```

2. **Genera el cliente:**
   ```powershell
   npx prisma generate
   ```

3. **Crea las migraciones:**
   ```powershell
   # Primero, configura la DATABASE_URL temporalmente
   $env:DATABASE_URL="TU_URL_DE_POSTGRESQL_AQUI"
   npx prisma migrate dev --name init
   ```

4. **Commit los cambios:**
   ```powershell
   git add .
   git commit -m "Configure for PostgreSQL"
   git push
   ```

## Parte 4: Desplegar en Vercel

1. **Ve a [vercel.com](https://vercel.com)**
   - Inicia sesión con GitHub

2. **Importa tu proyecto:**
   - Haz clic en "Add New..." > "Project"
   - Selecciona tu repositorio de GitHub
   - Haz clic en "Import"

3. **Configura las variables de entorno:**
   - `DATABASE_URL`: Tu URL de PostgreSQL (de Supabase/Railway/Vercel)
   - `ADMIN_PASSWORD`: Tu contraseña de admin (ej: "mi-password-segura-2025")
   - `NEXT_PUBLIC_TOURNAMENT_NAME`: "Nordelta 2025" (opcional)

4. **Despliega:**
   - Haz clic en "Deploy"
   - Espera 2-5 minutos

5. **Ejecuta migraciones:**
   - Después del despliegue, instala Vercel CLI:
     ```powershell
     npm i -g vercel
     vercel login
     ```
   - En tu proyecto:
     ```powershell
     vercel link
     vercel env pull .env.production
     npx prisma migrate deploy
     ```

## Checklist

- [ ] Git inicializado y conectado a GitHub
- [ ] Base de datos PostgreSQL creada (Supabase/Railway/Vercel)
- [ ] `DATABASE_URL` copiada y guardada
- [ ] Prisma actualizado a PostgreSQL
- [ ] Migraciones creadas localmente
- [ ] Código subido a GitHub
- [ ] Proyecto desplegado en Vercel
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones ejecutadas en producción

## ¿Necesitas ayuda?

Si tienes problemas en algún paso, avísame y te ayudo a resolverlo paso a paso.
