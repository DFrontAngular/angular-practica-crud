# Flujo de autenticacion y sesion

**Audiencia:** personas participantes
**Ultima revision:** 2026-04-07

## Proposito

Este documento explica como funciona la autenticacion del proyecto y que se espera del frontend al integrarse con ella.

No pretende dar una solucion cerrada de Angular, pero si dejar claro el modelo tecnico que debe respetarse.

## Idea clave

Este proyecto no usa un login de juguete basado en guardar un token manualmente en `localStorage` y enviarlo como `Authorization: Bearer ...` en cada peticion.

El flujo implementado es mas cercano a una aplicacion web real:

- `access token` corto en cookie `HttpOnly`
- `refresh token` mas largo en cookie `HttpOnly`
- renovacion de sesion mediante `POST /auth/refresh`
- logout real mediante `POST /auth/logout`

## Duracion de la sesion

- `access token`: `15m`
- `refresh token`: `7d`

Consecuencia practica:

- mientras el `access token` sea valido, las peticiones autenticadas funcionan con normalidad
- cuando el `access token` caduca, el frontend debe recuperar sesion usando `POST /auth/refresh`
- si el `refresh token` tambien ha caducado o ya no es valido, la sesion debe considerarse cerrada y la app debe llevar al usuario al login

## Cookies que emite el backend

Tras un login correcto, el backend emite:

- `access_token`: cookie `HttpOnly`, vida corta, usada para acceder a endpoints protegidos
- `refresh_token`: cookie `HttpOnly`, vida mas larga, usada para renovar la sesion

El frontend no debe leer estas cookies desde JavaScript ni persistir sus valores manualmente.

## Endpoints implicados

### `POST /auth/login`

- valida email y password
- emite `access_token` y `refresh_token`
- devuelve el perfil de usuario autenticado

### `GET /auth/me`

- devuelve el usuario autenticado asociado al `access_token`
- sirve para reconstruir el estado de sesion en la aplicacion

### `POST /auth/refresh`

- usa el `refresh_token` actual
- emite un nuevo `access_token`
- rota el `refresh_token`

Esto significa que un refresh token ya utilizado deja de ser valido.

### `POST /auth/logout`

- limpia ambas cookies
- invalida la sesion de refresh activa

## Flujo esperado desde frontend

Un comportamiento razonable seria:

1. enviar credenciales a `POST /auth/login`
2. tratar el login como correcto si el backend responde `200`
3. consultar `GET /auth/me` para obtener el perfil y construir el estado autenticado
4. consumir endpoints protegidos sin almacenar tokens manualmente
5. si una peticion autenticada devuelve `401` por expiracion del `access token`, llamar a `POST /auth/refresh`
6. si el refresh funciona, reintentar una vez la peticion original
7. si el refresh falla, limpiar estado cliente y redirigir al login

## Integracion en desarrollo

Este repositorio no abre CORS de forma permisiva para `localhost` por comodidad.

La integracion esperada en desarrollo es mediante proxy del frontend.

La idea es que el navegador trabaje como si frontend y backend fueran el mismo origen aparente durante el desarrollo, en lugar de construir una integracion artificial basada en abrir CORS y mover tokens manualmente.

## Lo que no deberia hacer el frontend

- guardar tokens en `localStorage`
- guardar tokens en `sessionStorage`
- leer cookies de sesion desde JavaScript
- enviar `Authorization: Bearer ...` como flujo principal de la practica
- asumir que la sesion dura indefinidamente

## Lo que si deberia aprender el frontend

- construir estado autenticado a partir de `GET /auth/me`
- reaccionar correctamente a `401` y `403`
- distinguir autenticacion de autorizacion
- renovar sesion con `POST /auth/refresh`
- cerrar sesion de forma limpia con `POST /auth/logout`

## Nota de realismo

El backend sigue siendo una practica formativa, no un sistema corporativo completo.

Por ejemplo, la revocacion de refresh tokens vive en memoria y no en una persistencia compartida. Aun asi, el modelo de sesion que expone es mucho mas cercano al que una SPA web moderna encuentra en proyectos reales que un ejemplo basado solo en bearer tokens manuales.
