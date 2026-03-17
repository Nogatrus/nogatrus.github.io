# 🎮 GameWiki

Wiki estática para documentar comandos, mecánicas, guías y glosarios de juegos complejos.

## 📁 Estructura de archivos

```
wiki/
├── index.html          ← Página principal
├── games.html          ← Catálogo de juegos
├── commands.html       ← Comandos y atajos por juego
├── mechanics.html      ← Mecánicas y sistemas
├── guides.html         ← Guías y tutoriales
├── glossary.html       ← Glosario de términos
├── assets/
│   ├── style.css       ← Estilos globales (tema retro/CRT)
│   └── main.js         ← Búsqueda, filtros, efectos
└── README.md
```

## 🚀 Hostear en GitHub Pages

1. Sube todos los archivos a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` y la carpeta `/root` (o `/docs` si mueves los archivos ahí).
4. Guarda y espera unos segundos. Tu wiki estará en `https://tuusuario.github.io/tu-repo/`.

## ➕ Añadir contenido

### Nuevo juego
1. Añade una entrada en `games.html` dentro de `#gamesList`.
2. Usa el atributo `data-tags` para que los filtros funcionen (ej: `data-tags="rpg roguelike"`).

### Nuevos comandos
En `commands.html`, duplica un bloque `<section class="cmd-section" data-game="nombre-juego">` y añade filas a la tabla.

### Nueva mecánica
En `mechanics.html`, añade un `<div class="mechanic-block">` dentro de la sección del juego.

### Nueva guía
En `guides.html`, duplica un `<a class="guide-card">` con los atributos `data-game` y `data-level` correctos.

### Nuevo término en el glosario
En `glossary.html`, añade un `<div class="glossary-entry" data-letter="x">` con la letra inicial del término. El índice alfabético se genera automáticamente.

## 🎨 Personalización

- Cambia los colores en `assets/style.css` editando las variables CSS al inicio (`:root { ... }`).
- Para cambiar el nombre de la wiki, busca `GAMEWIKI` en todos los archivos HTML.
- Los efectos CRT (scanlines, viñeta, parpadeo) pueden desactivarse borrando las clases `.scanlines` y `.crt-vignette` del HTML, o los elementos correspondientes en el CSS.
