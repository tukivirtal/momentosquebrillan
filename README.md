# Momentos que Brillan

Sitio web de **Momentos que Brillan (MB)**, catering para fiestas infantiles en Agraciada (Soriano, Uruguay). Es el proyecto de egreso de Gastronomía de Gabriela Tajes y Leonardo Campot, en UTU Anexo Agraciada (2026).

El sitio tiene dos páginas:

- **`index.html`**: el sitio del catering, pensado para las familias. Incluye qué abarca el servicio, cómo trabajan, la carta por categorías, el Menú Estándar para 40 invitados con un calculador de cantidades, una galería, el equipo con los uniformes y las preguntas frecuentes.
- **`proyecto.html`**: el proyecto de egreso, pensado para la defensa. Incluye el resumen en español e inglés, la fundamentación, el marco teórico, la entrevista, la identidad de marca, el organigrama, el tipo de empresa, el FODA, la inversión, el presupuesto anual con gráficos, los costos, la química aplicada, el etiquetado, las fichas técnicas y la conclusión.

Es un sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación.

## Verlo en la computadora

Abrí `index.html` en el navegador o levantá un servidor local:

```bash
npx serve .
```

## Cargar los datos de contacto

El documento del proyecto no trae teléfono ni redes. Por ahora el sitio muestra solo un correo de ejemplo en el pie de página: `momentosquebrillan@gmail.com`. Antes de publicar el sitio, creen esa cuenta o cámbienla por un correo real; si no, los mensajes se pierden o le llegan a otra persona.

Los datos se editan en `assets/js/config.js`:

```js
window.MB_CONTACTO = {
  whatsapp: "59899123456", // solo números, con código de país
  instagram: "momentosquebrillan", // sin @
  email: "momentosquebrillan@gmail.com"
};
```

Los campos vacíos no se muestran. Lo que se cargue aparece en el bloque "Contacto" del pie de página. Con un WhatsApp cargado aparece además el botón "Consultar por WhatsApp" en el Menú Estándar, que manda la lista de cantidades ya armada.

## Publicarlo con GitHub Pages

1. En GitHub, entrá a **Settings → Pages**.
2. En **Source** elegí **Deploy from a branch**, la rama donde está el sitio (por ejemplo `main`) y la carpeta `/ (root)`.
3. Guardá. En un par de minutos el sitio queda en `https://<usuario>.github.io/momentosquebrillan/`.

Cuando tengas la dirección final, cambiá `og-image.jpg` por la URL completa (por ejemplo `https://…/og-image.jpg`) en las etiquetas `og:image` de las dos páginas. Así la imagen aparece al compartir el link por WhatsApp o en redes.

## Estructura

```
index.html            sitio del catering
proyecto.html         página del proyecto de egreso
assets/css/           main.css (compartido) y proyecto.css
assets/js/            config.js (contacto), main.js (sitio) y proyecto.js (gráficos y tablas)
assets/fonts/         Fraunces y Figtree (licencia OFL, alojadas en el sitio)
assets/img/brand/     logo MB con fondo transparente y badge circular
assets/img/…          fotos en WebP, en varios tamaños
og-image.jpg          imagen para compartir en redes
favicon.ico, icon-*.png, apple-touch-icon.png, site.webmanifest
```

## Imágenes

- **Logo**: es el logo MB del documento, recortado de la página 5 y exportado con fondo transparente. También hay un badge circular, inspirado en el prendedor del uniforme.
- **Fotos**: son ilustrativas. Se generaron con inteligencia artificial (Leonardo AI, modelo Lucid Origin) y el sitio lo aclara en el pie de página.
- **Uniformes**: el logo MB real se compuso digitalmente sobre el delantal, la chomba, el prendedor y la gorra.
- **Caras**: no se generaron caras de Gabriela ni de Leonardo, porque son personas reales. Si tienen fotos propias, se pueden sumar en la sección "Nosotros".

## Diseño

- **Paleta**:
  - El fondo oscuro "noche" (`#231527`) sale del borde de la foto principal.
  - Los colores de la carta (menta, naranja, rosa, uva y limón) salen de los fondos de cada foto de categoría.
  - El dorado se reserva para el logo, las chispas y el precio.
- **Tipografía**: Fraunces, en sus ejes "soft" y "wonk", para los títulos, y Figtree para los textos.
- **Gráficos**: los colores (`#7d4bb5`, `#df5a12`, `#1f9a82`) pasaron el chequeo de separación para daltonismo. Cada gráfico tiene su tabla con los mismos datos.
- **Accesibilidad**:
  - Contraste AA en todos los textos.
  - Navegación por teclado con foco visible.
  - Se respeta "reducir movimiento" (sin chispas ni animaciones).
  - Auditoría con axe-core sin errores.

## Datos para revisar en el documento

- **Etiqueta de los scones**: indica 1128 mg de sodio por porción de 40 g (56 % VD), que es muy alto para ese producto. Conviene confirmar si el valor correcto es 112,8 mg.
- **Fichas técnicas**: algunas cantidades figuran como "0,060 cc" o "0,170 cc". En el sitio se interpretaron como 60 cc y 170 cc.
