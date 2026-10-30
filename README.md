# La Expedición Pitágoras · L’Expédition Pythagore

**Jugar / Jouer :** https://agomezbl.github.io/expedicion-pitagoras/

Juego de aventura para dominar el teorema de Pitágoras (12-14 años, 4e del collège en Francia / 2.º-3.º de ESO en España),
en **francés y español**: diez cámaras, un Guardián de piedra y escenas con los sabios que descubrieron el secreto
(Teano, Pitágoras, Tales, Hipaso, Sócrates, Platón, Aristóteles, Euclides, Hiparco, Descartes, Hipatia…), con dilemas filosóficos.

**Versión 2.0 beta**. Historial en [CHANGELOG.md](CHANGELOG.md).
Sin cuentas, sin publicidad y sin peticiones a servidores externos: el progreso se guarda solo en el aparato
(con código de copia de seguridad para pasarlo a otro). Se integra en la Estación Nil (misma web, misma clave de guardado).

© 2026 agomezbl. Todos los derechos reservados. Tipografías con licencia SIL OFL 1.1 (carpeta `licenses/`).
Voces grabadas con Kokoro (modelo abierto, Apache 2.0).

---

## Temario
| Cámara | Contenido |
|---|---|
| I · Cuadrados | descubrir a² + b² = c² con baldosas, laboratorio de ternas |
| II · Puentes | calcular la hipotenusa (contrarreloj) |
| III · Pozo | calcular un cateto |
| IV · Fuente de las Raíces | cuadrados perfectos, encajar √n entre enteros, √(a+b) ≠ √a + √b, irracionales, √2 |
| V · Pergaminos | problemas con datos trampa y unidades mezcladas |
| VI · Tribunal | recíproco y contrarrecíproco, vértice del ángulo recto, redacción de demostraciones |
| VII · Observatorio | coseno: lados, valor, lado contiguo, hipotenusa, ángulo con cos⁻¹ |
| VIII · Cripta | distancia en ejes, mapas a escala, diagonal de ortoedro y cubo, triángulo inscrito (Tales) |
| IX · Cámara Sellada | escape room con cerraduras de todos los temas |
| X · Guardián | jefe final con todo |

Además: desafío del día, entrenamiento por temas, supervivencia, modo examen (nota sobre 20 en francés, sobre 10 en español),
Códice de los Sabios (17 fragmentos, dilemas y escenas), expediciones reales con cinta métrica, panel del guía para padres.

## Código
- `src/js/*.js` — el juego, en orden (se concatenan al construir). Textos con `t('francés','español')` y `tf(fr,es)`.
  `09_new.js` temario nuevo · `16_cast.js` retratos y fondos · `17_talk.js` escenas y dilemas · `15_codex.js` sabios.
- `src/style.css`, `src/body.html`; `src/fonts.css` se genera con `tools/fonts.py`.
- `tools/build.py` → `dist/index.html` (web), `dist/test.html` (pruebas), `dist/pitagoras.artifact.html`.
- Pruebas: `node tools/test-gen.js` (generadores) y `node tools/test-all.js fr-pc|es-pc|fr-movil|es-movil` (partida completa).
- Voces: `node tools/voces-lista.js` y después `python3 tools/voces.py` (solo graba las frases que faltan) → `audio/`.

## Publicar
```
python3 tools/build.py && cp dist/index.html index.html
```
y subir `index.html` + `audio/` a la rama principal (GitHub Pages sirve la raíz).
