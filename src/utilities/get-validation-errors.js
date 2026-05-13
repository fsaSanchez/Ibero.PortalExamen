export const getValidationError = (errorCode, message) => {
    console.log(errorCode);
    
    const codeMatcher = {
      ERR_BAD_REQUEST: 'Se rompió la red',
      ERR_TIMEOUT: 'Se acabó el tiempo',
      ERR_CANCEL: 'Se canceló la petición',
      ERR_UNKNOWN: 'Error desconocido',
      ERR_NETWORK: 'La conexión que estás intentando hacer ha sido «rechazada»',
      ERR_400: 'Error 400',
      ERR_401: 'Error 401',
      ERR_403: 'Error 403',
      ERR_VALIDATION: message
    };
  
    return codeMatcher[errorCode] || 'Error desconocido';  // Si no se encuentra el error, devuelve un mensaje por defecto
  };
  