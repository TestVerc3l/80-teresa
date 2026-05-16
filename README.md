# 80 Teresa — Invitación

Invitación digital para los 80 años de Teresa (27 de junio de 2026, Salón El Viejo Oliva, Montevideo).

## Deploy en Vercel

Es un sitio 100% estático (HTML + JSX procesado en el navegador con Babel Standalone). No hay build step.

1. Importar el repo en https://vercel.com/new
2. Framework Preset: **Other** (sin build)
3. Root directory: `/` (por defecto)
4. Output directory: dejar vacío
5. Deploy

`index.html` es el entry point. `vercel.json` configura cache + content-type para los `.jsx`.

## Desarrollo local

Abrir `index.html` con un servidor estático (no `file://`, porque Babel hace XHR):

```sh
npx serve .
# o
python3 -m http.server 8080
```
