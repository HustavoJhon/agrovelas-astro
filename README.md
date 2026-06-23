# AGROVELAS

Sistema de gestión ganadera con panel de control, trazabilidad animal, sanidad, reproducción, esquila, contabilidad, alertas, directorio de zootecnistas y mapa IoT.

## Stack

- **Astro** 5 (SSR) · TypeScript
- **Google Sheets** como base de datos
- **Chart.js** · **Leaflet** · **Font Awesome**
- **Vercel** (serverless)

## Variables de entorno

```
GOOGLE_SHEET_ID=tu_id
GOOGLE_CREDENTIALS_JSON=base64_del_json
```

## Comandos

```bash
npm install
npm run dev     # http://localhost:4321
npm run build
npm run preview
```

## Configuración

Ver `CONEXION.md` para la guía completa de conexión con Google Sheets.
