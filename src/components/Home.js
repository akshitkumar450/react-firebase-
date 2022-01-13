import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import firebase from "firebase";
import RenderList from "./RenderList";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];
function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [cancel, setCancel] = useState(false);
  const [options, setOptions] = useState([]);

  const user = useSelector((state) => state.user.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(title, amount);
    try {
      await db.collection("recipies").add({
        title: title,
        amount: amount,
        uid: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      if (!cancel) {
        setTitle("");
        setAmount("");
        setLoading(false);
      }
    } catch (err) {
      if (!cancel) {
        alert(err.message);
        setLoading(false);
      }
    }
  };
  // useEffect(() => {
  //   const unsub = db
  //     .collection("recipies")
  //     // fetching specific user info only
  //     .where("uid", "==", user.uid)
  //     .orderBy("createdAt", "desc")
  //     .onSnapshot((snapshot) => {
  //       let temp = [];
  //       snapshot.docs.forEach((doc) => {
  //         temp.push({ ...doc.data(), id: doc.id });
  //         //console.log(doc.data());
  //       });
  //       setData(temp);
  //     });

  //   return () => {
  //     unsub();
  //     setCancel(true);
  //   };
  // }, [user]);
  // console.log(data);
  // console.log(category.value);
  useEffect(() => {
    let unsub;
    const fetchData = async () => {
      unsub = await db.collection("users").onSnapshot((snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setData(results);
      });
    };
    fetchData();
    return () => {
      unsub();
    };
  }, []);
  // console.log(data);

  useEffect(() => {
    let newArr = [];
    newArr = data.map((user) => {
      return {
        value: user,
        label: user.name,
      };
    });
    console.log(newArr);

    setOptions(newArr);
  }, [data]);

  return (
    <div>
      <h3>All transactions</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <span>title:</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
        </label>
        <label>
          <span>amount:</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        {/*
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="slect">select category</option>
          <option value="design">Design</option>
          <option value="ui">Ui</option>
          <option value="dev">Dev</option>
        </select>
          */}
        <Select onChange={(option) => setCategory(option)} options={options} />
        <button> {loading ? "adding" : "add"}</button>
      </form>
      <RenderList data={data} />
    </div>
  );
}

export default Home;
