# Proyecto CRUD Angular & Nest.js

Este proyecto está dividido en dos partes principales:

1. **Backend**: Implementado con Nest.js.
2. **Frontend**: Implementado con Angular.

## Requisitos previos

Asegúrate de tener instalados los siguientes programas en tu sistema:

- [Visual Studio Code](https://code.visualstudio.com/).
- [Node.js](https://nodejs.org) (versión 18 o superior recomendada).
- [npm](https://www.npmjs.com/) (incluido con Node.js).
- [Angular CLI](https://angular.dev/tools/cli) (para ejecutar el frontend).

```bash
npm install -g @angular/cli
```

## Pasos para levantar el proyecto

### 1. Levantar el Backend (Nest.js)

Navega a la carpeta del backend:

```bash
cd backend
npm i
npm run start:dev
```

### 2. Levantar el Frontend (Angular)

Navega a la carpeta del frontend:

```bash
cd frontend
npm i
ng serve
```

### 2. Acceso al proyecto

Una vez ambos servicios estén levantados, puedes acceder al proyecto desde tu navegador.

1. **Frontend:** http://localhost:4200
2. **Backend:** http://localhost:3000
3. **Backend SWAGGER:** http://localhost:3000/api-docs/

---

### TAREA: CRUD utilizando **Nest.js** como backend en Angular

#### Objetivo:

Desarrollar una aplicación web utilizando **Angular** con funcionalidades CRUD (Crear, Leer, Actualizar, Eliminar) usando **Nest.js** como backend.

#### Requerimientos del Proyecto:

1. **Configuración del entorno de desarrollo**:

   - Configurar **Prettier** para formateo automático del código.
   - Configurar **ESLint** para análisis estático de código.
   - Configurar **Karma** para que sea necesario un 80% de code coverage.
   - Configurar **GitHub** para aplicar una template a la hora de realizar las pull request.
   - Configurar **Husky** para hooks pre-commit que aseguren que el código está bien formateado y cumple con las reglas establecidas.
   - Seguir el flujo de trabajo **GitFlow** para la gestión de ramas y commits.

2. **Estilos**:

   - Utilizar estilos propios o la librería de estilos **Tailwind CSS** para el diseño de la aplicación.
   - No está permitido usar librerías de componentes externos (como Material, PrimeNG, etc.).
   - No existe un diseño predefinido para la aplicación, siéntete libre de crear la interfaz a tu gusto.

&nbsp;

<h1 style="font-size: 30px;">A continuación, ponemos una serie de prácticas sugeridas para realizar el proyecto. Son orientativas, no tienes por qué ir paso a paso con lo indicado si así lo consideras.</h1>

### **Práctica 1: Configuración Inicial**

1. Hacer un fork del repositorio.
2. Proteger la rama main para que no se pueda realizar commits directamente, solo a partir de Pull Request.
3. Crear una rama `feature/initial-project` para configurar los proyectos y lanzar una Pull Request.
4. Si elegiste Tailwind CSS en el frontend sigue la [guía oficial](https://tailwindcss.com/docs/guides/angular).
5. Configurar Prettier, ESLint y Husky en el frontend.

---

### **Práctica 2: Crear la Estructura de la Tabla**

1. Crear una nueva rama `feature/home-page`.
2. Crear el componente inicial `HomeComponent` y configurarlo como la ruta inicial.
3. Dentro del `HomeComponent`, crear un componente `CrudTableComponent` con la siguiente estructura:

   > Breadcrumb en la parte superior para manejar la navegación (ver práctica 6).

   - **Botón en la parte superior** dirige a la vista de Creación.
   - **Campo ID**. Tendrá un link que redirige a la vista de detalle.
   - **Campo Marca**
   - **Campo Modelo**
   - **Campo Total**
   - **Campo Acciones**:

     - Utilizar un menu contextual para mostrar las opciones o dos botones.

       > Editar: Abre una vista con un formulario.
       > &nbsp;

       > Eliminar: Muestra una ventana modal de confirmación.

       Tienes la opción de utilizar el [Menu](https://material.angular.io/cdk/menu/examples) del cdk de Angular o crear tu propio componente.

4. Subir los cambios y abrir una Pull Request.

---

### **Práctica 3: Conexión Angular y Nest.js**

1. Crear una nueva rama `feature/api-integration`.
2. Configurar en el frontend un servicio Angular (`CarsService`) para manejar las peticiones al backend:
   - `getCars`: Llama al endpoint `GET /cars`.
   - `getCarById`: Llama al endpoint `GET /cars/:id`.
   - `createCar`: Llama al endpoint `POST /cars`.
   - `updateCar`: Llama al endpoint `PUT /cars/:id`.
   - `deleteCar`: Llama al endpoint `DELETE /cars/:id`.
3. Configurar en el frontend un servicio Angular (`BrandsService`) para manejar las peticiones al backend:
   - `getBrands`: Llama al endpoint `GET /brands`.
   - `getModelByBrand`: Llama al endpoint `GET /brands/:brandId/models`.
4. Actualizar el componente `CrudTableComponent` para obtener los datos de los servicios y mostrarlos en la tabla.
5. Ten en cuenta el [swagger](http://localhost:3000/api-docs/) que tenemos a la hora de validar los datos antes de enviarlo al backend.
6. Subir los cambios y abrir una Pull Request.

---

### **Práctica 4: Crear Pantallas de Detalle, Edición y Nuevo Item**

1. Crear una nueva rama `feature/car-details`.
2. **Pantalla de Detalle**:
   - Crear un componente `CarDetailsComponent`.
   - Configurar una ruta dinámica como para leer el id desde la ruta `cars/:id`.
   - Mostrar los datos del coche obtenidos del backend en formato de solo lectura.
   - Cuando se muestre el campo mileage usaremos un pipe para ver 2 decimales.
   - Crear un pipe personalizado, para, y junto al campo de mileage controlaremos 3 estados: Nuevo / Kilómetro 0 / Ocasión.

     - Si el mileage es 0, mostraremos un tag verde que ponga "Nuevo"
     - Si es mileage menor a 100km, mostraremos un tag azul que ponga "Km 0"
     - El resto, mostraremos un tag amarillo que ponga "Ocasión"

   - Cuando se muestre el campo de price usaremos el pipe currency (junto a la propiedad currency).

3. **Pantalla de Creación**:
   - Configurar una ruta como `cars/new`.
   - Implementar un formulario reactivo para crear nuevos coches (se necesitará el uso de FormArray para el carDetails).
   - Para las brands y model deberás rellenar la información con sus endpoint correspondientes (recuerda que ambos `select` están relacionados, por lo que deberás controlarlo correctamente)

4. **Pantalla de Edición**:
   - Configurar una ruta dinámica como `cars/:id/edit`.
   - Usar un formulario reactivo con datos precargados del backend.

5. **Debes tener en cuenta todas las validaciones del backend**:
   - manufactureYear debe ser como máximo en el año actual.
   - registrationDate no puede ser anterior a manufactureYear.
   - Respetar el formato de licensePlate.
   - Respetar los valores posibles de currency (comprobar los posibles valores).
   - No olvides revisar el swagger para comprobar el resto de validaciones.

6. Subir los cambios y abrir una Pull Request.

---

### **Práctica 5: Implementar Funcionalidad de Eliminar con Modal**

1. Crear una nueva rama `feature/delete-car`.
2. Crear un componente modal reutilizable (o utilizar el [Dialog](https://material.angular.io/cdk/dialog/overview) del cdk de Angular) que reciba:
   - Título.
   - Mensaje.
   - Acciones de confirmación/cancelación.
3. Conectar el modal a los botones "Eliminar" en la tabla.
4. Manejar errores al eliminar y mostrar un toast de error en caso de fallo.
5. Subir los cambios y abrir una Pull Request.

---

### **Práctica 6: Implementar breadcrumb para la navegación**

1. Crear una nueva rama `feature/breadcrumb`.
2. Crear un componente breadcrumb que reciba:
   - url.
   - label.
3. Manejar la funcionalidad de la navegación.
4. Subir los cambios y abrir una Pull Request.

---

### **Práctica 7: Manejo de Errores y Mensajes**

1. Crear una nueva rama `feature/error-handling`.
2. Crear un servicio Angular para mostrar notificaciones (toasts):
   - Definir métodos para mostrar mensajes de éxito, error e información.
3. Manejar errores en todas las operaciones de los servicio.
4. Mostrar toasts con mensajes claros para cada tipo de error.
5. Subir los cambios y abrir una Pull Request.

---

---

### **Práctica 8: Loaders**

1. Crear una nueva rama `feature/loader-interceptor`.
2. Crear un componente loader (diseño libre):
3. Manejar la implementación y ver la mejor forma de utilizarlo (como si fuera un overlay, en cada componente ...).
4. Subir los cambios y abrir una Pull Request.

---

### **Práctica 9: Finalización y Documentación**

1. Crear una nueva rama `feature/documentation`.
2. Crear un archivo `CONTRIBUTING.md` con normas de contribución:
   - Flujo de trabajo GitFlow.
   - Convenciones de commits (feat, fix, refactor, etc.).
   - Proceso de revisión de código (Pull Requests).
3. Subir los cambios y abrir una Pull Request.

---

### Todos los nombres de componentes, métodos, variables, etc. deberán estar en ingles.

### Si lo consideras necesario, puedes instalar el CDK de Angular para la utilización de los modales y el menú contextual.

### Se trata de un proyecto en versión 19, por lo que se valorará la elección de las últimas funcionalidades (nuevo template flow, signals, etc).

### Es requisito obligatorio un 80% de code coverage en el proyecto para poder entregarlo.

### Recomendamos seguir el [coding style guide](https://angular.dev/style-guide) propuesto por Angular para el desarrollo de este proyecto.
