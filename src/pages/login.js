import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { Inter } from "@next/font/google";
import styles from "@/styles/Login.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { AppContext } from "../components/context.js";
import { useContext } from "react";

export default function Login() {
  const router = useRouter();
  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { setiD, iD } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };
  const login = async () => {
    try {
      let response = await fetch(`https://cal-tracker.herokuapp.com/login`, {
        method: "POST",
        credentials: "include", //--> send/receive cookies
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const x = await response.json();
      console.log(x);
      if (x.ID) {
        setiD(x.ID);
        localStorage.setItem("id", x.ID);
        localStorage.setItem("token", x.token);
        router.push("/profile");
      }
    } catch (error) {
      console.log(error);
    }

    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   withCredentials: true,
    // };
    // axios
    //   .post("https://cal-tracker.herokuapp.com/login", info, config)
    //   .then((x) => {
    //     if (x.data.ID) {
    //       setiD(x.data.ID);
    //       localStorage.setItem("id", x.data.ID);
    //       router.push("/profile");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const register = () => {
    router.push("/register");
  };

  return (
    <div className={styles.cont}>
      <div className={styles.loginCont}>
        <h3>Login</h3>
        <hr style={{ width: "100%" }} />
        <label htmlFor="">Username</label>
        <input
          onChange={handleSubmit}
          value={info.username}
          name="username"
          type="text"
        />
        <label htmlFor="">Password</label>
        <input
          onChange={handleSubmit}
          value={info.password}
          name="password"
          type="password"
        />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
