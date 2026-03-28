# Guía del mentor

**Audiencia:** equipo mentor
**Última revisión:** 2026-03-27

## Propósito

Este documento está orientado a las personas que faciliten, supervisen o acompañen esta formación.

Su objetivo es ofrecer un marco homogéneo para el seguimiento de las personas participantes, la detección de bloqueos y la toma de decisiones durante el recorrido del proyecto, reduciendo la dependencia del criterio individual de cada mentor o mentora.

Documentos relacionados:

- [training-guide.md](training-guide.md)
- [rubric.md](rubric.md)
- [submission-guide.md](submission-guide.md)
- [support-model.md](support-model.md)
- [ai-and-security-policy.md](ai-and-security-policy.md)

## Objetivo general de la formación

La finalidad del proyecto no es únicamente completar una aplicación funcional, sino desarrollar competencias de trabajo cercanas a un contexto real:

- comprender un contrato de API existente
- construir una aplicación Angular con estructura razonable
- integrar CRUD, validaciones, navegación y estados de UI
- trabajar con autenticación y autorización cuando proceda
- tomar decisiones técnicas con criterio
- comunicar problemas, dudas y hallazgos de forma profesional

## Principios de acompañamiento

Se recomienda que la labor de mentoring se base en los siguientes principios:

- acompañar sin resolver de forma prematura
- favorecer la comprensión antes que la simple entrega
- intervenir cuando exista bloqueo real, no ante cada dificultad normal del aprendizaje
- valorar la progresión, no solo la velocidad
- mantener consistencia entre personas participantes y entre distintas ediciones de la formación

## Qué se espera de una entrega correcta

Una entrega puede considerarse bien encaminada cuando:

- respeta el contrato real del backend
- resuelve el alcance obligatorio con coherencia
- presenta una estructura de frontend defendible
- incorpora validaciones y manejo de errores razonables
- permite explicar las decisiones adoptadas
- mantiene una calidad mínima de legibilidad y orden

## Señales de buen avance

Indicadores positivos:

- la persona participante consulta Swagger y DTOs antes de implementar
- detecta y corrige discrepancias entre frontend y backend
- pide ayuda con preguntas concretas
- sabe distinguir entre bloqueo técnico y mejora opcional
- explica por qué ha tomado determinadas decisiones

## Señales de bloqueo o riesgo

Indicadores de que conviene intervenir:

- varios días sin cerrar un hito básico
- reescrituras repetidas sin progreso claro
- dependencia excesiva de prueba y error sin análisis
- uso de IA sin comprensión de lo generado
- implementación muy alejada del contrato de backend
- exceso de tiempo invertido en pulido visual antes de cerrar la funcionalidad base

## Cómo intervenir

Cuando exista bloqueo, se recomienda intervenir en niveles progresivos:

1. pedir a la persona que describa el problema con precisión
2. confirmar si ha revisado Swagger, DTOs y documentación base
3. acotar el problema a una decisión o funcionalidad concreta
4. ofrecer una pista o criterio, no directamente la solución completa
5. si el bloqueo persiste, ayudar a dividir el problema en pasos más pequeños

## Qué no debería hacer el mentor o mentora

- resolver la práctica por la persona participante
- introducir cambios directamente en su código salvo casos muy excepcionales
- evaluar únicamente por velocidad
- asumir que una entrega funcional implica comprensión real
- penalizar el uso de IA si existe criterio y comprensión

## Uso de IA en el acompañamiento

El uso de IA está permitido y promovido en esta formación.

Desde la perspectiva de mentoring, lo relevante es verificar que existe comprensión de lo implementado, que las decisiones adoptadas pueden justificarse y que la IA se ha utilizado como apoyo y no como sustitución del aprendizaje.

El detalle de criterios y pautas de seguridad queda recogido en:

- [ai-and-security-policy.md](ai-and-security-policy.md)

## Gestión de incidencias

Si se detecta un defecto real en el repositorio base, conviene registrarlo siguiendo la guía de incidencias:

- [issues-guide.md](issues-guide.md)

El objetivo es evitar que problemas estructurales del material se confundan con errores propios de implementación de las personas participantes.

## Solución de referencia

Si la formación dispone de una solución de referencia, se recomienda gestionarla fuera de este repositorio y mantenerla en un espacio privado accesible solo para mentores o personas responsables de la formación.

El criterio detallado queda recogido en:

- [reference-solution-policy.md](reference-solution-policy.md)

## Revisión final

Antes de cerrar una entrega, se recomienda revisar:

- funcionamiento general
- alineación con el alcance obligatorio
- comprensión técnica mostrada por la persona participante
- claridad del código
- calidad mínima de la experiencia de usuario
- nivel de autonomía demostrado durante el proceso
