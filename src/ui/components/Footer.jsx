
import { MdExitToApp } from "react-icons/md";


import { useDispatch } from "react-redux";
import {  startLogout } from "../../Auth/store";
import '../css/sidebarFooter.css'

export const Footer = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(startLogout());
  };

  return (
    <div
      style={{
        padding: "20px 24px",
      }}
      className="sidebarFooter"
    >
      <div onClick={handleLogout}>
        <MdExitToApp
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          
        />
        Cerrar sesión{" "}
      </div>
    </div>
  );
};
