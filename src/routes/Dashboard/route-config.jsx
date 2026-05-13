import React, { lazy } from "react";

// 🧠 1️⃣ Registrar todos los componentes posibles en tus carpetas.

const modules = import.meta.glob("../../components/**/*.{jsx,js,tsx}");

// 🧩 2️⃣ Función de carga segura y compatible con Vite
export const loadable = (relativePath) => {
  // Construimos la ruta base esperada
  const key = `../../components/${relativePath}.jsx`;
  const keyJs = `../../components/${relativePath}.js`;
  const keyTsx = `../../components/${relativePath}.tsx`;

  // Buscamos el import correspondiente
  const importer = modules[key] || modules[keyJs] || modules[keyTsx];

  if (!importer) {
    console.error(`❌ No se encontró el componente: ${relativePath}`);
    return () => <div>Componente no encontrado: {relativePath}</div>;
  }

  return lazy(importer);
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
