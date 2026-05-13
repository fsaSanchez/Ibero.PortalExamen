import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Auth/store";
import { IconIbero } from "./Icons/IconIbero";
import { clearLocalStorage, LocalStorageKeys } from "../../utilities/localStorage.utility";
import "../css/Navbar.css";

export const Navbar = ({ routes, open, setOpen }) => {
  const { profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogOut = () => {
    dispatch(logout());
    [LocalStorageKeys.TOKEN, LocalStorageKeys.REFRESH_TOKEN, LocalStorageKeys.TOKEN_EXP_DATE, LocalStorageKeys.TOKEN_REFRESH_EXP_DATE]
      .forEach(clearLocalStorage);
    navigate("/auth/login", { replace: true });
  };


  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        className="hamburger-btn d-md-none"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
        {/* Logo y colapsar */}
        <div className="logo d-flex justify-content-between align-items-center py-3 border-bottom px-2">
          {!collapsed && <img src="/Logoibero.svg" alt="logo" className="img-fluid" style={{ maxHeight: 60 }} />}
          <button
            className="btn btn-sm border-0"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <IconIbero icon={collapsed ? "KeyboardDoubleArrowRight":"KeyboardDoubleArrowLeft"} /> 
          </button>
        </div>

        {/* Perfil usuario */}
        <div className="user-info text-center py-3 border-bottom">
          <div
            style={{ border: "1px solid rgba(0,0,0,.3)", width: 50, height: 50, margin: "0 auto" }}
            className="rounded-circle d-flex align-items-center justify-content-center mb-2"
          >
            <IconIbero icon="Person" size="35px" />
          </div>
          {!collapsed && <h6 className="mb-0">{profile?.nombre}</h6>}
        </div>

        {/* Menú */}
          <br></br>
        <ul className="nav flex-column mt-3 px-2">
               

            {routes?.map((subRoute) => {
              const linkTo = subRoute.path?.startsWith('/') ? subRoute.path : `/dashboard/${subRoute.path}`;
              
              return (
                <li key={subRoute.label || Math.random()} className="nav-item">
                  <NavLink
                    to={linkTo}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center gap-2 ${isActive ? "active fw-semibold text-danger" : "text-secondary"}`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <IconIbero icon={subRoute.icon ?? "ArrowRight"} />
                    {!collapsed && <span>{subRoute.label}</span>}
                  </NavLink>
                </li>
              );
            })}
              
         
        </ul>

        {/* Logout */}
        <div className="logout-btn d-flex align-items-center gap-2 p-3 mt-auto cursor-pointer" onClick={handleLogOut}>
          <IconIbero icon="Logout" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </div>
      </nav>

      {/* Overlay móvil */}
      <div className={`overlay ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
    </>
  );
};
