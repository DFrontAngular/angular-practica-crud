# Itinerario de aprendizaje

**Audiencia:** personas participantes
**Última revisión:** 2026-03-27

## Propósito

Este documento define el recorrido recomendado de la práctica y el objetivo de aprendizaje asociado a cada bloque.

Su finalidad es ofrecer una secuencia progresiva de trabajo que ayude a construir la solución con criterio, entender qué competencias se desarrollan en cada fase y orientar el avance de forma coherente con el nivel esperado.

Documentos relacionados:

- [training-guide.md](training-guide.md)
- [submission-guide.md](submission-guide.md)
- [faq.md](faq.md)

## Enfoque general

La práctica está planteada para recorrer los bloques principales de una aplicación Angular conectada a una API real, con una progresión razonable de complejidad.

No todos los perfiles tienen que recorrerla exactamente del mismo modo, pero sí conviene mantener un orden que permita construir sobre una base estable.

## Bloque 0. Preparación del entorno

Objetivo:

- entender la estructura del repositorio
- arrancar backend y frontend
- abrir Swagger
- revisar la forma real de las respuestas

Tareas recomendadas:

1. arrancar backend y frontend
2. visitar `/api-docs`
3. probar `GET /cars`, `GET /brands` y `GET /brands/:brandId/models`
4. decidir si se comenzará con login activado o desactivado

Qué aprenderás aquí:

- cómo leer una API existente
- cómo validar requisitos antes de empezar a implementar

## Bloque 1. Base Angular

Objetivo:

- crear una estructura limpia desde el principio

Tareas recomendadas:

1. definir el routing base
2. crear la página Home
3. crear el layout general
4. organizar carpetas por `core`, `shared` y `features`
5. definir modelos TypeScript para las respuestas del backend

Qué aprenderás aquí:

- arquitectura básica de frontend
- separación entre features y piezas compartidas

## Bloque 2. Tabla de listado

Objetivo:

- mostrar datos reales del backend

Tareas recomendadas:

1. crear `CarsService`
2. conectar `GET /cars`
3. adaptar la tabla a la respuesta paginada
4. mostrar marca, modelo, total y acciones
5. añadir navegación a detalle, edición y creación

Qué aprenderás aquí:

- `HttpClient`
- tipado de respuestas
- renderizado de listas
- estados de carga, vacíos y de error

## Bloque 3. Catálogos y dependencias

Objetivo:

- trabajar con datos dependientes

Tareas recomendadas:

1. crear `BrandsService`
2. consumir `GET /brands`
3. consumir `GET /brands/:brandId/models`
4. recargar modelos al cambiar la marca
5. usar `id` como valor y `name` como etiqueta

Qué aprenderás aquí:

- selects dependientes
- composición de formularios con datos remotos

## Bloque 4. Formularios reactivos

Objetivo:

- crear y editar coches respetando el backend

Tareas recomendadas:

1. crear formulario reactivo de coche
2. usar `FormArray` para `carDetails`
3. añadir validaciones equivalentes a las del backend
4. tratar `manufactureYear` como entero y relacionarlo con `registrationDate`
5. implementar `POST /cars`
6. implementar `PUT /cars/:id`
7. reutilizar el formulario para crear y editar

Qué aprenderás aquí:

- `FormGroup`
- `FormControl`
- `FormArray`
- validación custom
- reutilización de formularios

## Bloque 4.1. Upload de documentos

Objetivo:

- practicar `multipart/form-data` y subida real de archivos desde Angular

Tareas recomendadas:

1. crear un formulario o acción secundaria para adjuntar documento a un coche
2. construir `FormData` con `file` y metadatos opcionales
3. conectar `POST /cars/:id/documents`
4. mostrar errores de tamaño o tipo no permitido
5. presentar la respuesta de metadatos devuelta por el backend

Qué aprenderás aquí:

- `FormData`
- manejo de archivos en Angular
- validación de uploads

## Bloque 5. Detalle y experiencia de usuario

Objetivo:

- trabajar con rutas dinámicas y presentación de datos

Tareas recomendadas:

1. crear detalle `cars/:id`
2. consumir `GET /cars/:id`
3. mostrar estados de kilometraje con un pipe o helper presentacional
4. aplicar `currency` y formateos útiles
5. facilitar la vuelta al listado

Qué aprenderás aquí:

- rutas con parámetros
- composición de vistas
- pipes

## Bloque 6. Eliminación y feedback

Objetivo:

- cerrar el CRUD real

Tareas recomendadas:

1. crear modal de confirmación
2. conectar `DELETE /cars/:id`
3. mostrar notificaciones de éxito y error
4. refrescar el listado sin romper la UX

Qué aprenderás aquí:

- confirmaciones
- side effects de operaciones mutables
- feedback al usuario

## Bloque 7. Manejo de errores y loaders

Objetivo:

- evitar una aplicación frágil

Tareas recomendadas:

1. centralizar errores HTTP
2. normalizar mensajes para el usuario
3. crear loader o overlay
4. decidir si el loader vive por componente o por interceptor

Qué aprenderás aquí:

- interceptors
- manejo global vs local de errores
- diseño de estados de carga

## Bloque 8. Login real

Objetivo:

- integrar autenticación completa

Precondición:

- cambiar `AUTH_ENABLED=true`

Tareas recomendadas:

1. crear pantalla de login
2. llamar a `POST /auth/login`
3. persistir el token
4. crear interceptor para enviar el bearer token
5. consultar `GET /auth/me`
6. reconstruir sesión al recargar la app

Qué aprenderás aquí:

- autenticación real
- persistencia de sesión
- seguridad de frontend

## Bloque 9. Roles y autorización

Objetivo:

- adaptar la interfaz al perfil autenticado

Tareas recomendadas:

1. ocultar botones de editar y eliminar para `USER`
2. dejar visibles esas acciones para `ADMIN`
3. proteger rutas con guards de Angular
4. bloquear navegación no autorizada

Qué aprenderás aquí:

- diferencia entre autenticación y autorización
- guards
- control de permisos en UI

## Bloque 10. Paginación, filtros y ordenación

Objetivo:

- trabajar como en una aplicación profesional

Tareas recomendadas:

1. conectar `page` y `limit`
2. pintar metadatos de paginación
3. añadir filtros por marca, modelo, disponibilidad, año, precio y matrícula
4. añadir ordenación por columnas o controles de sort
5. implementar exportación con `GET /cars/export/excel`
6. sincronizar filtros con la URL si se quiere subir el nivel

Qué aprenderás aquí:

- query params
- tablas con estado
- UX de filtrado

## Bloque 11. Calidad profesional

Objetivo:

- reforzar la calidad y la mantenibilidad del proyecto

Tareas recomendadas:

1. configurar ESLint y Prettier si no está hecho
2. añadir hooks con Husky
3. documentar decisiones de arquitectura
4. escribir tests unitarios y de componentes
5. definir un criterio mínimo de cobertura
6. crear plantilla de Pull Request
7. usar ramas con naming consistente

Qué aprenderás aquí:

- calidad de código
- revisión de cambios
- disciplina de equipo

## Roadmap orientativo por ramas

Si se quiere trabajar como si fuera un proyecto real, una secuencia razonable podría ser:

1. `feat/project-setup`
2. `feat/app-routing-layout`
3. `feat/cars-list`
4. `feat/car-details`
5. `feat/car-form-create`
6. `feat/car-form-edit`
7. `feat/car-delete-modal`
8. `feat/brands-models-integration`
9. `feat/error-handling-and-loader`
10. `feat/auth-login`
11. `feat/auth-interceptor-and-session`
12. `feat/roles-and-route-guards`
13. `feat/pagination-and-filters`
14. `feat/document-upload`
15. `docs/project-documentation`
