import Head from "next/head";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Inter } from "@next/font/google";
import styles from "@/styles/Login.module.css";
import { useRouter } from "next/router";
import axios from "axios";

// const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const [err, setErr] = useState(false);
  const er = useRef(null);
  const router = useRouter();
  const [info, setInfo] = useState({
    username: "",
    email: "",
    goal: "Fat Loss",
    age: 0,
    height: 0,
    gender: "Male",
    weight: 0,
    activity: "Sedentary",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };
  const login = () => {
    router.push("/login");
  };

  const isNum = (num) => {
    let val = num + "";
    return val.match(/^[0-9]+$/);
  };
  const register = () => {
    setLoading(true);
    if (
      info.username === "" ||
      info.email === "" ||
      info.password === "" ||
      !isNum(info.age) ||
      !isNum(info.height) ||
      !isNum(info.weight)
    ) {
      setErr(true);
      return;
    }
    console.log(info);
    axios
      .post("https://cal-tracker.herokuapp.com/createUser", info)
      .then((x) => {
        setErr(false);
        router.push("/login");
        console.log(x);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.cont}>
      <div className={styles.loginCont}>
        <h3>Sign up!</h3>
        <hr style={{ width: "100%" }} />
        <label htmlFor="">Username</label>
        <input
          onChange={handleSubmit}
          value={info.username}
          name="username"
          type="text"
        />
        <label htmlFor="">Email</label>
        <input
          onChange={handleSubmit}
          value={info.email}
          name="email"
          type="text"
        />
        <label htmlFor="">Age</label>
        <input
          onChange={handleSubmit}
          value={info.age}
          name="age"
          type="text"
        />
        <label htmlFor="">Gender</label>
        <div class="select-wrapper">
          <select
            onChange={handleSubmit}
            value={info.gender}
            name="gender"
            type="text"
            class="select"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <label htmlFor="">Activity</label>
        <div class="select-wrapper">
          <select
            onChange={handleSubmit}
            value={info.activity}
            name="activity"
            type="text"
            defaultValue="Sedentary"
            class="select"
          >
            <option name="activity" value="Sedentary">
              Sedentary
            </option>
            <option name="activity" value="Lightly Active">
              Lightly Active
            </option>
            <option name="activity" value="Moderately Active">
              Moderately Active
            </option>
            <option name="activity" value="Very Active">
              Very Active
            </option>
            <option name="activity" value="Extremely Active">
              Extremely Active
            </option>
          </select>
        </div>
        <label htmlFor="">Goal</label>
        <div class="select-wrapper">
          <select
            onChange={handleSubmit}
            value={info.goal}
            name="goal"
            type="text"
            class="select"
          >
            <option value="Fat Loss">Fat Loss</option>
            <option value="Weight Gain">Weight Gain</option>
          </select>
        </div>
        <label htmlFor="">Height (in.)</label>
        <input
          onChange={handleSubmit}
          value={info.height}
          name="height"
          type="text"
        />
        <label htmlFor="">Weight (lb)</label>
        <input
          onChange={handleSubmit}
          value={info.weight}
          name="weight"
          type="text"
        />
        <label htmlFor="">Password</label>
        <input
          onChange={handleSubmit}
          value={info.password}
          name="password"
          type="password"
        />
        <label
          ref={er}
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#e88680",
            display: `${!err ? "none" : "block"}`,
          }}
          htmlFor=""
        >
          Please enter correct inputs!
        </label>
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}
