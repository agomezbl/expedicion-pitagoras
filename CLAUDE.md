# La Expedición Pitágoras — ficha para Claude

Aventura para dominar Pitágoras (4e / 2.º-3.º ESO), FR/ES, 10 cámaras con escenas de sabios y dilemas.
Versión **2.1 beta** (instalable, funciona sin conexión). En Curionauta: `/juegos/pitagoras/` (clave `expedicion-pitagoras-v1`: no cambiarla sin migración).

## Construir, probar y publicar
- Código: `src/js/*.js` (concatenados en orden). Textos con `t('fr','es')` / `tf(fr,es)`.
- `python3 tools/build.py` → `dist/index.html`; pruebas `node tools/test-gen.js` y `node tools/test-all.js fr-pc|es-pc|fr-movil|es-movil`.
- Publicar: `cp dist/index.html index.html` y subir `index.html` + `audio/` a `main`.
- Voces: `node tools/voces-lista.js && python3 tools/voces.py` (solo las que faltan).

## Ideas siguientes
El motor de cámaras puede servir para «Tales y trigonometría» (3e).

## Cómo trabajar con Alejandro
- Escribe en **español**, para alguien que **no programa**: pasos numerados, sin jerga, y di qué botón pulsar.
- Pregunta antes de construir algo grande o caro de rehacer; lo pequeño, hazlo directamente.
- Nivel de producto profesional: probar en navegador real (PC y móvil) antes de dar algo por terminado.
- Idiomas: **francés y español** como mínimo (público: Francia y España); inglés más adelante.
- Diseño para niños: sin ansiedad, sin perseguir al niño, sin publicidad ni rastreadores.
- Los repositorios son **públicos**: nada de datos personales de la familia ni del niño.
- **Nunca** guardes ni pidas claves secretas en el chat o en el repositorio (ElevenLabs, Gemini, `service_role` de Supabase).
  Las claves van como secretos de GitHub Actions. La clave `sb_publishable_…` de Supabase sí es pública.
- Commits: `git -c user.name="agomezbl" -c user.email="agomezbl@users.noreply.github.com" commit …`.
- Después de publicar un cambio aquí, la web **curionauta** no se actualiza sola: hay que subir un commit
  (aunque sea vacío) a `agomezbl/curionauta` para que Cloudflare vuelva a montarla.
