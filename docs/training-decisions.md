# Decisiones del programa formativo

**Audiencia:** responsables del programa y equipo mentor
**Última revisión:** 2026-03-27

## Propósito

Este documento recoge decisiones relevantes del diseño de la formación y el motivo por el que se han tomado.

Su objetivo es facilitar la continuidad del programa en futuras ediciones y ayudar a que nuevas personas formadoras comprendan el criterio pedagógico y técnico aplicado.

## Decisión 1. Mantener backend y frontend en el mismo repositorio

Se adopta esta estructura para facilitar la experiencia de onboarding, la trazabilidad del proyecto y la comprensión del contrato entre frontend y backend.

## Decisión 2. Utilizar un backend funcional ya construido

El objetivo principal de la práctica está en Angular y en la integración con una API realista. Disponer de un backend ya preparado permite centrar el esfuerzo en consumo de API, arquitectura frontend, validaciones, autenticación y experiencia de usuario.

## Decisión 3. Mantener datos en memoria

No se incluye base de datos para evitar desviar la formación hacia infraestructura y persistencia. Se prioriza la práctica de integración y lógica de aplicación.

## Decisión 4. Permitir bypass de autenticación

Se incluye `AUTH_ENABLED=false` para que perfiles junior o en reciclaje puedan avanzar en el alcance base sin quedar bloqueados por el login desde el inicio.

## Decisión 5. Incluir login real como parte avanzada

La autenticación se mantiene como bloque de valor para perfiles con más experiencia o para fases posteriores de la formación.

## Decisión 6. No incluir refresh token

Se considera que refresh token y gestión avanzada de sesión introducen una complejidad que no aporta suficiente valor al objetivo actual de la práctica.

## Decisión 7. No hacer expirar automáticamente el access token

Dado que no existe refresh token, se opta por no introducir expiración automática del token para evitar fricción innecesaria y mantener el foco en login, guards, interceptor JWT y roles.

## Decisión 8. Mantener CORS sin configuración permisiva artificial

Se evita una configuración de desarrollo excesivamente abierta para fomentar una integración más cercana a un entorno real y obligar a tomar decisiones conscientes de integración.

## Decisión 9. Promover el uso responsable de IA

En línea con el contexto corporativo de NTT DATA, se promueve el uso de AXET y otras herramientas de IA como apoyo al trabajo.

No obstante, se establece que la IA debe actuar como acelerador y no como sustitución del aprendizaje ni de la responsabilidad técnica.

## Decisión 10. Tratar la detección de bugs como parte del aprendizaje

Se considera que identificar, describir y reportar incidencias es también una competencia profesional relevante. Por ello, el repositorio incorpora un flujo explícito de reporte de incidencias.
