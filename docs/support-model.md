# Modelo de soporte

**Audiencia:** personas participantes
**Última revisión:** 2026-10-02

## Propósito

Este documento define el marco recomendado de soporte durante la formación.

Su objetivo es distinguir con claridad qué tipo de ayuda debe solicitarse, por qué canal y en qué situaciones conviene escalar un problema.

Documentos relacionados:

- [faq.md](faq.md)
- [issues-guide.md](issues-guide.md)

## Tipos de necesidad

Como criterio general, conviene distinguir entre:

- duda funcional o técnica
- bloqueo de implementación
- incidencia real en el repositorio o en la documentación
- problema de entorno o configuración

## Canal recomendado según el caso

El canal operativo de referencia es el sistema de Issues del repositorio, usando la plantilla de incidencia cuando el problema sea reproducible. Para dudas o bloqueos que puedan contener información privada, utiliza el canal interno de mentoring definido por el responsable de la formación; no publiques credenciales, cookies, tokens ni datos personales en una issue.

Responsables:

- dudas y bloqueos: mentor o mentora de guardia
- defectos del backend o de la documentación: mantenedor o mantenedora del repositorio
- problemas de instalación que afecten a varias personas: mentoría, con escalado al mantenimiento si procede

Tiempo esperado de respuesta durante una edición activa: acuse en un día laborable y primera orientación en un máximo de dos días laborables. Si no existe una edición activa, la issue queda sujeta a disponibilidad del mantenimiento y debe marcarse como `question` o `bug`.

### Duda funcional o técnica

Se recomienda:

- revisar primero Swagger, DTOs y documentación disponible
- consultar FAQ si la duda es recurrente
- escalar al equipo mentor si la duda persiste

### Bloqueo de implementación

Se recomienda:

- acotar el problema
- documentar qué se ha intentado
- plantear la duda al equipo mentor con contexto suficiente

### Incidencia real

Si se detecta un defecto del repositorio base o una inconsistencia clara, debe registrarse siguiendo:

- [issues-guide.md](issues-guide.md)

### Problema de entorno

Si afecta a instalación, ejecución, dependencias o configuración local, conviene reportarlo indicando:

- sistema o entorno afectado
- comandos ejecutados
- error observado
- pasos ya intentados

## Formato mínimo de contacto

Incluye siempre:

- resumen en una frase
- objetivo y resultado observado
- pasos exactos para reproducirlo
- endpoint o pantalla afectada
- sistema operativo, versión de Node.js y navegador
- mensaje de error y, si aplica, respuesta HTTP sin credenciales
- qué documentación, Swagger o pruebas ya has revisado

Usa títulos descriptivos, por ejemplo: `POST /cars/:id/document devuelve 415 con un PDF`. No adjuntes `.env`, tokens, cookies ni archivos con datos personales.

## Criterio de escalado

Conviene escalar cuando:

- el problema impide avanzar
- existe duda persistente tras revisar documentación base
- se sospecha que hay un bug real en el material
- el alcance o la consigna no resulta suficientemente clara

## Lo que debería evitarse

No es recomendable:

- lanzar dudas sin contexto técnico mínimo
- escalar como bug algo que todavía no se ha contrastado con la documentación
- esperar demasiado tiempo antes de comunicar un bloqueo real

## Objetivo del soporte

El soporte no debe sustituir el trabajo de análisis de la persona participante, sino facilitar que el aprendizaje continúe cuando exista una dificultad real o una incidencia estructural del material.
