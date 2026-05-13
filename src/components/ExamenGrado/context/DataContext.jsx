import React, { createContext, useContext, useReducer, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// 1. DATA INICIAL
// ─────────────────────────────────────────────────────────────
const INITIAL_SOLICITUDES = [
  {
    id:1, folio:"SOL-2025-001", nombre:"García López María",
    fecha:"05/04/2025", programa:"Maestría en Administración",
    tipo:"individual", status:"confirmed", alumnos:[],
    observaciones:[{ id:1, texto:"Documentos entregados correctamente.", tipo:"general", fecha:"06/04/2025 10:30", autor:"Admón." }],
  },
  {
    id:2, folio:"SOL-2025-002", nombre:"Examen General – Administración",
    fecha:"10/04/2025", programa:"Maestría en Administración",
    tipo:"general", status:"inconclusa",
    alumnos:[
      { id:1, nombre:"Pérez Morales Juan",  cuenta:"2021001234", programa:"Maestría en Administración" },
      { id:2, nombre:"Ramírez Díaz Laura",  cuenta:"2021005678", programa:"Maestría en Administración" },
    ],
    observaciones:[
      { id:1, texto:"Falta firma en planta de sinodales.", tipo:"general", fecha:"11/04/2025 09:00", autor:"Admón." },
      { id:2, texto:"Recibo de biblioteca vencido.", tipo:"alumno", alumnoNombre:"Ramírez Díaz Laura", fecha:"11/04/2025 09:05", autor:"Admón." },
    ],
  },
  {
    id:3, folio:"SOL-2025-003", nombre:"Torres Vega Ana",
    fecha:"08/04/2025", programa:"Maestría en Ingeniería",
    tipo:"individual", status:"pending", alumnos:[], observaciones:[],
  },
  {
    id:4, folio:"SOL-2025-004", nombre:"Examen General – Ciencias",
    fecha:"01/04/2025", programa:"Doctorado en Ciencias",
    tipo:"general", status:"rechazada",
    alumnos:[
      { id:1, nombre:"López Sánchez Carlos",  cuenta:"2020009999", programa:"Doctorado en Ciencias" },
      { id:2, nombre:"Mendoza Flores Sofía",  cuenta:"2020001234", programa:"Doctorado en Ciencias" },
    ],
    observaciones:[{ id:1, texto:"Documentación incompleta. Reenviar con V.A. firmados.", tipo:"general", fecha:"02/04/2025 14:20", autor:"Admón." }],
  },
  {
    id:5, folio:"SOL-2025-005", nombre:"Vargas Romo Pedro",
    fecha:"12/04/2025", programa:"Doctorado en Filosofía",
    tipo:"individual", status:"pending", alumnos:[], observaciones:[],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. DATA CONTEXT
// ─────────────────────────────────────────────────────────────
export const DataContext = createContext(null);

function dataReducer(state, action) {
  switch (action.type) {
    case "SET_STATUS": {
      return state.map(s => s.id === action.id ? { ...s, status: action.status } : s);
    }
    case "REMOVE_ALUMNO": {
      return state.map(s => s.id === action.solId
        ? { ...s, alumnos: s.alumnos.filter(a => a.id !== action.alumnoId) }
        : s);
    }
    case "ADD_OBS": {
      return state.map(s => s.id === action.solId
        ? { ...s, observaciones: [...s.observaciones, action.obs] }
        : s);
    }
    case "REMOVE_OBS": {
      return state.map(s => s.id === action.solId
        ? { ...s, observaciones: s.observaciones.filter(o => o.id !== action.obsId) }
        : s);
    }
    default: return state;
  }
}

export function DataProvider({ children }) {
  const [solicitudes, dispatch] = useReducer(dataReducer, INITIAL_SOLICITUDES);

  const setStatus    = useCallback((id, status)             => dispatch({ type:"SET_STATUS",    id, status }), []);
  const removeAlumno = useCallback((solId, alumnoId)        => dispatch({ type:"REMOVE_ALUMNO", solId, alumnoId }), []);
  const addObs       = useCallback((solId, obs)             => dispatch({ type:"ADD_OBS",       solId, obs }), []);
  const removeObs    = useCallback((solId, obsId)           => dispatch({ type:"REMOVE_OBS",    solId, obsId }), []);

  return (
    <DataContext.Provider value={{ solicitudes, setStatus, removeAlumno, addObs, removeObs }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
