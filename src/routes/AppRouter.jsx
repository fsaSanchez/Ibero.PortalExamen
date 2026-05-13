import { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loading } from "../helpers/Loading";
import { AuthRoutes } from "./Auth/AuthRoutes";
import AppRoutes from "./Dashboard/AppRoutes";
import { PublicRouteGuard } from "./Auth/guard/PublicRouteGuard";



const AppRouter = () => {
  const { loading } = useSelector((state) => state.ui);
  const { checking } = useSelector((state) => state.auth);



  if (checking) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        {loading && <Loading />}
        <Routes>
          {/* Rutas de Autenticación */}
          <Route
            path="/auth/*"
            element={
              <PublicRouteGuard>
                <AuthRoutes />
              </PublicRouteGuard>
            }
          />

          {/* Rutas de la Aplicación */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRouter;
