# NutriScan — Guía de despliegue

## Estructura de archivos

```
nutriscan/
├── index.html       ← App completa (frontend PWA)
├── manifest.json    ← Configuración PWA
├── sw.js            ← Service Worker (offline)
├── api/
│   └── analyze.js   ← Proxy Vercel → OpenAI
├── vercel.json      ← Configuración Vercel
├── package.json     ← Config Node.js
└── .env.example     ← Variables de entorno requeridas
```

## Paso 1 — Backend en Vercel

1. Ve a https://vercel.com y crea una cuenta gratuita.
2. Crea un nuevo proyecto e importa esta carpeta (o súbela a GitHub primero).
3. En **Settings → Environment Variables**, añade:
   - `OPENAI_API_KEY` = tu clave de OpenAI (empieza por `sk-proj-...`)
4. Despliega. Vercel te dará una URL como `https://tu-proyecto.vercel.app`.

## Paso 2 — Actualizar la URL de la API en index.html

Abre `index.html` y busca esta línea cerca del principio del script:

```js
const API_URL = 'https://project-1naex.vercel.app/api/analyze';
```

Cámbiala por la URL real de tu despliegue en Vercel.

## Paso 3 — Frontend en Netlify

1. Ve a https://netlify.com y crea una cuenta gratuita.
2. Arrastra la carpeta `nutriscan/` directamente al panel de Netlify (drag & drop).
3. Netlify desplegará automáticamente el frontend.

## Obtener API key de OpenAI

1. Ve a https://platform.openai.com/api-keys
2. Crea una nueva clave (empieza por `sk-proj-`)
3. Añade crédito de prepago (mínimo 5$). gpt-4o-mini cuesta ~$0.15 por 1M tokens de entrada.
4. Con uso moderado (5-10 análisis/día), 5$ dura varios meses.

## Notas importantes

- Los datos del usuario se guardan SOLO en su dispositivo (localStorage).
- El servidor proxy (Vercel) solo recibe los alimentos para analizar, no datos personales.
- El badge "Gemini Flash" ha sido eliminado de la versión actual.
- Para publicar en Google Play, usa Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap
