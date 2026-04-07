# Guía de formación

**Audiencia:** personas participantes
**Última revisión:** 2026-03-27

## Propósito

Este documento define el marco de referencia recomendado para este proyecto en el contexto de una formación interna.

Su finalidad es proporcionar a las personas participantes y al equipo de mentoring una referencia común sobre alcance, progreso y tiempos estimados de entrega, sin convertir la práctica en un ejercicio condicionado por plazos rígidos.

Documentos relacionados:

- [mentor-guide.md](mentor-guide.md)
- [rubric.md](rubric.md)
- [submission-guide.md](submission-guide.md)
- [support-model.md](support-model.md)
- [ai-and-security-policy.md](ai-and-security-policy.md)
- [learning-path.md](learning-path.md)

Las estimaciones incluidas en este documento son orientativas y no deben interpretarse como un indicador aislado de rendimiento. Su utilidad principal es la siguiente:

- alinear expectativas antes del inicio
- evitar desviaciones de alcance o duraciones excesivas
- detectar bloqueos de forma temprana
- distinguir con claridad entre alcance obligatorio y alcance opcional

## Enfoque

Este repositorio mantiene una finalidad formativa.

En consecuencia, el objetivo no es únicamente completar una aplicación funcional, sino también demostrar un proceso de trabajo coherente y proporcionado al nivel esperado:

- comprender y consumir un contrato de API existente
- estructurar el código Angular con criterios razonables de organización
- implementar formularios, validaciones, routing y flujos CRUD
- integrar autenticación y autorización cuando corresponda
- tomar decisiones de entrega con un criterio equilibrado entre calidad, tiempo y alcance

Los tiempos estimados deben entenderse, por tanto, como ventanas de referencia para una ejecución enfocada y acompasada, no como compromisos cerrados.

## Perfil de entrada recomendado

Esta práctica no está pensada como primer contacto absoluto con el desarrollo frontend.

El punto de partida más adecuado es el de una persona que ya dispone de una base funcional de desarrollo web y quiere consolidar o ampliar su trabajo con Angular en un caso relativamente realista.

Base recomendada:

- HTML: estructura de páginas, formularios y semántica básica
- CSS: maquetación, responsive básico y organización sencilla de estilos
- JavaScript: funciones, arrays, objetos, asincronía básica y consumo de APIs
- TypeScript: tipado básico e interfaces sencillas

## Conocimiento previo de Angular

No es imprescindible llegar con experiencia sólida en Angular para iniciar la práctica.

Sí resulta recomendable haber visto al menos los fundamentos siguientes:

- componentes
- templates
- data binding
- servicios
- routing
- `HttpClient`
- formularios reactivos

Una persona con buena base web pero Angular inicial puede abordar el proyecto si recorre el itinerario de forma progresiva y mantiene el alcance bajo control.

En cambio, si todavía existe inseguridad clara en JavaScript o en la construcción básica de interfaces, conviene reforzar esa base antes de usar este repositorio como práctica principal.

## Implicación sobre la estimación

Las ventanas orientativas de tiempo de este documento parten de una persona que ya cuenta con la base anterior.

Por tanto:

- con base web sólida y Angular básico, las estimaciones son razonables
- con base web sólida pero sin Angular, la práctica sigue siendo viable, aunque la curva de aprendizaje de los primeros bloques puede ampliar el esfuerzo real
- sin base suficiente de JavaScript y maquetación, las estimaciones dejan de ser representativas porque el proyecto pasa a cubrir aprendizaje base y no solo práctica aplicada

## Modelo de seguimiento

Se recomienda trabajar con los siguientes elementos de referencia:

- alcance obligatorio
- alcance opcional
- rango estimado por perfil
- seguimiento por hitos
- umbral de alerta para la detección de bloqueos probables

Este enfoque permite mantener la formación en un marco realista y profesional, sin introducir una presión innecesaria sobre las personas participantes.

## Uso de IA durante la formación

En el contexto de NTT DATA, el uso de herramientas de inteligencia artificial forma parte del entorno habitual de trabajo y se considera compatible con esta formación, siempre que se utilice con criterio profesional.

En este programa se promueve el uso de AXET como herramienta de apoyo, pero no como sustitución del aprendizaje ni de la responsabilidad técnica de la persona participante.

El detalle de criterios, límites de uso y pautas de seguridad queda recogido en:

- [ai-and-security-policy.md](ai-and-security-policy.md)

## Alcance obligatorio

La entrega obligatoria debe cubrir el mínimo producto esperado dentro del itinerario formativo.

Alcance obligatorio recomendado:

- listado de coches integrado con la API real
- paginación, filtros y ordenación
- vista de detalle de coche
- flujo de alta de coche
- flujo de edición de coche
- flujo de borrado de coche
- integración con los catálogos de marcas y modelos
- validación de formularios alineada con las restricciones del backend
- gestión de errores y estados de carga
- estructura básica del proyecto y organización del código

Para los perfiles que trabajen en modo autenticado, el alcance obligatorio puede incluir adicionalmente:

- pantalla de login
- estrategia de almacenamiento del JWT
- interceptor de autenticación
- protección de rutas
- comportamiento de interfaz condicionado por rol cuando resulte aplicable

## Alcance opcional

El alcance opcional debe quedar explícitamente diferenciado para evitar que elementos de valor añadido se interpreten como requisitos mínimos.

Alcance opcional recomendado:

- una UI/UX especialmente cuidada
- abstracciones reutilizables para tablas
- mejoras avanzadas en la experiencia de búsqueda
- flujo de subida de ficheros
- flujo de exportación
- tests adicionales
- mejoras de accesibilidad
- pulido responsive más allá del layout base
- refactors orientados a mantenibilidad una vez cerrados los flujos principales

## Ventanas orientativas de dedicación por perfil

Estas ventanas solo resultan razonables si el alcance permanece controlado y existe soporte de mentoring cuando surgen bloqueos.

Deben comunicarse como referencias amplias y no como compromisos de entrega cerrados.

Como referencia, una jornada debe entenderse como una jornada laboral habitual, incluyendo pausas, tiempo de análisis, pruebas, correcciones y bloqueos razonables. No debe interpretarse como ocho horas netas de implementación continua.

Además, cuando la práctica se compagina con onboarding, sesiones formativas, reuniones, soporte o curva de aprendizaje, la duración real puede extenderse sin que eso implique un mal desempeño.

### Perfil junior

Foco recomendado:

- CRUD base
- integración con la API
- routing
- formularios reactivos
- validación en frontend
- gestión básica de errores

Ventana orientativa:

- `3-5` semanas de dedicación habitual para una entrega obligatoria sólida utilizando el modo bypass de autenticación
- como referencia aproximada, esto suele equivaler a `15-25` jornadas, pero conviene comunicar antes la horquilla en semanas que en días

Si para un perfil junior se requiere también autenticación real, la ventana debería ampliarse de forma explícita en lugar de mantener la misma expectativa temporal.

### Perfil intermedio

Foco recomendado:

- entrega completa del alcance obligatorio
- arquitectura más ordenada
- mejor disciplina en el manejo de estado
- comportamiento UX consistente

Ventana orientativa:

- `2-4` semanas de dedicación habitual para el alcance obligatorio
- `3-5` semanas si desde el inicio se incluye login y comportamiento condicionado por roles
- como referencia aproximada, esto suele equivaler a `10-18` y `14-22` jornadas respectivamente

### Perfil avanzado

Foco recomendado:

- entrega obligatoria con mayor calidad de implementación
- flujo real de autenticación
- guards, interceptor y awareness de roles
- mejor resolución de casos borde
- pulido técnico moderado

Ventana orientativa:

- `2-3` semanas de dedicación habitual para el alcance obligatorio incluyendo login
- `2.5-4` semanas si también se espera una capa adicional de pulido opcional
- como referencia aproximada, esto suele equivaler a `8-14` y `10-16` jornadas respectivamente

## Hitos recomendados

El seguimiento por hitos suele aportar más valor que la medición exclusiva del tiempo total invertido.

Hitos sugeridos:

1. Preparación del proyecto y comprensión de la API
2. Listado, detalle y navegación básica operativos
3. Flujos de alta y edición conectados con la validación del backend
4. Flujo de borrado y manejo de errores estabilizados
5. Filtros, ordenación y paginación completados
6. Autenticación y autorización integradas cuando corresponda
7. Revisión final, limpieza y mejoras opcionales

## Umbrales de alerta

El objetivo de un umbral de alerta es facilitar acompañamiento y detección temprana de riesgo, no introducir presión adicional.

Regla recomendada:

- si una persona supera aproximadamente un `25-35%` de la ventana prevista sin haber cerrado el hito correspondiente, conviene revisar la situación con ella

Motivos habituales:

- el alcance no se ha interpretado correctamente
- existe un bloqueo técnico
- se está dedicando demasiado tiempo a elementos de pulido en una fase temprana
- existe inseguridad que deriva en sobreingeniería o reescrituras frecuentes

## Criterio de mentoring recomendado

Para mantener una exigencia razonable y, al mismo tiempo, preservar el valor pedagógico de la práctica, se recomienda que el acompañamiento siga criterios homogéneos y explícitos.

El detalle operativo de ese acompañamiento queda recogido en:

- [mentor-guide.md](mentor-guide.md)

## Texto recomendado para comunicar a las personas participantes

Puede utilizarse una formulación como la siguiente en el briefing de la formación:

> Este proyecto incluye ventanas orientativas de dedicación por perfil con el fin de mantener la práctica dentro de un marco realista y evitar desviaciones innecesarias de tiempo o alcance. Estas ventanas no constituyen deadlines estrictos y no se utilizarán de forma aislada para evaluar el rendimiento. Su objetivo es facilitar la planificación, detectar bloqueos con antelación y mantener un esfuerzo proporcionado al alcance previsto. Si la práctica se compagina con formación, soporte o curva de aprendizaje, es normal que la duración real pueda ampliarse.

## Recomendación para este repositorio

Para este proyecto en concreto, se considera equilibrado el siguiente enfoque:

- perfiles junior: comenzar con `AUTH_ENABLED=false`
- perfiles intermedios: completar el CRUD con una integración limpia y consistente
- perfiles avanzados: trabajar con `AUTH_ENABLED=true` e incluir login, refresh de sesión, guards y awareness de roles

El nivel de refresh implementado en este repositorio sí se considera asumible dentro del alcance, porque forma parte del flujo real de sesión que el frontend debe aprender a integrar. No se espera, en cambio, una solución de identidad corporativa completa ni una persistencia distribuida de sesiones.
