import { Navigate, Route, Routes } from 'react-router-dom'
import { Authpage } from '../../Auth/pages/Authpage'
import { AuthLayout } from './UI/AuthLayout';


export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        {/* Rutas anidadas que se renderizan dentro del Outlet de AuthLayout */}
        <Route path="login" element={<Authpage />} />
        {/* <Route path="register" element={<RegisterPage />} /> */}
        
        {/* Cualquier otra ruta bajo /auth/ redirige a login */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Route>
    </Routes>
  );
};