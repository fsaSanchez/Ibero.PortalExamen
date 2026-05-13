import Swal from 'sweetalert2';

/**
 * Muestra un modal de confirmación para eliminar un registro.
 * Devuelve una promesa que resuelve a `true` si se confirma, o `false` si se cancela.
 * @param {string} text - El texto que se mostrará en la alerta (opcional).
 * @returns {Promise<boolean>}
 */
export const showConfirmAlert = async (text,buttontext) => {
  
  // Usamos 'await' para esperar la interacción del usuario
  const result = await Swal.fire({
  

    title: "¿Estás seguro?",
    text: text,
    icon: 'question',
    showCancelButton: true,
     cancelButtonColor: '#bdbfc0ff',
    confirmButtonColor: '#8A0013', // Tu color rojo para confirmar
    confirmButtonText: buttontext,
    cancelButtonText: 'Cancelar',
    // reverseButtons: true // Opcional: A veces es útil poner Cancelar a la izquierda
  });

  // Swal.fire devuelve un objeto 'result'.
  // 'result.isConfirmed' será true si presionan "Sí, eliminar"
  // y false si presionan "Cancelar" o cierran el modal.
  return result.isConfirmed;
};