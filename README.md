# English Challenge – Unit 4

Examen original para Pedro, estudiante argentino de 4.º año de secundaria.

## Cómo probarlo

1. Abrí esta carpeta y hacé doble clic en **index.html**. Se abre en tu navegador (Chrome, Edge o Firefox).
2. Respondé las preguntas. El indicador muestra cuántas completaste; podés cambiar cualquier respuesta.
3. Presioná **Finalizar examen**. Si faltan respuestas, la advertencia muestra cuántas: **Volver a responder** te lleva a la primera pendiente, conservando lo que respondiste; **Finalizar igualmente** entrega el examen contando las pendientes como incorrectas. También podés cerrar la advertencia con Escape para seguir respondiendo. Al finalizar aparecen la nota sobre 100, los aciertos, los errores y el porcentaje de aciertos por tema.
4. Bajá a la revisión para ver tus respuestas, las correctas y las explicaciones en español.
5. Usá **Descargar informe para mamá** para guardar un PDF A4 con el resumen y el detalle de errores, incluidas las preguntas sin responder. El informe contiene la respuesta elegida, la correcta y su explicación; agrega el texto de lectura cuando corresponde. Si no hay errores, lo indica. Abrí el PDF descargado para imprimirlo. Se genera localmente, no se envía a nadie y no necesita internet.
6. Presioná **Volver a intentarlo** para comenzar desde cero.

Funciona sin instalación, conexión a internet, cuentas ni servicios externos. Mantené index.html, styles.css, questions.js, report.js y app.js juntos en esta carpeta. Usá una versión actual de Chrome, Edge o Firefox. En computadora podés probar el diseño de celular achicando la ventana. Para usarlo directamente en un teléfono, copiá esos cinco archivos juntos y abrí index.html en un navegador que permita archivos locales; algunos sistemas restringen esa apertura. En algunos teléfonos el PDF se abre en un visor desde el cual podés guardarlo o compartirlo. Para publicar mediante un enlace, seguí [PUBLICAR.md](PUBLICAR.md); no se ha publicado nada todavía.

## Contenido y corrección

- Past Perfect: 10 preguntas.
- Relative Pronouns: 8 preguntas.
- Vocabulary: 7 preguntas.
- Reading: 5 preguntas sobre dos textos originales.

Cada pregunta tiene una única opción correcta. No se muestran soluciones en la interfaz hasta finalizar. Es una práctica local: la clave está en el código JavaScript, no es un sistema de examen protegido contra inspección del código.

Todas valen lo mismo: nota = aciertos / 30 × 100, redondeada al entero más cercano. Los porcentajes por tema se redondean igual. Las respuestas en blanco cuentan como incorrectas y se informan también por separado. No hay penalización adicional. Los intentos no se guardan: recargar o cerrar la página borra el progreso.

El contenido se centra en dificultades habituales de los temas solicitados; no atribuye errores personales a Pedro ni se basa en imágenes de una prueba no proporcionada.

## Verificación técnica

Con Node.js instalado, ejecutá:

```
node test.js
node test-ui.js
node test-report.js
```

Comprueban las notas de 0 a 30 aciertos, porcentajes por tema, recorrido de la interfaz con un DOM simulado, confirmación de pendientes, descarga y estructura PDF para intentos perfecto, en blanco y mixto. El último test verifica mediante SHA-256 que questions.js siga intacto y escribe ejemplos de prueba en tmp/pdfs/ (no publicar). Las pruebas de DOM no sustituyen una inspección visual en navegador.
