import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthEmployee, AuthStudent } from "../components";
import Select from "react-select";
import ibero_login from '../../assets/img/ibero_login.png'
import logoSuperior from '../../assets/img/logo_ibero_superior.png'
import { startLoadingProfilesApp } from "../store/auth_thunk";
import { getProfilesApp } from "../functions/functions";
import '../styles/styles_login.css'
import { AxiosData } from "../../services/AxiosConnexion";
import { TypeService } from "../../services/TypeService";
import { appIdConfig } from "../../config";

const customStyles = {
  control: (base) => ({
    ...base,
    border: 'none', // Elimina el contorno
    boxShadow: 'none', // Elimina la sombra
  }),
  singleValue: (base) => ({
    ...base,
    color: 'red', // Cambia el color del texto del valor seleccionado a rojo
  }),
  option: (base) => ({
    ...base,
    color: 'black', // Deja el texto de las opciones en negro
  }),
  placeholder: (base) => ({
    ...base,
    color: 'gray', // Deja el texto del placeholder en gris (puedes cambiarlo si lo prefieres)
  }),
};

export const Authpage = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState({ value: 410, label: 'Administrador' });
  const [options, setOptions] = useState([]);
  const { profilesApp } = useSelector((state) => state.auth);
  const [backgroundImage, setBackgroundImage] = useState(ibero_login);

  useEffect(() => {
    const fetchLoginImage = async () => {
      try {
        const resp = await AxiosData({
          endpoint: `Apps/GetImagenUrlByAppSedeId?appSedeId=${appIdConfig}`,
          method: "GETDIT",
        });
        console.log(resp);

        if (resp.respuestaStatus === TypeService.AxiosApiOk && resp.data) {
          setBackgroundImage(resp.data);
        }
      } catch (error) {
        console.error("Error cargando la imagen de login:", error);
      }
    };

    fetchLoginImage();
  }, []);

  useEffect(() => {
    dispatch(startLoadingProfilesApp());
  }, [dispatch]);

  useEffect(() => {
    if (profilesApp) setOptions(getProfilesApp(profilesApp));
  }, [profilesApp]);

  useEffect(() => {
    if (options?.length > 0) setSelected(options[0]);
  }, [options]);

  const handleChange = (value) => setSelected(value);

  const renderView = () => {
    if (selected.label === "Solicitante") {
      return (
        <AuthStudent
          profileId={selected.value}
        />
      );
    } else {
      // Usar AuthEmployee para Administrador, Coordinador y cualquier otro perfil interno
      return <AuthEmployee profile={selected} />;
    }
  };

  return (
    <div className="container-fluid vh-100 p-0 d-flex">
      {/* Imagen (70%) */}
      <div className="col-md-6 p-0 d-none d-md-block">
        <img
          src={backgroundImage}
          alt="Imagen Decorativa"
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Formulario (30%) */}
      <div className="col-md-5 d-flex flex-column justify-content-start align-items-center position-relative bg-white p-4">
        {/* Logo superior derecho */}
        <img
          src={logoSuperior}
          alt="Logo"
          className="position-absolute top-0 end-0 m-3"
          style={{ width: '120px', height: 'auto' }}
        />

        <div className="w-75 mt-5">
          <h2 className="ib-h2">[Nombre Aplicación]</h2>
          <br />
          <h2 className="titulo-login">Iniciar Sesión</h2>
          <div className="row mb-5">
            <div className="col-md-4">
              <p className="subtitulo-login">Ingresa con tu número de empleado</p>
            </div>
            <div className="col-md-4">
              <Select
                options={options}
                onChange={handleChange}
                styles={customStyles}
                value={selected}
              />
            </div>
          </div>
          {renderView()}
        </div>
      </div>
    </div>
  );
};
