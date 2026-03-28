# Guía de incidencias

**Audiencia:** personas participantes
**Última revisión:** 2026-03-27

## Propósito

Este documento define el criterio recomendado para registrar incidencias detectadas durante la formación o durante el uso del proyecto.

Aunque el repositorio haya sido revisado previamente, debe asumirse que pueden aparecer defectos, comportamientos no esperados, inconsistencias en la documentación o desviaciones respecto al contrato previsto. Reportar este tipo de hallazgos forma parte de una práctica profesional correcta.

Documentos relacionados:

- [support-model.md](support-model.md)
- [faq.md](faq.md)

## Cuándo abrir una incidencia

Se recomienda abrir una incidencia cuando exista alguno de estos supuestos:

- comportamiento incorrecto en frontend o backend
- error reproducible en una funcionalidad documentada
- inconsistencia entre comportamiento real y contrato esperado
- problema en validaciones, permisos o respuestas de API
- documentación errónea o claramente desalineada con la implementación

## Cuándo no abrir una incidencia

No debería abrirse una incidencia para:

- dudas funcionales que puedan resolverse revisando Swagger
- dudas sobre DTOs o documentación ya disponible
- consultas de enfoque técnico que no describan un fallo real
- problemas derivados de una implementación incompleta de la persona participante sin evidencia de defecto en el repositorio base

Para dudas, bloqueos o consultas operativas, conviene revisar:

- [support-model.md](support-model.md)

## Criterio de calidad del reporte

Siempre que sea posible, la incidencia debería permitir que otra persona pueda entender el problema y reproducirlo sin necesidad de varios intercambios adicionales.

Por ello, se recomienda incluir como mínimo:

- contexto del problema
- pasos para reproducirlo
- resultado actual
- resultado esperado
- impacto observado
- evidencias cuando estén disponibles

## Uso del template

Las incidencias deben registrarse utilizando el template de bug disponible en el repositorio:

- [.github/ISSUE_TEMPLATE/bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md)

Ese template está pensado para facilitar reportes homogéneos y agilizar su análisis posterior.

## Recomendación operativa

Como pauta general:

- cuanto más concreta y reproducible sea la incidencia, más ágil será su gestión
- si el problema bloquea el avance, conviene indicarlo expresamente en el reporte
- si existen capturas, logs o respuestas HTTP relevantes, deben adjuntarse

## Valor formativo

Detectar y reportar una incidencia no debe interpretarse como una desviación del trabajo principal, sino como parte del propio aprendizaje.

En un contexto profesional, identificar un problema, describirlo correctamente y facilitar su análisis es también una competencia relevante.
