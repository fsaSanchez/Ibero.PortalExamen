import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // ¡La clave es el Outlet!
import { useSelector } from "react-redux";


import { CustomBreadcrumbs } from "./CustomBreadcrumbs";

import { transformRoutes } from "../route-config";
import { Navbar } from "../../../ui/components/Navbar";

export const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const { routes = [] } = useSelector((state) => state.auth);

  return (
    <div className="d-flex container-fluid">
      {/* El Navbar ahora recibe las rutas procesadas directamente */}
      <Navbar routes={routes} open={open} setOpen={setOpen} />

      <main className="main-content">
        <CustomBreadcrumbs />
        {/* Aquí es donde React Router renderizará el componente de la ruta hija activa */}
        <Outlet />
      </main>
    </div>
  );
};