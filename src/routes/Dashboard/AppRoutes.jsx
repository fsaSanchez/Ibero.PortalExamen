import React, { Suspense, useEffect, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ProtectedRouteGuard } from "./guard/ProtectedRouteGuard";
import { Dashboard } from "./UI/Dashboard";
import { NotFound } from "../../components/404/NotFound";
import { Home } from "../../components/General/pages";
import { Loading } from "../../helpers/Loading";
import { loadable, transformRoutes } from "./route-config";
import { startGetMenuRoutes } from "../../Auth/store/auth_thunk";


const AppRoutes = () => {
  const { routes, profileId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profileId && routes.length === 0) {
      dispatch(startGetMenuRoutes(profileId));
    }
  }, [profileId, routes, dispatch]);

  // useMemo evita que transformRoutes recalcule en cada re-render del padre.
  // Sin esto, AppRouter (suscrito a ui.loading) provoca re-renders de AppRoutes
  // que crean nuevas instancias de React.lazy, desmontando la pantalla activa.
  const dashboardRoutes = useMemo(() => transformRoutes(routes), [routes]);

  return (
    // Suspense debe envolver las rutas que usan lazy loading
    <div>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 1. Ruta de Layout Protegida */}
          <Route
            path="/dashboard" // Nota: sin el "/*" aquí
            element={
              <ProtectedRouteGuard>
              
                  <Dashboard />
            
              </ProtectedRouteGuard>
            }
          >
            {/* 2. Rutas Hijas Anidadas (se renderizarán dentro del <Outlet/> de Dashboard) */}
            <Route index element={<Home />} /> {/* La ruta para "/dashboard" */}

            {dashboardRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Ruta catch-all para cualquier cosa no encontrada DENTRO de /dashboard */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* 3. Redirección por defecto si no se está en /dashboard o /auth */}
          {/* Esto puede ser una landing page o una redirección a login */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;
