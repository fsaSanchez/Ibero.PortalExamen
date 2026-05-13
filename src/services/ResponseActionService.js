import Swal from "sweetalert2"
import { logout } from "../Auth/store"
import { startRefreshToken } from "../Auth/store/auth_thunk"
import { TypeService } from "./TypeService"
import { SnackbarUtilities } from "../utilities/snackbar-manager"


export const ManageAxiosResponse = (response) => {
    return async (dispatch) => {
      console.log(response);
      switch (response.respuestaStatus) {
        case TypeService.AxiosApi401:
            AlertTokenNovalido()
            dispatch(logout())
            // dispatch(uiModalClose())
            break
        case TypeService.AxiosNoConexion: // Error de conexion con el APi
            Swal.fire({
            icon: 'error',
            title: 'Mensaje del sistema',
            text: 'Error de conexión con API..',
            backdrop: true,
            })
            break
        case TypeService.AxiosApi500: //Error interno en el API (Revisar log en en esta)
            Swal.fire({
            icon: 'error',
            title: 'Mensaje del sistema',
            text: 'Ocurrió un error en el servidor remoto, intente más tarde.',
            backdrop: true,
            })
  
            break
        case TypeService.AxiosApiOkFail: //Peticion correcta, pero exito en 0 (Error controlado en API)
           SnackbarUtilities.info(response.message);
        break
        default:
        // Error generico. Cuando no se captura el estaus devuelto por el API
  
        Swal.fire({
          icon: 'error',
          title: 'Mensaje del sistema',
          text: 'Ocurrió un error, intente más tarde.',
          backdrop: true,
        })
  
        break
    }
    }
}

export const RefreshIsRequared = () => {
  return async (dispatch) => {
      dispatch(startRefreshToken())
  }
}

export const FinalMessage = (Mensaje) => {
  
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      // timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  
    Toast.fire({
      icon: "success",
      title: `${Mensaje}`,
    });
  
};

export const AlertTokenNovalido = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      // timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })
  
    Toast.fire({
      icon: 'info',
      title: 'Sesión Terminada',
    })
    console.log('limpiamos localstorage')
    localStorage.clear()
};