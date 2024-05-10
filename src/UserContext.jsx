import React, { Children, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TOKEN_POST,
  TOKEN_VALIDATE_POST,
  TOKEN_VALIDATE_POST,
  USER_GET,
} from "./api";

export const UserContext = React.createContext();

export const UserStorage = ({ Children }) => {
  const [data, setData] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  //resetando metricas ao valor inicial para o logout do usario
  const userLogout = useCallback(
    async function () {
      setData(null);
      setError(null);
      setLoading(false);
      setLogin(false);
      window.localStorage.removeItem("token");
      navigate("/login");
    },
    [navigate]
  );

  //Etapa de realização do login
  async function getUser(token) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setLogin(true);
  }

  async function userLogin(username, password) {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = TOKEN_POST({ username, password });
      const tokenRes = await fetch(url, options);
      if (!tokenRes.ok) throw new Error(`Error: ${tokenRes.statusText}`);
      //Extraindo o valor da chave token por desestruturação
      const { token } = await tokenRes.json();
      window.localStorage.setItem("token", token);
      await getUser(token);
      navigate("/conta");
    } catch (err) {
      setError(err.message);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }
  //Autologin, usuario permanece logado mesmo se recarregar a página.
  useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getIten("token");
      if (token) {
        try {
          // setError e setLoading inicializam desta maneira quando o suario faz o login:
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE_POST(token);
          const response = await fetch(url, options);
          //throw new Error() interrompe a execução do código e sinalizando que algo deu errado.
          if (!response.ok) throw new Error("token invalido");
          await getUser(token);
          const json = await response.json();
        } catch (err) {
          userLogout();
        } finally {
          setLoading(false);
        }
      }
    }
    autoLogin();
  }, [userLogout()]);

  return (
    <UserContext.Provider
      value={{ userLogin, userLogout, data, error, loading, login }}
    >
      {Children}
    </UserContext.Provider>
  );
};

export default UserContext;
