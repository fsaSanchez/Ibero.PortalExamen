import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { generatePathTranslations } from '../route-config';

export const CustomBreadcrumbs = () => {
  const location = useLocation();
  const { routes = [] } = useSelector((state) => state.auth);
  // Divide la ruta y elimina elementos vacíos (causados por el slash inicial)
  const pathnames = location.pathname.split('/').filter((x) => x);
  const pathTranslations = generatePathTranslations(routes);
  // Si no hay pathnames (estamos en la raíz del dashboard), no renderizamos nada.
  if (pathnames.length < 2) { // Menos de 2 porque el primero siempre es 'dashboard'
    return null;
  }

  
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}> {/* Añade un margen inferior */}
      {/* Siempre mostramos el enlace a "Inicio" (el dashboard) */}
      <Link
        component={RouterLink}
        underline="hover"
        color="inherit"
        to="/dashboard"
      >
       Inicio
      </Link>
      
      {pathnames.slice(1).map((value, index) => { // slice(1) para saltar 'dashboard'
        // Construimos la ruta para cada breadcrumb de forma acumulativa
        const last = index === pathnames.length - 2;
        const to = `/${pathnames.slice(0, index + 2).join('/')}`;
        const displayName = pathTranslations[value] || value;

        return last ? (
          // El último elemento no es un enlace, solo texto
          <Typography color="text.primary" key={to}>
          {displayName}
          </Typography>
        ) : (
          // Los elementos intermedios son enlaces
          <Link
            component={RouterLink}
            underline="hover"
            color="inherit"
            to={to}
            key={to}
          >
          {displayName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};