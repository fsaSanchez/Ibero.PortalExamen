import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading:false,
    msgError:null,
    MensajeLoader: "", 
    modalIsOpen: false,
}
export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        uiSetError: (state,  action ) => {
            state.msgError = action.payload;
        },

        uiRemoveError:( state, /* action */ ) => {
            state.msgError = null;
        },

        uiStartLoading:( state, action ) => {
            state.loading = true;
            state.MensajeLoader = action.payload;
        },

        uiFinishLoading:( state, /* action */ ) => {
            state.loading = false;
            state.MensajeLoader = "";
        },

        uiModalOpen:( state, /* action */ ) => {
            state.modalIsOpen = true;
        },

        uiModalClose: ( state ) => {
            state.modalIsOpen = false;
        }
    }
});

// Action creators are generated for each case reducer function
export const { uiSetError, uiRemoveError, uiStartLoading, uiFinishLoading, uiModalOpen, uiModalClose } = uiSlice.actions;