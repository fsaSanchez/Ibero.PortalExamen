import { ErrorMessage, Field, Form, Formik } from "formik";
// import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

import "../styles/styles_login.css";
import { ID_TIPO_STUDENT, RECAPTCHA_SITE_KEY } from "../../config";
import { startLoginExterno } from "../store";
import { useNavigate } from "react-router-dom";

export const AuthStudent = ({ profileId/*, hideRecaptchaBadge */ }) => {
  // const [token, setToken] = useState("");

  let formData = {
    cuenta: "231832",
    digito: "8",
    password: "Prueba$1",
  };

  const navigate = useNavigate();

  ///Si es produccion, quita el usuario pruebas
  if (
    window.location.href.includes("https://prestamoequipo.ibero.mx/") ||
    window.location.href.includes("https://prestamoequipodes.ibero.mx/") ||
    window.location.href.includes("https://prestamoequipopru.ibero.mx/")
  ) {
    formData = {
      cuenta: "",
      digito: "",
      password: "",
    };
  }

  const requerido = "Este campo es requerido";

  // const [usuario, setUser] = useState(false);

  const dispatch = useDispatch();

  return (
    <div className="mt-5">
      <Formik
        initialValues={formData}
        onSubmit={({ cuenta, digito, password }) => {
          try {
            const idTipoUsuario = ID_TIPO_STUDENT;
            const executeRecaptcha = async () => {
              const token = await window.grecaptcha.execute(
                RECAPTCHA_SITE_KEY,
                { action: "submit" }
              );
              // setToken(token);
              if (token !== "") {
                dispatch(
                  startLoginExterno({
                    account: cuenta,
                    digit: digito,
                    password,
                    profileId,
                    token,
                    navigate,
                    idTipoUsuario,
                  })
                );
                // hideRecaptchaBadge();
              }
            };
            executeRecaptcha();
          } catch (err) {
            console.log(err);
            // setToken("");
          }
        }}
        validationSchema={Yup.object({
          cuenta: Yup.string().required(requerido),
          digito: Yup.string().required(requerido),
          password: Yup.string().required(requerido),
        })}
      >
        {() => (
          <Form noValidate>
            <div className="row">
              <div className="col sm-6 col-md-6 mb-4">
                <div className="form-group">
                  <label htmlFor="cuenta" className="color-title">
                    Número de cuenta
                  </label>
                  <Field
                    className="form-control form-control-login mb-0"
                    name="cuenta"
                    placeholder="Cuenta"
                    required
                  />
                  <ErrorMessage
                    name="cuenta"
                    component="span"
                    className="text-danger"
                    role="alert"
                  />
                </div>
              </div>
              <div className="col sm-6 col-md-6 mb-4">
                <div className="form-group">
                  <label htmlFor="digito" className="color-title">
                    Dígito verificador
                  </label>
                  <Field
                    className="form-control form-control-login mb-0"
                    name="digito"
                    placeholder="Dígito verificador"
                    required
                  />
                  <ErrorMessage
                    name="digito"
                    component="span"
                    className="text-danger"
                    role="alert"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col sm-12 col-md-12">
                <label htmlFor="password" className="color-title">
                  Contraseña
                </label>
                <Field
                  className="form-control form-control-login mb-0"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-danger"
                  role="alert"
                />
              </div>
            </div>

            <div className="row">
              <div className="content-btn -mrgnTop-1r mt-5">
                <input
                  className="ingresar-btn"
                  type="submit"
                  value="Ingresar"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
