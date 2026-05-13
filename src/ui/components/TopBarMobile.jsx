import { FaBars, FaBell, FaSearch } from "react-icons/fa"


const TopBarMobile = ({handleToggleSidebar, toggled}) => {
  return (
    <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: '#fff',
      padding: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Sombra para destacar la barra
    }}
  >
    {/* Botón de hamburguesa */}
    <button
      onClick={() => handleToggleSidebar(!toggled)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
      }}
    >
      <FaBars />
    </button>

   

    {/* Notificaciones */}
    <button
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
      }}
    >
      <FaBell />
    </button>
  </div>
  )
}
export default TopBarMobile