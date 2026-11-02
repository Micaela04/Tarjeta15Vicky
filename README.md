# MIS 15 Vicky - Tarjeta de Invitación Digital

Invitación digital interactiva para los 15 años de Vicky, con funcionalidades de confirmación de asistencia (RSVP → Google Sheets) y subida de fotos (→ Google Drive).

---

## 📁 Estructura del Proyecto

```
Tarjeta15Vicky/
├── index.html           ← Página principal
├── styles.css           ← Estilos (mobile-first, responsive)
├── script.js            ← Lógica de UI + integraciones
├── Codigo.gs            ← Backend Google Apps Script
├── render.yaml          ← Configuración de deploy en Render
├── README.md            ← Este archivo
└── assets/
    ├── images/          ← Imágenes del sitio
    │   └── ...
    └── audio/           ← ★ Colocá tu archivo de música aquí
        └── musica.mp3
```

---

## 🚀 Inicio Rápido (Solo ver la página)

1. Abrí `index.html` con tu navegador (doble click)
2. La página funciona en modo demo sin configurar Google

---

## 🔧 Configuración de Google (Backend)

### Paso 1: Crear Google Sheet

1. Andá a [Google Sheets](https://sheets.google.com) y creá una nueva hoja
2. Copiá el **ID** de la URL: `https://docs.google.com/spreadsheets/d/[ESTE_ID]/edit`
3. (Opcional) Creá una pestaña llamada "Confirmaciones"

### Paso 2: Crear carpeta en Google Drive

1. Andá a [Google Drive](https://drive.google.com)
2. Creá una carpeta nueva (ej: "Fotos 15 Vicky")
3. Copiá el **ID** de la URL: `https://drive.google.com/drive/folders/[ESTE_ID]`

### Paso 3: Crear proyecto en Google Apps Script

1. Andá a [Google Apps Script](https://script.google.com)
2. Hacé click en **"Nuevo Proyecto"**
3. Borrá el código de ejemplo y pegá todo el contenido de `Codigo.gs`
4. Completá las 3 constantes al inicio del archivo:
   ```javascript
   const SPREADSHEET_ID = 'tu_id_del_spreadsheet';
   const SHEET_NAME = 'Confirmaciones';
   const DRIVE_FOLDER_ID = 'tu_id_de_la_carpeta';
   ```
5. Guardá el proyecto (Ctrl+S)

### Paso 4: Verificar configuración

1. En el editor de Apps Script, seleccioná la función `testSetup` del desplegable
2. Hacé click en **"Ejecutar"**
3. Aceptá los permisos cuando te los pida
4. Verificá en el log (Ver > Registros) que todo dice ✓

### Paso 5: Hacer Deploy

1. Hacé click en **"Implementar" > "Nueva implementación"**
2. Tipo: **App web**
3. Ejecutar como: **Yo (tu email)**
4. Quién tiene acceso: **Cualquier persona**
5. Hacé click en **"Implementar"**
6. Copiá la **URL** de la implementación

### Paso 6: Conectar Frontend

1. Abrí `script.js`
2. Buscá esta línea al inicio:
   ```javascript
   APPS_SCRIPT_URL: 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI',
   ```
3. Reemplazá el valor con la URL que copiaste en el Paso 5

---

## 🎵 Agregar Música

1. Creá la carpeta `assets/audio/` si no existe
2. Colocá tu archivo de música como `assets/audio/musica.mp3`
3. El botón de música aparecerá automáticamente al cargar la página

---

## ✏️ Personalización

### Cambiar datos del evento

En `index.html`, buscá y modificá:
- **Nombre**: "Vicky" (buscar y reemplazar)
- **Fecha**: "Domingo 13 de Septiembre, 2026"
- **Hora**: "13:00 hs"
- **Ubicación**: "Jano's Ramos Boutique" / "Castelli 580, Ramos Mejía"
- **Alias**: "cami.fest.xv"
- **Dress Code**: "Evitar lila, celeste y gris"

En `script.js`, modificá:
- `EVENT_DATE`: Fecha del countdown (formato ISO 8601)

### Cambiar imágenes

Reemplazá los archivos en `assets/images/` manteniendo los mismos nombres:
- `hero.png` → Foto principal (portrait, 1066×1600 recomendado)
- `gallery-1.png` a `gallery-6.png` → Fotos de galería (cuadradas)
- `rsvp-bg.png` → Fondo del formulario RSVP

### Cambiar colores

En `styles.css`, modificá las variables CSS:
```css
:root {
  --color-accent-2: #c2a990;  /* Color dorado principal */
  --color-dark: #2e2e2e;      /* Secciones oscuras */
  --color-clarito: #f0ebe7;   /* Fondo claro */
}
```

---

## 🌐 Deploy en Render (recomendado)

Este proyecto es un **sitio estático**: no necesita Node.js, Docker, PHP ni un
servidor backend en Render.

### Opción A: usar `render.yaml` (más simple)

1. Subí todos los archivos del proyecto a un repositorio de GitHub.
2. En Render, elegí **New > Blueprint**.
3. Conectá el repositorio y seleccioná la rama que contiene `render.yaml`.
4. Render va a detectar automáticamente:
   - **Type:** `Web Service`
   - **Runtime:** `Static`
   - **Build Command:** vacío
   - **Publish Directory:** `.`
5. Confirmá la creación y esperá a que termine el deploy.

### Opción B: configurarlo manualmente

1. En Render elegí **New > Static Site** (no elijas Web Service).
2. Conectá el repositorio y seleccioná la rama a publicar.
3. Usá estos valores:
   - **Build Command:** dejalo vacío
   - **Publish Directory:** `.`
4. Hacé click en **Create Static Site**.

La URL pública quedará disponible en el panel de Render. Si modificás el
repositorio, Render volverá a publicar automáticamente la nueva versión.

### Backend de confirmaciones y fotos

Render solo hospeda la página. El formulario RSVP y la subida de fotos usan el
Web App de Google Apps Script configurado en `script.js`, y ese backend debe
seguir desplegado en Apps Script con acceso para cualquier persona. Si cambiás
la URL de ese deploy, actualizá `CONFIG.APPS_SCRIPT_URL` en `script.js`.

## 🌐 Otras opciones de publicación

### Opción 1: GitHub Pages (Gratis)
1. Subí el proyecto a un repositorio de GitHub
2. Settings > Pages > Source: main branch
3. Tu invitación estará en `https://tuusuario.github.io/nombre-repo/`

### Opción 2: Netlify (Gratis)
1. Arrastrá la carpeta del proyecto a [Netlify Drop](https://app.netlify.com/drop)
2. Listo, te da una URL automáticamente

### Opción 3: Vercel (Gratis)
1. Instalá Vercel CLI: `npm i -g vercel`
2. Ejecutá `vercel` en la carpeta del proyecto
3. Seguí las instrucciones

---

## 📱 Compatibilidad

- ✅ Chrome (Android + Desktop)
- ✅ Safari (iOS + macOS)
- ✅ Firefox
- ✅ Edge
- ✅ Samsung Internet

La página es **mobile-first** y está optimizada para celulares.
