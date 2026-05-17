import React, { lazy } from "react";

// 🧠 1️⃣ Registrar todos los componentes posibles en tus carpetas.

const modules = import.meta.glob("../../components/**/*.{jsx,js,tsx}");

// Cache de instancias lazy — evita que cada re-render de AppRoutes cree una
// nueva instancia de React.lazy, lo cual desmontaría el componente activo.
const _loadableCache = new Map();

// 🧩 2️⃣ Función de carga segura y compatible con Vite
export const loadable = (relativePath) => {
  if (_loadableCache.has(relativePath)) return _loadableCache.get(relativePath);

  const key = `../../components/${relativePath}.jsx`;
  const keyJs = `../../components/${relativePath}.js`;
  const keyTsx = `../../components/${relativePath}.tsx`;

  const importer = modules[key] || modules[keyJs] || modules[keyTsx];

  if (!importer) {
    console.error(`❌ No se encontró el componente: ${relativePath}`);
    const NotFound = () => <div>Componente no encontrado: {relativePath}</div>;
    _loadableCache.set(relativePath, NotFound);
    return NotFound;
  }

  const component = lazy(importer);
  _loadableCache.set(relativePath, component);
  return component;
};


// 🧭 4️⃣ Breadcrumb helper
export const generatePathTranslations = (routes) => {
  const translations = {};
  routes.forEach((route) => {
    if (route.path) {
      const parts = route.path.split("/").filter(Boolean);
      parts.forEach((part, index) => {
        if (!translations[part]) {
          translations[part] =
            index === parts.length - 1
              ? route.label
              : part.charAt(0).toUpperCase() + part.slice(1);
        }
      });
    }
  });
  return translations;
};

// 🚀 5️⃣ Generación de rutas React Router helper (Aplanado para <Routes>)
export const transformRoutes = (routes) => {
  return routes.map((route) => {
    if (route.path && route.element) {
      const relativePath = route.path
        .replace("/dashboard/", "")
        .replace(/^\//, "");
      const Component = loadable(route.element);
      return {
        ...route,
        path: relativePath,
        element: <Component />, // Elemento JSX listo para el Router
      };
    }
    return route;
  }).filter((route) => route.element);
};
