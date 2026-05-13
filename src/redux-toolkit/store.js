import { combineReducers, configureStore } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"; //esto usa localstorage por defecto
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { uiSlice } from "../ui/store";
import { authSlice } from "../Auth/store/authSlice";
import { documentosStaticSlice } from "../components/DocumentosStatic/Store/Static_slice";

//Configuracion de persistencia
const persistConfig ={
    key: "root",
    storage,
    blacklist: [""], //Que no presista en todo el sitio el estado global de los menus
}

//se combinana todos los reducers
const rootReducer = combineReducers({
    ui: uiSlice.reducer,    
  auth: authSlice.reducer,
documentosStatic: documentosStaticSlice.reducer,
})


const persisReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer: persisReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
});

// Crea el persistor
export const persistor = persistStore(store);
