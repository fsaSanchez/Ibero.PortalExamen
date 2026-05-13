import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documentosStatic: [],
  documentosStaticMetadatos: [],
  loading: false,
  error: null,
  structuraAreas: [],
};


export const documentosStaticSlice = createSlice({
    name: 'documentosStatic',
  initialState,
    reducers: {
        setDocumentosStatic: (state, {payload}) => {
            state.documentosStatic = payload;
        },
        setDocumentosStaticMetadatos: (state, {payload}) => {
            state.documentosStaticMetadatos = payload;
        },

        cleanDocumentsStatic: () => {
            return initialState;
        },

         setstructuraStatic: (state, {payload}) => {
            state.structuraAreas = payload;
        },
        
    },
});

export const { setDocumentosStatic, cleanDocumentsStatic,setstructuraStatic, setDocumentosStaticMetadatos} = documentosStaticSlice.actions;
