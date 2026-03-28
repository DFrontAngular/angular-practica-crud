# FAQ

**Audiencia:** personas participantes
**Última revisión:** 2026-03-27

## Propósito

Este documento recoge dudas frecuentes y bloqueos habituales que pueden aparecer durante la formación.

## ¿Es obligatorio hacer login desde el principio?

No.

El backend permite trabajar con `AUTH_ENABLED=false` para que una persona junior o en reciclaje pueda centrarse primero en CRUD, navegación, formularios e integración básica.

## ¿Por qué existe `AUTH_ENABLED=false`?

Porque la autenticación forma parte del nivel avanzado de la práctica y no debería bloquear el progreso inicial de perfiles con menos experiencia.

## ¿Por qué no hay refresh token?

Porque se consideró fuera del alcance actual de la formación. El objetivo es practicar login, guards, interceptor JWT y control por roles, sin añadir complejidad adicional de gestión de sesión.

## ¿El token expira?

No automáticamente en el estado actual del proyecto.

Se optó por eliminar la expiración para no introducir fricción innecesaria en una práctica que no incluye refresh token.

## ¿`GET /cars` devuelve un array?

No.

Devuelve un objeto paginado con `items` y `meta`.

## ¿`imageUrl` la envía el frontend?

No.

La asigna el backend automáticamente.

## ¿Se pueden hardcodear marcas, modelos o monedas?

No es recomendable.

La práctica está pensada para consumir el contrato real del backend y no para construir una UI con datos inventados.

## ¿Qué hago si algo no coincide con la documentación?

Primero revisa Swagger y los DTOs.

Si sigue existiendo una discrepancia real, debe registrarse una incidencia siguiendo:

- [issues-guide.md](issues-guide.md)

## ¿Se puede usar IA?

Sí.

Su uso está permitido y promovido, especialmente mediante AXET, pero debe utilizarse con criterio profesional y sin sustituir la comprensión técnica del trabajo realizado.

## ¿Qué se valora más, velocidad o calidad?

Ninguno de los dos elementos debería valorarse de forma aislada.

Lo importante es una entrega coherente con el alcance, técnicamente defendible y comprendida por la persona participante.
