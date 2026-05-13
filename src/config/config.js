const VITE_API_KEY = import.meta.env.VITE_API_KEY;

// ⚠ Configuración específica de la aplicación: ID de la aplicación en base de datos
let appIdConfig = 400; // CAMBIAR ESTE VALOR POR EL ID DE LA NUEVA APLICACIÓN
let configGlobal = {
  urlApiIbero: "",
  urlApiGestion: "",
};

const ID_TIPO_STUDENT = 21;
const ID_TIPO_PROFESSOR = 3;
const ID_TIPO_PROFESOR_ASIGNATURA = 22;
// const ID_TIPO_EMPLEADO = 29;
const ID_TIPO_EMPLEADO = 24;

// let REACT_APP_RECAPTCHA_GOOGLE = "6LePDXkqAAAAAMPIzgAshOKlZ6ZupYX0xoNozaMG";
// let REACT_APP_CLAVE_SECRETA = "6LePDXkqAAAAACdB44xVWjaOUVcCRJyHXmZMdu0e";

// Claves reCAPTCHA por defecto desde .env
let RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
let RECAPTCHA_SECRET_KEY = import.meta.env.VITE_RECAPTCHA_SECRET_KEY;

if (VITE_API_KEY === "local") {
  configGlobal = {
    urlApiIbero: "https://localhost:7138/api/",
    // urlApiIbero: "https://controldocumentalvicerrectoriades.ibero.mx/back/api/",
    urlApiGestion: "https://solicitudesti.ibero.mx/back/api/",
    //urlApiGestion: "https://localhost:7284/api/",
  };
  RECAPTCHA_SITE_KEY = "6LfoH3kqAAAAAJoAnd5ObrGu4BZBwimub717XG5w";
  RECAPTCHA_SECRET_KEY = "6LfoH3kqAAAAAA3YSWEXB7K_NQVr7tXYSOv0dHSf";
}

if (VITE_API_KEY === "development") {
  configGlobal = {
    urlApiIbero: "https://localhost:7138/api/",
    urlApiGestion: "https://solicitudesti.ibero.mx/back/api/",
  };
}

if (VITE_API_KEY === "test") {
  configGlobal = {
    urlApiIbero: "https://localhost:7138/api/",
    urlApiGestion: "https://solicitudesti.ibero.mx/back/api/",
  };
}

if (VITE_API_KEY === "production") {
  configGlobal = {
    urlApiIbero: "https://localhost:7138/api/",
    urlApiGestion: "https://solicitudesti.ibero.mx/back/api/",
  };
}

export {
  configGlobal,
  appIdConfig,
  RECAPTCHA_SITE_KEY,
  RECAPTCHA_SECRET_KEY,
  ID_TIPO_EMPLEADO,
  ID_TIPO_STUDENT,
};
