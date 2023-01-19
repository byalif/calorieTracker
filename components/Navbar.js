// eslint-disable-next-line react-hooks/exhaustive-deps
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles/Nav.module.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { SET_NAME } from "../redux/reducers/profile.js";
import { AppContext } from "./context.js";
import { useContext } from "react";

const Navbar = () => {
  const router = useRouter();
  const { setiD, iD } = useContext(AppContext);
  useEffect(() => {
    if (localStorage.getItem("id")) {
      setiD(localStorage.getItem("id"));
    }
  }, []);

  return (
    <div className={styles.contTOP}>
      <div className={styles.cont}>
        <div className={styles.leftSide}>
          <div
            onClick={() => {
              router.push("/");
            }}
          >
            <Link style={{ color: "#ffffff", textDecoration: "none" }} href="/">
              Home
            </Link>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div
            onClick={() => {
              router.push(iD ? "/profile" : "/register");
            }}
          >
            <Link
              style={{ color: "#ffffff", textDecoration: "none" }}
              href={iD ? "/profile" : "/register"}
            >
              {iD ? "Profile" : "Register"}
            </Link>
          </div>
          {iD ? (
            <div
              style={{ color: "#ffffff", textDecoration: "none" }}
              onClick={() => {
                axios
                  .post("https://cal-tracker.herokuapp.com/deleteCookie", {
                    withCredentials: true,
                  })
                  .then((x) => {
                    localStorage.removeItem("id");
                    setiD(null);
                    console.log(x);
                    router.push("/");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Logout
            </div>
          ) : (
            <div
              style={{ color: "#ffffff", textDecoration: "none" }}
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
