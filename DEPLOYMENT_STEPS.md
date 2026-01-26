# 🚀 Guía de Despliegue - Clip del Año Nordelta

## Opción 1: Despliegue en Vercel (Recomendado)

### Paso 1: Preparar el código

1. **Asegúrate de tener Git inicializado:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ready for deployment"
   ```

2. **Crea un repositorio en GitHub:**
   - Ve a [github.com](https://github.com) y crea un nuevo repositorio
   - No inicialices con README, .gitignore, o licencia
   - Copia la URL del repositorio

3. **Conecta tu repositorio local:**
   ```bash
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Configurar base de datos PostgreSQL

**Opción A: Vercel Postgres (Más fácil)**
1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. En tu proyecto, ve a la pestaña "Storage"
3. Crea una nueva base de datos Postgres
4. Copia la `DATABASE_URL` que te proporciona

**Opción B: Supabase (Gratis y fácil)**
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la "Connection string" (URI)
5. Formato: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**Opción C: Railway, Neon, o cualquier PostgreSQL**
- Cualquier proveedor de PostgreSQL funcionará
- Solo necesitas la URL de conexión

### Paso 3: Actualizar Prisma para PostgreSQL

1. **Edita `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Cambia de "sqlite" a "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Genera el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

3. **Crea la migración:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Commit los cambios:**
   ```bash
   git add .
   git commit -m "Configure for PostgreSQL"
   git push
   ```

### Paso 4: Desplegar en Vercel

1. **Ve a [vercel.com](https://vercel.com)**
   - Haz clic en "Add New..." > "Project"
   - Importa tu repositorio de GitHub

2. **Configura el proyecto:**
   - Framework Preset: Next.js (debería detectarse automáticamente)
   - Root Directory: `./` (dejar vacío)
   - Build Command: `npm run build` (o dejar por defecto)
   - Output Directory: `.next` (o dejar por defecto)

3. **Configura las variables de entorno:**
   - `DATABASE_URL`: Tu URL de PostgreSQL (del Paso 2)
   - `ADMIN_PASSWORD`: Tu contraseña de administrador (ej: "mi-password-segura-2025")
   - `NEXT_PUBLIC_TOURNAMENT_NAME`: "Nordelta 2025" (opcional)

4. **Despliega:**
   - Haz clic en "Deploy"
   - Espera a que termine el build (puede tardar 2-5 minutos)

### Paso 5: Ejecutar migraciones en producción

Después del primer despliegue, necesitas ejecutar las migraciones:

**Opción A: Desde Vercel CLI (Recomendado)**
```bash
npm i -g vercel
vercel login
vercel link  # Conecta con tu proyecto
vercel env pull .env.production  # Descarga las variables de entorno
npx prisma migrate deploy
```

**Opción B: Desde el dashboard de Vercel**
1. Ve a tu proyecto en Vercel
2. Pestaña "Settings" > "Functions"
3. Agrega un "Build Command" personalizado:
   ```
   npx prisma generate && npx prisma migrate deploy && next build
   ```
4. Redespliega el proyecto

### Paso 6: Configurar el torneo

1. **Accede a tu sitio desplegado:**
   - URL será algo como: `https://tu-proyecto.vercel.app`

2. **Inicia sesión como admin:**
   - Ve a `/admin/login`
   - Usa la contraseña que configuraste en `ADMIN_PASSWORD`

3. **Crea tu torneo:**
   - Crea un nuevo torneo
   - Actívalo
   - Sube los 64 videos

4. **Genera los partidos:**
   - Ve a la sección de partidos
   - Haz clic en "Generar Ronda 1"
   - Abre los partidos para votación

## Opción 2: Despliegue en Railway

1. **Crea cuenta en [railway.app](https://railway.app)**
2. **Crea un nuevo proyecto**
3. **Agrega PostgreSQL:**
   - New > Database > PostgreSQL
4. **Agrega servicio desde GitHub:**
   - New > GitHub Repo > Selecciona tu repo
5. **Configura variables de entorno:**
   - `DATABASE_URL`: Se configura automáticamente desde PostgreSQL
   - `ADMIN_PASSWORD`: Tu contraseña
   - `NEXT_PUBLIC_TOURNAMENT_NAME`: "Nordelta 2025"
6. **Railway detectará Next.js automáticamente**
7. **Ejecuta migraciones:**
   - En el servicio, abre la terminal
   - Ejecuta: `npx prisma migrate deploy`

## Opción 3: Despliegue en Render

1. **Crea cuenta en [render.com](https://render.com)**
2. **Crea PostgreSQL:**
   - New > PostgreSQL
3. **Crea Web Service:**
   - New > Web Service
   - Conecta tu repositorio de GitHub
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start Command: `npm start`
4. **Configura variables de entorno:**
   - `DATABASE_URL`: Desde PostgreSQL
   - `ADMIN_PASSWORD`: Tu contraseña
   - `NEXT_PUBLIC_TOURNAMENT_NAME`: "Nordelta 2025"

## Checklist Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] Prisma configurado para PostgreSQL
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Admin password configurado
- [ ] Sitio accesible públicamente

## Troubleshooting

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Database migrations pending"
```bash
npx prisma migrate deploy
```

### Error: "Environment variable not found"
- Verifica que todas las variables estén configuradas en tu plataforma de despliegue
- Reinicia el servicio después de agregar variables

### Error: "Cannot connect to database"
- Verifica que la `DATABASE_URL` esté correcta
- Asegúrate de que la base de datos permita conexiones externas
- Verifica que el firewall permita conexiones desde tu proveedor de hosting

## Post-Despliegue

1. **Prueba el flujo completo:**
   - Accede como admin
   - Crea un torneo de prueba
   - Sube algunos videos
   - Genera partidos
   - Vota desde una sesión anónima

2. **Comparte el enlace:**
   - Comparte la URL con tus amigos
   - Ellos pueden votar sin necesidad de registrarse

3. **Monitorea:**
   - Revisa los logs en tu plataforma de hosting
   - Verifica que las votaciones se registren correctamente

## Notas Importantes

- **SQLite NO funciona en producción** (solo para desarrollo local)
- **Necesitas PostgreSQL** para producción
- **Las migraciones deben ejecutarse** antes de usar la app
- **Guarda tu ADMIN_PASSWORD** de forma segura
- **El sitio es público** - cualquiera puede votar, solo admin puede gestionar

¡Listo para compartir! 🎉
