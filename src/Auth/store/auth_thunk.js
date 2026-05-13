import { appIdConfig, ID_TIPO_EMPLEADO } from "../../config";
import {
  AxiosData,
  AxiosDataToken,
  AxiosLoginData,
} from "../../services/AxiosConnection";
import { ManageAxiosResponse } from "../../services/ResponseActionService";
import { TypeService } from "../../services/TypeService";
import { uiFinishLoading, uiStartLoading, uiModalClose } from "../../ui/store";
import {
  LocalStorageKeys,
  persistLocalStorageGeneral,
} from "../../utilities/localStorage.utility";
import { SnackbarUtilities } from "../../utilities/snackbar-manager";
import {
  login,
  loginCheckingFinish,
  logout,
  setMenuProfile,
  setProfilesInfo,
} from "./authSlice";
import { toast } from "react-toastify";

export const startLoadingProfilesApp = () => {
  return async (dispatch) => {
    const appId = appIdConfig;
    dispatch(uiStartLoading("Iniciando Sesión..."));

    // const resp = await AxiosData({
    //   endpoint: "Auth/ProfilesByAppId",
    //   method: "GETDIT",
    //   body: null,
    //   queryString: { appId }, // Puedes omitir esto si es null o undefined
    // });

    const resp = await AxiosLoginData("Auth/ProfilesByAppId", "get", null, {
      appId,
    });

    dispatch(uiFinishLoading());

    if (resp.respuestaStatus === TypeService.AxiosApiOk) {
      dispatch(setProfilesInfo(resp.data));
    }
  };
};

export const startLoginExterno = (
  account,
  digit,
  password,
  profileId,
  navigate,
  idTipoUsuario,
) => {
  return async (dispatch, getState) => {
    dispatch(uiStartLoading("Iniciando Sesión..."));

    const idDetApp = appIdConfig;

    // const resp = await AxiosData({
    //   endpoint: "Auth/LoginExterno",
    //   method: "LOGINEXTERNO",
    //   body: { account, digit, password, idDetApp, profileId, idTipoUsuario },
    //   queryString: null, // Puedes omitir esto si es null o undefined
    // });

    const resp = await AxiosLoginData("Auth/LoginExterno", "post", {
      account,
      digit,
      password,
      idDetApp,
      profileId,
      idTipoUsuario,
    });

    dispatch(uiFinishLoading());

    if (resp.respuestaStatus === TypeService.AxiosApiOk) {
      const expiryToke = JSON.parse(atob(resp.data.token.split(".")[1])).exp;
      const expiryRefreshToke = JSON.parse(
        atob(resp.data.refreshToken.split(".")[1]),
      ).exp;

      // Almacena los tokens y sus fechas de expiración en el localStorage
      persistLocalStorageGeneral(LocalStorageKeys.TOKEN, resp.data.token);
      persistLocalStorageGeneral(LocalStorageKeys.TOKEN_EXP_DATE, expiryToke);
      persistLocalStorageGeneral(
        LocalStorageKeys.REFRESH_TOKEN,
        resp.data.refreshToken,
      );
      persistLocalStorageGeneral(
        LocalStorageKeys.TOKEN_REFRESH_EXP_DATE,
        expiryRefreshToke,
      );

      dispatch(
        login({
          token: resp.data.token,
          roleid: resp.data.profileId,
          // mapping: resp.data[0].mapping,
          isAuthenticated: true,
          perfil: {
            nombre: resp.data.userName,
            userName: resp.data.email,
            role: resp.data.profile,
          },
          profileId: resp.data.profileId,
        }),
      );

      navigate("/dashboard");
      //SnackbarUtilities.success(`Bienvenido/a ${resp.data.userName} `);
      toast.success(`Bienvenido/a ${resp.data.userName} `);
    } else {
      dispatch(ManageAxiosResponse(resp));
    }
  };
};

export const startRefreshToken = () => {
  return async (dispatch, getState) => {
    dispatch(uiStartLoading("Validando Sesión..."));

    const resp = await AxiosData({
      endpoint: "Auth/refreshToken",
      method: "GETDIT",
      body: null,
      queryString: null, // Puedes omitir esto si es null o undefined
    });

    // let jsonSt = JSON.stringify(refresh);
    // const resp = JSON.parse(jsonSt);
    dispatch(uiFinishLoading());
    if (resp.respuestaStatus === TypeService.AxiosApiOk) {
      const expiryToke = JSON.parse(atob(resp.data.token.split(".")[1])).exp;
      const expiryRefreshToke = JSON.parse(
        atob(resp.data.refreshToken.split(".")[1]),
      ).exp;

      persistLocalStorageGeneral(LocalStorageKeys.TOKEN, resp.data.token);
      persistLocalStorageGeneral(LocalStorageKeys.TOKEN_EXP_DATE, expiryToke);
      persistLocalStorageGeneral(
        LocalStorageKeys.REFRESH_TOKEN,
        resp.data.refreshToken,
      );
      persistLocalStorageGeneral(
        LocalStorageKeys.TOKEN_REFRESH_EXP_DATE,
        expiryRefreshToke,
      );
    } else if (resp.respuestaStatus === TypeService.AxiosApi401) {
      dispatch(startLogout());
    } else {
      dispatch(loginCheckingFinish());
      SnackbarUtilities.error(
        "Error",
        "Ocurrio un error, intente mas tarde",
        "error",
      );
    }
  };
};

export const startGetMenuRoutes = (profileId) => {
  return async (dispatch, getState) => {
    const appId = appIdConfig;

    dispatch(uiStartLoading("Cargando rutas..."));

    const resp = await AxiosData({
      endpoint: "MenuRouter/MenuService",
      method: "GETDIT",
      body: null,
      queryString: { appId, profileId },
    });

    dispatch(uiFinishLoading());

    if (resp.respuestaStatus === TypeService.AxiosApiOk) {
      const dynamicRoutes = remapRoutes(resp.data);
      console.log("allResults", dynamicRoutes);
      dispatch(setMenuProfile(dynamicRoutes));
    } else {
      dispatch(setMenuProfile([]));
      dispatch(ManageAxiosResponse(resp));
    }
  };
};

const remapRoutes = (data) => {
  if (!data) return [];
  return data.map((item) => ({
    path: item.Path || item.path,
    element: item.Element || item.element,
    label: item.Permission || item.permission,
    icono: item.Icono || item.icono,
  }));
};

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(logout());
    dispatch(uiModalClose());
  };
};
