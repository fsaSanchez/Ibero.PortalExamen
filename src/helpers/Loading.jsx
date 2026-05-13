import BeatLoader from 'react-spinners/BeatLoader'
import { useSelector } from "react-redux";
import { useState } from 'react';

// ---- Muestra un loadig en la pantalla ----
// ---- El cual se manda llamr por medio de un dispatch ----
// ---- Y en este es pasado el mensaje al state ui ----
// ---- El componente recupera ese mensake de state ui  y lo pone en pantalla ----
export const Loading = () => {
  // Recupera mensaje  del state ui
  const { MensajeLoader } = useSelector(state => state.ui);
  let [color] = useState("#485C8F");
  let [loading] = useState(true);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const loadingContainerStyle = {
    position: "fixed",  // Hace que el loader se quede en la misma posición mientras se desplaza la página
    top: "50%",         // Lo centra verticalmente
    left: "50%",        // Lo centra horizontalmente
    transform: "translate(-50%, -50%)",  // Ajusta el centro para que se ubique perfectamente
    zIndex: "9999",     // Asegura que el loader esté por encima de otros elementos
    textAlign: "center", // Alinea el texto en el centro
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Opcional: fondo semitransparente
    width: "100%",      // Opcional: para cubrir toda la pantalla
    height: "100%",     // Opcional: para cubrir toda la pantalla
    display: "flex",    // Usa Flexbox para centrar contenido
    justifyContent: "center", // Centra el contenido horizontalmente
    alignItems: "center",  // Centra el contenido verticalmente
    flexDirection: "column", // Asegura que el texto y el loader estén en columna
  };

  return (
    <div className="sweet-loading m-0" style={loadingContainerStyle}>
      <BeatLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <h4 className="mt-3 animate__animated animate__flash animate__infinite infinite text-uppercase" style={{ margin: "0" }}>
        {MensajeLoader}
      </h4>
    </div>

  )
}