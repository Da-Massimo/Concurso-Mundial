# Mundial Massimo — Guia rapida

## Estructura de archivos

```
mundial-massimo/
├── index.html        <- Estructura HTML
├── styles.css        <- Estilos y colores
├── app.js            <- Validacion y logica
├── img/              <- TUS IMAGENES van aqui
│   ├── logo.png              (200 x 80 px)
│   ├── hero-bg.jpg           (420 x 520 px minimo)
│   ├── banner-premio.jpg     (390 x 180 px)
│   └── icon-copa.png         (80 x 80 px)
└── README.md
```

---

## Imagenes a reemplazar

| Archivo | Medidas | Descripcion |
|---|---|---|
| `img/logo.png` | 200 x 80 px | Logotipo del restaurante. Fondo transparente, version blanca/dorada ideal. |
| `img/hero-bg.jpg` | 420 x 520 px min. | Foto de fondo del hero. Se oscurece con overlay automatico. |
| `img/banner-premio.jpg` | 390 x 180 px | Banner del premio o foto del salon. |
| `img/icon-copa.png` | 80 x 80 px | Icono en la pantalla de exito. Copa, trofeo o balón. |

Mientras no pongas la imagen, se muestra un recuadro con el nombre
del archivo y las medidas exactas.

---

## Como activar cada imagen

En `index.html`, busca el placeholder correspondiente y sigue
las instrucciones en los comentarios del HTML:

1. Borra el `<div class="img-placeholder img-placeholder--NOMBRE">`
2. Descomenta el `<img src="img/ARCHIVO">` que esta justo debajo

---

## Logica del formulario

- El **folio** es el numero del ticket de compra (anti-duplicados)
- El **codigo de participacion** se genera automaticamente al registrarse
  con el formato `MM-XXXXXX-XX` (hexadecimal aleatorio)
- En produccion, conecta el `setTimeout` en `app.js` a tu backend
  para guardar los datos y devolver un codigo real del servidor

---

## Colores (en `styles.css`)

```css
--vino : #7d1135
--oro  : #e8af00
```

Cambia estos dos valores para ajustar toda la paleta.

---

## Como abrir

Abre `index.html` en cualquier navegador. No necesita servidor.
