export const obtenerOpcionesCatalogo = (data, idCampo) => {
  const campo = data.find(x => x.idCampo === idCampo);

  if (!campo) return [];

  if (campo.opcionesCatalogo && campo.opcionesCatalogo.length > 0) {
    return campo.opcionesCatalogo;
  }

  if (campo.opciones) {
    try {
      // Convierte el string "{1:'Vo.bo', 2:'Firmado'}" en un objeto real
      const opcionesObj = JSON.parse(
        campo.opciones
          .replace(/(\w+):/g, '"$1":') // agrega comillas a las claves
          .replace(/'/g, '"') // cambia comillas simples por dobles
      );

      // Transforma en array [{ value, label }]
      return Object.entries(opcionesObj).map(([key, value]) => ({
        value: key,
        label: value
      }));
    } catch (e) {
      console.error("Error al parsear opciones:", e);
    }
  }

  return [];
};





