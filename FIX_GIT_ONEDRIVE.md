# 🔧 Solución para Git bloqueado por OneDrive

OneDrive está bloqueando los archivos de `.git`. Aquí tienes varias soluciones:

## Solución 1: Pausar OneDrive temporalmente (MÁS FÁCIL) ⭐

1. **Pausa OneDrive:**
   - Haz clic en el ícono de OneDrive en la bandeja del sistema (abajo a la derecha)
   - Haz clic en "Pausar sincronización" > "2 horas" (o el tiempo que necesites)

2. **Elimina .git manualmente:**
   - Abre el Explorador de Archivos
   - Ve a la carpeta del proyecto
   - Elimina la carpeta `.git` (puede estar oculta, activa "Mostrar archivos ocultos")
   - Si no puedes eliminarla, reinicia tu computadora y vuelve a intentar

3. **Inicializa Git de nuevo:**
   ```powershell
   cd "c:\Users\usuario\OneDrive\Fernando\OneDrive\Documentos\clip-del-anio-nordelta"
   git init
   git config user.name "Tu Nombre"
   git config user.email "tu-email@ejemplo.com"
   git add .
   git commit -m "Initial commit - Tournament voting app ready for deployment"
   ```

4. **Reanuda OneDrive** cuando termines

## Solución 2: Excluir .git de OneDrive

1. **Excluye la carpeta .git de OneDrive:**
   - Haz clic derecho en la carpeta del proyecto en OneDrive
   - Selecciona "OneDrive" > "Administrar sincronización"
   - O ve a Configuración de OneDrive > Cuenta > "Elegir carpetas"
   - Desmarca la carpeta del proyecto temporalmente

2. **Luego inicializa Git** (usando los comandos de arriba)

## Solución 3: Trabajar fuera de OneDrive (RECOMENDADO para Git)

1. **Copia el proyecto a una carpeta local:**
   ```powershell
   # Crea una carpeta fuera de OneDrive
   New-Item -ItemType Directory -Path "C:\Projects\clip-del-anio-nordelta" -Force
   
   # Copia todos los archivos (excepto .git y node_modules)
   Copy-Item -Path "c:\Users\usuario\OneDrive\Fernando\OneDrive\Documentos\clip-del-anio-nordelta\*" -Destination "C:\Projects\clip-del-anio-nordelta" -Recurse -Exclude ".git","node_modules",".next"
   ```

2. **Inicializa Git en la nueva ubicación:**
   ```powershell
   cd C:\Projects\clip-del-anio-nordelta
   git init
   git config user.name "Tu Nombre"
   git config user.email "tu-email@ejemplo.com"
   git add .
   git commit -m "Initial commit - Tournament voting app ready for deployment"
   ```

3. **Trabaja desde esta nueva ubicación** para Git y desarrollo

## Solución 4: Usar Git desde línea de comandos con permisos elevados

1. **Abre PowerShell como Administrador:**
   - Presiona `Win + X`
   - Selecciona "Windows PowerShell (Administrador)" o "Terminal (Administrador)"

2. **Ejecuta estos comandos:**
   ```powershell
   cd "c:\Users\usuario\OneDrive\Fernando\OneDrive\Documentos\clip-del-anio-nordelta"
   
   # Fuerza la eliminación
   Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
   
   # Espera un momento
   Start-Sleep -Seconds 2
   
   # Inicializa Git
   git init
   git config user.name "Tu Nombre"
   git config user.email "tu-email@ejemplo.com"
   git add .
   git commit -m "Initial commit - Tournament voting app ready for deployment"
   ```

## Recomendación Final

**Para evitar problemas futuros**, te recomiendo:
- Trabajar el proyecto en una carpeta fuera de OneDrive (como `C:\Projects\`)
- O excluir la carpeta `.git` de la sincronización de OneDrive
- OneDrive puede causar problemas con Git porque sincroniza archivos mientras Git los está usando

## Después de inicializar Git

Una vez que Git esté funcionando:

1. **Crea un repositorio en GitHub**
2. **Conecta tu repositorio:**
   ```powershell
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

¿Cuál solución quieres probar primero? Te recomiendo la **Solución 1** (pausar OneDrive) o la **Solución 3** (trabajar fuera de OneDrive).
