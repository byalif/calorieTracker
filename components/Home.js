import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { data as dta } from "/data.js";
import { BiSearch } from "react-icons/bi";
import { PieChart } from "react-minimal-pie-chart";
import { useRouter } from "next/router";

const Home = () => {
  const [userId, setUserId] = useState(0);
  const [slots, setSlots] = useState([]);
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const router = useRouter();
  const [info, setInfo] = useState({ fat: 0, carbs: 0, protein: 0 });

  const [searchTerm, setSearchTerm] = useState("");
  const [newFood, setNewFood] = useState({
    ID: 0,
    name: "",
    calories: 0,
    ingredients: [],
  });

  const onTxt = (e) => {
    setNewFood({
      ...newFood,
      [e.target.name]: e.target.value,
    });
  };

  const [data, setData] = useState(dta);
  const [display, setDisplay] = useState(dta);
  const [bmr, setBmr] = useState(0);
  const [tde, setTde] = useState(0);
  const [calories, setCalories] = useState(0);
  const [weightNeeded, setWeightNeeded] = useState(0);
  const [tags, setTags] = useState([]);
  const map = new Map();
  map.set("Sedentary", 1.2);
  map.set("Lightly Active", 1.4);
  map.set("Moderately Active", 1.55);
  map.set("Very Active", 1.725);
  map.set("Extremely Active", 1.9);

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== "") {
      setTags([...tags, { name: event.target.value }]);
      event.target.value = "";
    }
  };

  useEffect(() => {
    setNewFood({
      ...newFood,
      ingredients: tags,
    });
  }, [tags]);

  const addFood = () => {
    setFoodLoading(true);
    let str = "";
    tags.forEach((x) => {
      str += x.name + " ";
    });

    axios
      .post("https://cal-tracker.herokuapp.com/addFood", {
        name: newFood.name,
        calories: newFood.calories + "",
        userId: data.ID + "",
        ingredients: str,
      })
      .then((x) => {
        fetchData(0);
        setTme(last7Days(0));
        setFoodLoading(false);
        console.log(x.data);
      })
      .catch((err) => {
        console.log(err);
      });

    setTags([]);
    setNewFood({
      ID: 0,
      name: "",
      calories: 0,
      ingredients: [],
    });
  };

  const month = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];

  let arr = [
    "#a12828",
    "#c2664f",
    "#d6844d",
    "#ff9900",
    "#cc861d",
    "#d6d600",
    "#aed904",
    "#70a81b",
    "#5ba32a",
    "#428f2f",
    "#267a26",
  ];
  let idx = 0;

  function last7Days(minus) {
    let sdays = new Date(Date.now() - minus * 24 * 60 * 60 * 1000);
    let str7 = month[sdays.getMonth()] + " " + sdays.getDate();
    return str7;
  }
  const [tme, setTme] = useState(last7Days(0));
  const calcBMR = ({ gender, age, height, weight }) => {
    const heightCM = height * 2.54;
    const weightKG = weight / 2.2;
    if (gender === "male") {
      return 66 + 13.7 * weightKG + 5 * heightCM - 6.8 * age;
    } else {
      return 655 + 9.6 * weightKG + 1.8 * heightCM - 4.7 * age;
    }
  };

  const calcTDE = ({ activity, bmr }) => {
    return bmr * map.get(activity);
  };

  const search = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    let val = searchTerm.trim();
    if (val === "") {
      val = "6910";
    }
    axios
      .get(`https://cal-tracker.herokuapp.com/filter/${val}/${data.ID}`)
      .then((x) => {
        if (x.data == null) {
          setDisplay({ ...display, food: [] });
        } else {
          const arr = { data: { food: x.data } };
          const map2 = new Map();
          mapCalc(arr, map2, 0);
          setDisplay({ ...x.data, food: !map2.get(tme) ? [] : map2.get(tme) });
        }
      })
      .then((err) => {
        // console.log(err);
      });
  }, [searchTerm]);

  const removeFood = (id) => {
    setFoodLoading(true);
    axios
      .get(`https://cal-tracker.herokuapp.com/removeFood/${id}`)
      .then((x) => {
        let obj = data.food;
        obj = obj.filter((item) => item.ID !== id);
        getPie(obj);
        setData({ ...data, food: obj });
        setDisplay({ ...display, food: obj });
        setFoodLoading(false);
        setIsLoading(false);
        console.log(x.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const mapCalc = (x, map2, minus) => {
    x.data.food.forEach((w) => {
      let arr = w.CreatedAt.split("-");
      let mnth = month[arr[1][0] == "0" ? arr[1][1] - 1 : arr[1] - 1];
      let day = parseInt(arr[2].substring(0, 2)) - 1;
      let date = mnth + " " + day;
      if (map2.has(date)) {
        map2.set(date, [...map2.get(date), w]);
      } else {
        map2.set(date, [w]);
      }
    });
    let d = new Date(Date.now() - minus * 24 * 60 * 60 * 1000);
    let str = month[d.getMonth()] + " " + d.getDate();
    return str;
  };

  const setInfoFunc = async (key) => {
    setLoadingSpinner(true);
    const response = await axios.get(
      `https://calorieninjas.p.rapidapi.com/v1/nutrition/?query=${key.name}`,
      {
        headers: {
          "X-RapidAPI-Key":
            "f77f70dfeamsh4b38dff7c935ef8p14df84jsn016169d6b53a",
          "X-RapidAPI-Host": "calorieninjas.p.rapidapi.com",
        },
      }
    );
    return { response, calories: key.calories };
  };

  const getPie = (dta) => {
    let arrr = [];
    // setInfo({ carbs: 0, protein: 0, fat: 0 });
    dta.forEach((gd) => {
      arrr.push(setInfoFunc(gd));
    });
    setLoadingSpinner(true);
    if (arrr.length == 0) setLoadingSpinner(false);
    Promise.all(arrr)
      .then((r) => {
        setInfo((info) => {
          let fat = 0;
          let carbs = 0;
          let protein = 0;
          r.forEach((res) => {
            let response = res.response;
            if (response.data.items[0]) {
              let cal =
                parseInt(res.calories) / response.data.items[0]?.calories;
              fat += cal * response.data.items[0]?.fat_total_g;
              carbs += cal * response.data.items[0]?.carbohydrates_total_g;
              protein += cal * response.data.items[0]?.protein_g;
            }
          });
          setLoadingSpinner(false);
          return {
            fat,
            protein,
            carbs,
          };
        });
      })
      .catch((err) => {
        setLoadingSpinner(false);
      });
  };

  const fetchData = (minus) => {
    setLoadingSpinner(true);
    setIsLoading(true);
    axios
      .post(`https://cal-tracker.herokuapp.com/getUser`, {
        token: localStorage.getItem("token"),
      })
      .then((x) => {
        const map2 = new Map();
        let str = mapCalc(x, map2, minus);
        if (!map2.has(str)) {
          map2.set(str, []);
        }
        let dta = !map2.get(str) ? [] : map2.get(str);
        console.log(dta);
        getPie(dta);
        setTme(last7Days(minus));
        setDisplay({ ...x.data, food: dta });
        setData({ ...x.data, food: dta });
        setIsLoading(false);
        setFoodLoading(false);
      })
      .catch((err) => {
        router.push("/login");
        console.log(err);
      });
  };

  useEffect(() => {
    if (!localStorage.getItem("id")) {
      router.push("/login");
      return;
    }
    fetchData(0);
    arr = [];
    for (let i = 0; i < 7; i++) {
      arr.push(last7Days(i));
    }
    setSlots(arr);
  }, []);

  useEffect(() => {
    setNewFood({ ...newFood, ID: data.food.length });
    let val = 0;
    data.food.forEach((x) => {
      val += parseFloat(x.calories);
    });
    setCalories(val);
    setBmr(
      calcBMR({
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
      })
    );
  }, [data]);

  useEffect(() => {
    let td = calcTDE({ activity: data.activity, bmr });
    setTde(td.toFixed(2));
  }, [bmr]);

  useEffect(() => {
    if (data.goal == "Fat Loss") {
      setWeightNeeded(tde * 0.8);
    } else {
      setWeightNeeded(tde + 250);
    }
  }, [tde]);

  const calc = ({ weightNeeded, calories }) => {
    let val = weightNeeded - calories;
    val = val.toFixed(0);
    return val;
  };

  const findIt = (val) => {
    if (calories > weightNeeded) {
      return 100;
    } else if (calories <= 0) {
      return 0;
    } else {
      return val;
    }
  };

  const findIt2 = (val) => {
    if (calories > weightNeeded) {
      return 11;
    } else if (calories <= 0) {
      return 0;
    } else {
      return val;
    }
  };

  return (
    <>
      {isLoading ? (
        <div
          className={styles.loading2}
          style={{
            color: "black",
            padding: "15px",
            height: "100vh",
            fontSize: "16px",
            fontWeight: "300",
            letterSpacing: "1px",
          }}
        >
          Loading
        </div>
      ) : (
        <div>
          {" "}
          <div
            style={{
              fontSize: "50px",
              padding: "30px 120px 15px 50px",
              maxWidth: "880px",
              fontWeight: "600",
              margin: "auto",
            }}
          >
            Dashboard.
          </div>
          <div className={styles.cont}>
            <div className={styles.leftCont}>
              <div className={styles.leftSide}>
                <div className={styles.title}>
                  <h1 style={{ marginTop: "15px" }}> TDEE helper</h1>
                  <p>
                    Hello {data.username}, you need to consume about{" "}
                    <b>{tde}</b> calories each day just to maintain your current
                    weight.
                  </p>
                </div>
                <div>
                  <div>
                    <h3>Calorie tracker</h3>
                    <p>
                      You are about <b>{calc({ weightNeeded, calories })}</b>{" "}
                      calories away from your goal!
                    </p>
                    <div>
                      <h3 style={{ marginBottom: "2px" }}>
                        <span
                          style={{
                            fontSize: "30px",
                            color: `${
                              arr[
                                findIt2(
                                  Math.round(
                                    10 - ((weightNeeded - calories) / tde) * 10
                                  ) % 11
                                )
                              ]
                            }`,
                          }}
                        >
                          {calories}
                        </span>{" "}
                        <span
                          style={{
                            marginLeft: "2px",
                            fontSize: "13px",
                            fontWeight: "300",
                            letterSpacing: "1px",
                          }}
                        >
                          CALORIES CONSUMED
                        </span>
                      </h3>
                    </div>
                    <div className={styles.progress}>
                      <div
                        style={{
                          height: "15px",
                          backgroundColor: `${
                            arr[
                              findIt2(
                                Math.round(
                                  10 - ((weightNeeded - calories) / tde) * 10
                                ) % 11
                              )
                            ]
                          }`,
                          width: `${findIt(
                            100 -
                              ((((weightNeeded - calories) / tde) * 100) % 100)
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <h3
                      style={{
                        textAlign: "center",
                        color: "#454141",
                        marginBottom: "10px",
                        marginTop: "40px",
                        letterSpacing: "1.7px",
                        fontSize: "16px",
                        fontWeight: "100",
                      }}
                    >
                      CHOOSE A GOAL
                    </h3>
                    <div className={styles.goal}>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            goal: "Fat Loss",
                          });
                          setWeightNeeded(tde * 0.8); // 0px 0px 10px 0px rgba(157, 157, 157, 0.5)
                        }}
                        style={{
                          borderBottom: `${
                            data.goal == "Fat Loss"
                              ? "4px solid rgb(98, 98, 98)"
                              : "none"
                          }`,
                          boxShadow: `${
                            data.goal != "Fat Loss"
                              ? "none"
                              : "0px 0px 8px 0px rgba(191, 191, 191, .5)"
                          }`,
                        }}
                      >
                        Fat Loss
                      </button>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            goal: "Weight Gain",
                          });
                          setWeightNeeded(tde + 250);
                        }}
                        style={{
                          borderBottom: `${
                            data.goal != "Fat Loss"
                              ? "4px solid rgb(98, 98, 98)"
                              : "none"
                          }`,
                          boxShadow: `${
                            data.goal == "Fat Loss"
                              ? "none"
                              : "0px 0px 8px 0px rgba(191,191,191, .5)"
                          }`,
                        }}
                      >
                        Weight Gain
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.leftBottom}>
                <h2 style={{ marginLeft: "20px" }}>Add Food.</h2>
                <div className={styles.addFoodCont}>
                  <div className={styles.foodcal}>
                    {" "}
                    <div className={styles.tpo}>
                      {" "}
                      <label htmlFor="">Food name</label>
                      <input
                        onChange={onTxt}
                        name="name"
                        value={newFood.name}
                        placeholder="e.g apple.."
                        type="text"
                      />
                    </div>
                    <div className={styles.tpo}>
                      <label htmlFor="">Calories</label>
                      <input
                        onChange={onTxt}
                        name="calories"
                        value={newFood.calories}
                        placeholder="e.g 200.."
                        type="text"
                      />
                    </div>
                  </div>
                  <label className={styles.spec} htmlFor="">
                    INGREDIENTS
                  </label>
                  <div className={styles.tagDiv}>
                    <ul className={styles.tags}>
                      {tags.map((tag, index) => (
                        <li key={index} className={styles.tag}>
                          <span className={styles.tagTitle}>{tag.name}</span>
                          <span
                            className={styles.tagCloseIcon}
                            onClick={() => removeTags(index)}
                          >
                            x
                          </span>
                        </li>
                      ))}
                    </ul>
                    <input
                      className={styles.specInput}
                      type="text"
                      onKeyUp={(event) =>
                        event.key === "Enter" ? addTags(event) : null
                      }
                      placeholder="Press enter to add ingredients..."
                    />
                  </div>
                  <button onClick={addFood}>Add Food</button>
                </div>
              </div>
            </div>

            <div className={styles.rightCont}>
              <div className={styles.rightSide}>
                <div className={styles.top}>
                  <div>
                    <h1
                      style={{
                        marginTop: "15px",
                        padding: "4px 0px",
                        borderBottom: "3px solid rgb(195, 195, 195)",
                      }}
                    >
                      {tme}
                    </h1>
                  </div>
                  <div className={styles.search}>
                    <input value={searchTerm} onChange={search} type="text" />
                    <BiSearch style={{ position: "absolute", right: "42%" }} />
                    <button className={styles.theBTN}>Search Item</button>
                  </div>
                </div>
                <div className={styles.navbar}>
                  {slots.map((slot, i) => {
                    return (
                      <div
                        className={
                          tme === slot ? styles.chosen : styles.notchosen
                        }
                        onClick={() => {
                          setTme(last7Days(i));
                          fetchData(i);
                        }}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "10px 20px" }} className={styles.navbar}>
                  <div className={styles.item}>ITEM</div>
                  <div>CALORIES</div>
                  <div>INGREDIENTS</div>
                  <div>REMOVE</div>
                </div>

                <div className={styles.newFood}>
                  {display.food.length == 0 ? (
                    <div style={{ marginTop: "15px" }}>No items over here.</div>
                  ) : foodLoading ? (
                    <div
                      className={styles.loading2}
                      style={{
                        color: "black",
                        padding: "15px",
                        height: "100vh",
                        fontSize: "16px",
                        fontWeight: "300",
                        letterSpacing: "1px",
                      }}
                    >
                      Loading
                    </div>
                  ) : (
                    display.food.map((x) => {
                      return (
                        <div className={styles.food} key={x.id}>
                          <div style={{ maxWidth: "70px" }}> {x.name}</div>
                          <div>{x.calories} cal</div>
                          <div
                            style={{ marginRight: "-15px" }}
                            className={styles.ingredients}
                          >
                            {x.ingredients.map((y) => {
                              return (
                                <div className={styles.ingredient} key={y.id}>
                                  {y.name}
                                </div>
                              );
                            })}
                          </div>
                          <div
                            onClick={() => {
                              removeFood(x.ID);
                            }}
                            className={styles.theX}
                          >
                            X
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className={styles.bottomRight}>
                <h2 style={{ marginLeft: "20px" }}>
                  EST. Statistics for {tme}
                </h2>
                {loadingSpinner ? (
                  <div>Loading...</div>
                ) : data.food.length == 0 ? (
                  <div>Nothing to see here.</div>
                ) : (
                  <PieChart
                    style={{ marginTop: "-40px" }}
                    labelStyle={{
                      fill: "white",
                      fontSize: "4px",
                    }}
                    label={(props) => {
                      return props.dataEntry.title;
                    }}
                    radius={40}
                    data={[
                      {
                        title: `Protein (${info.protein.toFixed(0)}g)`,
                        value: info.protein,
                        color: "#E38627",
                      },
                      {
                        title: `Fat (${info.fat.toFixed(0)}g)`,
                        value: info.fat,
                        color: "#C13C37",
                      },
                      {
                        title: `Carbs (${info.carbs.toFixed(0)}g)`,
                        value: info.carbs,
                        color: "#6A2135",
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
