/* =========================================================
   RevelArte — Catálogo de "Nuestra Tienda"
   ---------------------------------------------------------
   Este es el ÚNICO archivo que hay que editar para cambiar
   la temporada o los productos de la tienda.

   Cómo actualizarlo:
   1. Guarda las fotos en la carpeta  assets/tienda/
      (formato .jpg, idealmente cuadradas y de máximo 1200 px).
   2. Cambia "temporada" por el nombre de la colección actual
      (ej.: 'Temporada de Gorras', 'Temporada de Camisetas').
   3. Agrega una línea por producto en "productos":
        { nombre: 'Gorra Fe', foto: 'assets/tienda/gorra-fe.jpg', detalle: 'Bordada · Talla única' },
      - nombre:  aparece bajo la foto y en el mensaje de WhatsApp.
      - foto:    ruta de la imagen.
      - detalle: (opcional) texto corto, por ejemplo material o precio.
   4. Si la lista queda vacía, la web muestra "Muy pronto".

   Cada producto tiene un botón que abre WhatsApp con el mensaje
   "Hola, me interesa <nombre> de la <temporada>".
   ========================================================= */
window.TIENDA = {
  temporada: 'Temporada de Gorras',
  productos: [
    // { nombre: 'Gorra Fe', foto: 'assets/tienda/gorra-fe.jpg', detalle: 'Bordada · Talla única' },
  ]
};
