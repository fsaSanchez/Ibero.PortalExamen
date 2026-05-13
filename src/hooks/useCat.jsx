import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { uiFinishLoading, uiStartLoading } from "../ui/store";
import { ManageAxiosResponse, RefreshIsRequared } from "../services/ResponseActionService";
import { TypeService } from "../services/TypeService";
import { AxiosDataToken } from "../services/AxiosConnexion";

export const UseCat = (routeCat, filter) => {

    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    //Util para indicar si esta caragando aun la info
    const [loadingData, setLoadingData] = useState(false);
    //Util para indicarle al Hook que debe refrescar la info,por eso la depencia en el efecto
    const [refresh, setRefresh] = useState(false);

    const getCat = async (_routeCat) => {
        dispatch(uiStartLoading("Cargando Catalogo.."));

        const resp = await AxiosDataToken(
            _routeCat,
            "get",
            null,
            filter
        );
        
        dispatch(uiFinishLoading());
        if (resp.refresh) {
            dispatch(RefreshIsRequared());
        }

        //Si la respuesta es correcta,Aqui va codigo propio de las siguientes accioes a realizar
        if (resp.respuestaStatus === TypeService.AxiosApiOk) {
            return resp.data;
        }
        // administra las respuestas del api en caso de no ser exitosa
        else {
            dispatch(ManageAxiosResponse(resp));
        }

        return null;
    };

    useEffect(() => {
        const CatData = async () => {
            setLoadingData(true);
            const datax = await getCat(routeCat);
            setData(datax);
            setLoadingData(false);
        };
        CatData();
    }, [routeCat, refresh]);

    return [loadingData, data, setRefresh, refresh, setData];
};
