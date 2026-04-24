# FullStack E-commerce UPB

Este proyecto es una aplicación de comercio electrónico (E-commerce) desarrollada con React y Vite como parte de la formación en la Universidad Pontificia Bolivariana (UPB).

## 🚀 Características

-   **Navegación Intuitiva:** Implementada con `react-router-dom` utilizando `HashRouter` para compatibilidad total con GitHub Pages.
-   **Gestión de Estado:** Utiliza `Zustand` para un manejo de estado ligero y eficiente (carrito de compras, autenticación).
-   **Estilos Modernos:** Desarrollado con `Tailwind CSS v4` para un diseño responsive y atractivo.
-   **Backend & Autenticación:** Integración con `Firebase` para autenticación y persistencia de datos.
-   **Consumo de API:** Uso de `Axios` para la comunicación con servicios externos.
-   **Código Robusto:** Incluye manejo de errores global mediante `ErrorBoundary`.

## 🛠️ Tecnologías Utilizadas

-   [React 19](https://react.dev/)
-   [Vite 8](https://vitejs.dev/)
-   [Tailwind CSS 4](https://tailwindcss.com/)
-   [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
-   [Firebase](https://firebase.google.com/)
-   [React Router 6](https://reactrouter.com/)

## 📦 Instalación y Uso

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/santi-osp/FullStack-E-commerce-UPB.git
    cd FullStack-E-commerce-UPB
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Desplegar a GitHub Pages:**
    ```bash
    npm run deploy
    ```

## 📄 Estructura del Proyecto

```text
src/
├── app/               # Configuración principal de la App
├── components/        # Componentes atómicos y orgánicos
├── config/            # Configuraciones de Firebase y otros servicios
├── hooks/             # Custom hooks para lógica reutilizable
├── mockdata/          # Datos de prueba para desarrollo
├── pages/             # Componentes de página (Home, Cart, Login, etc.)
├── services/          # Servicios de API y comunicación
├── store/             # Definiciones de estado con Zustand
└── utils/             # Funciones de utilidad común
```

## 👤 Autor

Desarrollado por [Santi-OSP](https://github.com/santi-osp).
