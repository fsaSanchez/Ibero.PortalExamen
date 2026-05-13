import { useState, useCallback } from 'react';
import moment from 'moment';
import { MARGEN_DIAS_HABILES } from '../constants/examenGrado.constants';

/**
 * Calcula días hábiles (lun–vie) entre hoy y una fecha meta.
 * Expone `diasHabiles` y el flag `enMargenCritico` (10 u 11 días).
 */
export const useDiasHabiles = () => {
  const [diasHabiles,     setDiasHabiles]     = useState(null);
  const [enMargenCritico, setEnMargenCritico] = useState(false);

  const calcular = useCallback((fechaMeta) => {
    if (!fechaMeta) {
      setDiasHabiles(null);
      setEnMargenCritico(false);
      return null;
    }

    const hoy  = moment().startOf('day');
    const meta = moment(fechaMeta).startOf('day');

    if (!meta.isValid() || meta.isBefore(hoy)) {
      setDiasHabiles(null);
      setEnMargenCritico(false);
      return null;
    }

    let conteo  = 0;
    const cursor = hoy.clone();

    while (cursor.isBefore(meta)) {
      const dow = cursor.isoWeekday(); // 1=lun … 7=dom
      if (dow >= 1 && dow <= 5) conteo++;
      cursor.add(1, 'day');
    }

    const critico = MARGEN_DIAS_HABILES.includes(conteo);
    setDiasHabiles(conteo);
    setEnMargenCritico(critico);
    return conteo;
  }, []);

  const limpiar = useCallback(() => {
    setDiasHabiles(null);
    setEnMargenCritico(false);
  }, []);

  return { diasHabiles, enMargenCritico, calcular, limpiar };
};
