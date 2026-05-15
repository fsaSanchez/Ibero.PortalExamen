import axios from "axios";
import moment from 'moment'
import { configGlobal } from "../config/config";
import { TypeService } from "./TypeService";
import { handleUnauthorized } from "./AxiosInterceptor";





export const AxiosDataNotoken = async (endpoint, method, body = null, queryString = null) => {
  const AxiosResponse = {
    data: null,
    respuestaStatus: null,
    message: '',
    success: 0,
  }

  const urlApi = `${configGlobal.urlApiIbero}${endpoint}`

  try {
    let response

    switch (method) {
      case 'Filepost':
        response = await axios.post(urlApi, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        break

      case 'post':
        response = await axios.post(urlApi, body)
        break

      case 'get':
        response = await axios.get(urlApi, { params: queryString })
        break

      case 'put':
        response = await axios.put(urlApi, body)
        break

      case 'delete':
        response = await axios.delete(urlApi, { data: body })
        break

      default:
        throw new Error(`Método no soportado: ${method}`)
    }

    const { data, success, message } = response.data
    AxiosResponse.data = data
    AxiosResponse.message = message
    AxiosResponse.success = success
    AxiosResponse.respuestaStatus =
      success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail

  } catch (error) {
    if (error.response) {
      AxiosResponse.respuestaStatus = error.response.status
    } else if (error.request) {
      AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
      console.log('Error de conexión con API')
    } else {
      AxiosResponse.respuestaStatus = TypeService.AxiosApi500
      console.log('Ocurrió un error, intente más tarde')
    }
    console.error(error)
  }

  return AxiosResponse
}









export const AxiosDataTokenApp = async (
  endpoint,
  method,
  body = null,
  queryString = null,
) => {
  //Respuesta del metodo
  const AxiosResponse = {
    data: null,
    respuestaStatus: null,
    refresh: false,
    message: '',
    success: 0,
  }

  //Token de las peticiones al API
  const TokenExp = localStorage.getItem('token-exp-date')

  //Token para solictar un nuevo token. Tiene 5 min mas de valides que el token(Tiempo se administra en el API)
  const refreshToken = localStorage.getItem('refreshToken-exp-date')

  //Libreria moment para fechas y horarios  locate para utlizar horario local
  moment.locale()
  var TokenExpA = moment(new Date(TokenExp * 1000))

  //Se quita un minuto, para si entra en tiempo, donde ya se necesita refrecar token
  // Esta ultima peticion aun sea valida con el token actual.

  var refreshTokenA = moment(new Date(refreshToken * 1000)).add(-1, 'minutes')
  const CurrenDate = moment(new Date())

  //Si la fecha actual es mayor al tiempo de expiracion de refreshToken, significa que ya expiro el token
  //Se retorna Estatus 401 de no autorizado. De esta forma es direccionado a logout
  if (CurrenDate.isAfter(refreshTokenA)) {
    AxiosResponse.respuestaStatus = TypeService.AxiosApi401
    handleUnauthorized();
    return AxiosResponse
  } else {
    //Si el token aun no expira, se revisa que la hora actual este entre la expiracion del token para
    // y del refresh token. De estarlo, se refrescara el token y conseguira una nueva expiracion del token
    //Con este evitamos que el se tenga que iniciar sesion nuevamente. Y se cerrara sola si el usuario
    //NO hace movimiento en el app por un timepo mayor a la vida del token
    if (CurrenDate.isBetween(TokenExpA, refreshTokenA)) {
      AxiosResponse.refresh = true
    }
  }

  // La logica de las peticiones abajo es la misma como se decribe arriba. COn diferencia que
  // lleva el token en el header
  const urlApi = `${configGlobal.urlApiGestion}${endpoint}`

  const token = localStorage.getItem('token') || ''
  //  Agrega token al header.Para poder acceder a los metodos del API.
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  switch (method) {
    case 'Filepost':
      try {
        const response = await axios.post(urlApi, body, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })

        const { data, success, message } = response.data
        AxiosResponse.data = data
        AxiosResponse.message = message
        AxiosResponse.success = success
        AxiosResponse.respuestaStatus =
          success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail
        return AxiosResponse
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Se regresa al incio por token incorrecto')
            AxiosResponse.respuestaStatus = TypeService.AxiosApi401
          }
        } else if (error.request) {
          AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
          console.log('Error de Conexion con API')
        } else {
          console.log('Ocurrio un error, intente mas tarde')
          AxiosResponse.respuestaStatus = TypeService.AxiosApi500
        }
        console.log(error)

        return AxiosResponse
      }

    case 'post':
      try {
        const response = await axios.post(urlApi, body, config)

        const { data, success, message } = response.data
        AxiosResponse.data = data
        AxiosResponse.message = message
        AxiosResponse.success = success
        AxiosResponse.respuestaStatus =
          success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail
        return AxiosResponse
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Se regresa al incio por token incorrecto')
            AxiosResponse.respuestaStatus = TypeService.AxiosApi401
          }
        } else if (error.request) {
          AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
          console.log('Error de Conexion con API')
        } else {
          console.log('Ocurrio un error, intente mas tarde')
          AxiosResponse.respuestaStatus = TypeService.AxiosApi500
        }
        console.log(error)

        return AxiosResponse
      }

    case 'get':
      try {
        const params = {
          headers: config.headers,
          params: queryString,
        };

        const response = await axios.get(urlApi, params)

        const { data, success, message } = response.data
        AxiosResponse.data = data
        AxiosResponse.message = message
        AxiosResponse.success = success
        AxiosResponse.respuestaStatus =
          success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail
        return AxiosResponse
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Se regresa al incio por token incorrecto')
            AxiosResponse.respuestaStatus = TypeService.AxiosApi401
          }
        } else if (error.request) {
          AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
          console.log('Error de Conexion con API')
        } else {
          console.log('Ocurrio un error, intente mas tarde')
          AxiosResponse.respuestaStatus = TypeService.AxiosApi500
        }

        return AxiosResponse
      }

    case 'put':
      try {
       
        const response = await axios.put(urlApi, body, config)
        const { data, success, message } = response.data
        AxiosResponse.data = data
        AxiosResponse.message = message
        AxiosResponse.success = success
        AxiosResponse.respuestaStatus =
          success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail
        return AxiosResponse
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Se regresa al incio por token incorrecto')
            AxiosResponse.respuestaStatus = TypeService.AxiosApi401
          }
        } else if (error.request) {
          AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
          console.log('Error de Conexion con API')
        } else {
          console.log('Ocurrio un error, intente mas tarde')
          AxiosResponse.respuestaStatus = TypeService.AxiosApi500
        }
        console.log(error)

        return AxiosResponse
      }

    case 'delete':
      try {
      
        const response = await axios.delete(urlApi, body, config)
     

        const { data, success, message } = response.data
        AxiosResponse.data = data
        AxiosResponse.message = message
        AxiosResponse.success = success
        AxiosResponse.respuestaStatus =
          success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail
        return AxiosResponse
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Se regresa al incio por token incorrecto')
            AxiosResponse.respuestaStatus = TypeService.AxiosApi401
          }
        } else if (error.request) {
          AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
          console.log('Error de Conexion con API')
        } else {
          console.log('Ocurrio un error, intente mas tarde')
          AxiosResponse.respuestaStatus = TypeService.AxiosApi500
        }
        console.log(error)

        return AxiosResponse
      }

    default:
      break
  }
}

//Funcion para hacer peticiones HTTP que corresponden al login
export const AxiosLoginData = async ( endpoint, method, body = null, queryString = null) => {

    const urlApi = `${configGlobal.urlApiGestion}${endpoint}`


    const AxiosResponse = { data: null, respuestaStatus: null , message:"" ,success:0 };

    switch (method) {
        case 'post':
          try {
            const response = await axios.post(urlApi, body)
            const { data, success, message } = response.data;
            AxiosResponse.data = data
            AxiosResponse.message = message
            AxiosResponse.success = success
            AxiosResponse.respuestaStatus =
              success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail
            return AxiosResponse
          } catch (error) {
            if (error.response) {
              if (error.response.status === 401) {
                // Error de conexion por token no valido
                console.log('Se regresa al incio por token incorrecto')
                AxiosResponse.respuestaStatus = TypeService.AxiosApi401
              }
            } else if (error.request) {
              // Error de conexxion con el API
              AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
              console.log('Error de Conexion con API')
            } else {
              // Error interno en el API (En este caso, lo mas comun es que el error este en el API)
              console.log('Ocurrio un error, intente mas tarde')
              AxiosResponse.respuestaStatus = TypeService.AxiosApi500
            }
            console.log(error)
    
            return AxiosResponse;
          }
    
          case "get":
            try {
                const response = await axios.get(urlApi, {params: queryString});
                const { data , success, message} = response.data;
                AxiosResponse.data = data;
                AxiosResponse.message = message;
                AxiosResponse.success = success;
                AxiosResponse.respuestaStatus = success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail;
                return AxiosResponse;
              } catch (error) {
                if (error.response) {
                  if (error.response.status === 401) {// Error de conexion por token no valido
                    console.log("Se regresa al incio por token incorrecto");
                    AxiosResponse.respuestaStatus = TypeService.AxiosApi401;
                  }
                } else if (error.request) { // Error de conexxion con el API
                  AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion;
                  console.log("Error de Conexion con API");
                } else { // Error interno en el API (En este caso, lo mas comun es que el error este en el API)
                  console.log("Ocurrio un error, intente mas tarde");
                  AxiosResponse.respuestaStatus = TypeService.AxiosApi500;
                }
                console.log(error);
        
                return AxiosResponse;
              }
    
        default:
          break
      }

}

//Funcion para ahcer peticiones HTTP (incluye logica de refresh token)
export const AxiosDataToken = async(
    endpoint,
    method,
    body = null,
    queryString = null,
) =>{

    //Respuesta del metodo
    const AxiosResponse = {
        data: null,
        respuestaStatus: null,
        refresh: false,
        message: '',
        success: 0,
    }

    
    //Token de las peticiones al API
    const TokenExp = localStorage.getItem('token-exp-date')

    //Token para solictar un nuevo token. Tiene 5 min mas de valides que el token(Tiempo se administra en el API)
    const refreshToken = localStorage.getItem('refreshToken-exp-date')

    //Libreria moment para fechas y horarios  locate para utlizar horario local
    moment.locale()
    var TokenExpA = moment(new Date(TokenExp * 1000))

    //Se quita un minuto, para si entra en tiempo, donde ya se necesita refrecar token
    // Esta ultima peticion aun sea valida con el token actual.

    var refreshTokenA = moment(new Date(refreshToken * 1000)).add(-1, 'minutes')
    const CurrenDate = moment(new Date())

    //Si la fecha actual es mayor al tiempo de expiracion de refreshToken, significa que ya expiro el token
    //Se retorna Estatus 401 de no autorizado. De esta forma es direccionado a logout
    if (CurrenDate.isAfter(refreshTokenA)) {
      AxiosResponse.respuestaStatus = TypeService.AxiosApi401
      handleUnauthorized();
      return AxiosResponse
    } else {
      //Si el token aun no expira, se revisa que la hora actual este entre la expiracion del token para
      // y del refresh token. De estarlo, se refrescara el token y conseguira una nueva expiracion del token
      //Con este evitamos que el se tenga que iniciar sesion nuevamente. Y se cerrara sola si el usuario
      //NO hace movimiento en el app por un timepo mayor a la vida del token
      if (CurrenDate.isBetween(TokenExpA, refreshTokenA)) {
        AxiosResponse.refresh = true
      }
    }

    const urlApi = `${configGlobal.urlApiIbero}${endpoint}`

    const token = localStorage.getItem('token') || ''
    //  Agrega token al header.Para poder acceder a los metodos del API.
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    }


    try {
        let response;
    
        switch (method) {
          case 'get':
            response = await axios.get(urlApi, {headers: config.headers, params: queryString,});
            
            break;
    
          case 'post':
            response = await axios.post(urlApi, body, {headers: config.headers, params: queryString,});

            break;
    
          case 'put':
            response = await axios.put(urlApi, body, {headers: config.headers, params: queryString,});
            break;
    
          case 'delete':
            response = await axios.delete(urlApi, config);
            break;

          case 'Filepost':
            response = await axios.post(urlApi, body, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
              params: queryString,
            });
            break;

          default:
            throw new Error('Invalid HTTP method');
        }
    
        // Asume que la respuesta del servidor sigue la estructura esperada
        const { data, success, message } = response.data;

    
        AxiosResponse.data = data;
        AxiosResponse.message = message;
        AxiosResponse.success = success;
        AxiosResponse.respuestaStatus =  success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail;

        return AxiosResponse;
    
      } catch (error) {
        console.log(error);
        // Manejo de errores
        if (error.response) {
          if (error.response.status === 401) {
            console.log('Se regresa al incio por token incorrecto')
            AxiosResponse.respuestaStatus = TypeService.AxiosApi401
          }
        } else if (error.request) {
          AxiosResponse.respuestaStatus = TypeService.AxiosNoConexion
          console.log('Error de Conexion con API')
        } else {
          console.log('Ocurrio un error, intente mas tarde')
          AxiosResponse.respuestaStatus = TypeService.AxiosApi500
        }

        return AxiosResponse
      }

}

// Función para hacer peticiones HTTP
export const AxiosData = async ({ endpoint, method, body, queryString }) => {
  const urlApi = `${configGlobal.urlApiIbero}${endpoint}`;

  const AxiosResponse = {
    data: null,
    respuestaStatus: null,
    message: "",
    success: 0,
  };

  try {
    let response;

    // Lógica para manejar diferentes métodos HTTP
    switch (method) {
      case "LOGINEXTERNO":
        response = await axios.post(
          `${configGlobal.urlApiGestion}${endpoint}`,
          body
        );
        break;
      case "LOGINACCESOSDIT":
        response = await axios.post(
          `${configGlobal.urlApiGestion}${endpoint}`,
          body
        );
        break;
      case "GETDIT":
        response = await axios.get(`${configGlobal.urlApiGestion}${endpoint}`, {
          params: queryString,
        });
        break;
      case "POST":
        response = await axios.post(urlApi, body);
        break;
      case "GET":
        response = await axios.get(urlApi, {
          params: queryString,
        });
        break;
      default:
        throw new Error("Unsupported HTTP method");
    }

    const { data, success, message } = response.data;
    AxiosResponse.data = data;
    AxiosResponse.message = message;
    AxiosResponse.success = success;
    AxiosResponse.respuestaStatus =
      success == 1 ? TypeService.AxiosApiOk : TypeService.AxiosApiOkFail;
  } catch (error) {
    // El interceptor ya manejó UI/loading/snackbar/logout
    AxiosResponse.message = error.message || "Error inesperado";
    AxiosResponse.success = 0;
    AxiosResponse.respuestaStatus = TypeService.AxiosApiOkFail;
  }
  return AxiosResponse;
};
