import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { backendUrl } from "../utils/config";
const Logout = () => {
  //   const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        // history.push("/login", { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return useEffect();
};
export default Logout;
