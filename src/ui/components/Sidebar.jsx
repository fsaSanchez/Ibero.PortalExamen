
import { Sidebar } from 'react-pro-sidebar';
import TopBarMobile from './TopBarMobile';
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState, memo } from 'react';
import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';
import '../css/sidebarContent.css'

export const SidebarPage = memo(({ toggled, setToggled }) => {
  console.log("SidebarPage rendering");
  // Verifica si la pantalla es de tamaño móvil o tablet
  const isMobileOrTablet = useMediaQuery({ maxWidth: 480 });

  const [collapsed, setCollapsed] = useState(false);

  // Función para manejar el toggle del sidebar
  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  // Usamos el hook useEffect para ajustar el estado `collapsed` en base al tamaño de la pantalla
  useEffect(() => {

    if (isMobileOrTablet) {
      setCollapsed(true); // El sidebar debe estar colapsado en dispositivos pequeños
    } else {
      setCollapsed(false); // Si es mayor a tablet, el sidebar puede estar expandido
    }
  }, [isMobileOrTablet]);


  return (
    <>
      {/* Barra superior para dispositivos móviles */}
      {isMobileOrTablet && (
        <TopBarMobile handleToggleSidebar={handleToggleSidebar} toggled={toggled} />
      )}


      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed} // Establece el estado de colapsado
        toggled={toggled} // Controla si el sidebar está abierto o cerrado
        breakPoint="xs" // El sidebar se colapsa a partir de pantallas pequeñas (xs)
        onToggle={handleToggleSidebar} // Controla el toggle del sidebar
        className="custom-sidebar"
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content isMobileOrTablet={isMobileOrTablet} />
        <Footer />
      </Sidebar>
    </>
  );
});