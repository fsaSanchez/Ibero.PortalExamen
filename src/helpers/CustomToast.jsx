import { toast } from 'react-toastify';

export const customToast = (type, message, autoClose = 1500) => {
  if (toast[type]) {
    toast[type](message, { autoClose });
  } else {
    console.error("Tipo de notificación no soportado");
  }
};
