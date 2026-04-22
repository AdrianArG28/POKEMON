**Pokémon Admin Panel**
Sistema de gestión para entrenadores Pokémon, diseñado para un control centralizado de usuarios, capturas y visualización de datos de la PokeAPI.

**Descripción del Proyecto**
Este proyecto es una aplicación web full-stack que permite la administración de usuarios y la gestión de capturas de Pokémon. Está desarrollado con un enfoque en interfaces modernas (Glassmorphism), interactividad fluida y validaciones robustas.

**Tecnologías Utilizadas**
**Backend**
Node.js & Express: Servidor robusto para el manejo de rutas y API.

Sequelize (ORM): Interacción eficiente con la base de datos (PostgreSQL/SQLite).

Joi: Validación de datos en el servidor.

Dotenv: Gestión de variables de entorno.

**Frontend**
JavaScript (Vanilla): Lógica de cliente sin dependencias pesadas.

CSS3: Diseño responsivo, animaciones personalizadas (shake, slideUp, modalPop) y efectos de glassmorphism.

PokeAPI: Integración con la API oficial de Pokémon para la obtención de datos en tiempo real.

**Funcionalidades Principales**
Autenticación: Sistema de login y registro con validaciones estrictas y retroalimentación visual (vibración ante errores).

Gestión de Usuarios: Creación, listado y borrado de entrenadores con soporte para Cascading Delete.

Pokedex Interactiva: Visualización de Pokémon y sistema de captura vinculado a usuarios específicos.

Interfaz Dinámica: Modales animados, Toasts de notificación y estados de carga (UX mejorada).

**Estructura del Proyecto**
Plaintext
/
├── public/
│   ├── css/          # Estilos CSS (glassmorphism, animaciones)
│   └── frontend/     # Lógica de cliente (app.js)
├── src/
│   ├── controladores/ # Lógica de negocio (CRUD)
│   ├── rutas/         # Endpoints de la API
│   └── baseDatos/     # Modelos y configuración Sequelize
├── .env               # Variables de entorno
└── app.js             # Punto de entrada del servidor

**Instalación y Configuración**
Clonar el repositorio:

Bash
git clone [URL-DE-TU-REPOSITORIO]
cd pokemon-admin-panel
Instalar dependencias:

Bash
npm install
Configurar variables de entorno:
Crea un archivo .env en la raíz con:

Fragmento de código
PORT=3000
DB_NAME=tu_base_datos

**Otras configuraciones**
Iniciar el servidor:

Bash
node app.js

Hecho por:
**Adrián Daniel Argotte Marichal**
Estudiante en la Universidad de Manizales.

**Desarrollado en abril de 2026**