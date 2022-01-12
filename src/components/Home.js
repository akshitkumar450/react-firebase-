import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";
import firebase from "firebase";
import RenderList from "./RenderList";
function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(false);

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
  useEffect(() => {
    const unsub = db
      .collection("recipies")
      // fetching specific user info only
      .where("uid", "==", user.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        let temp = [];
        snapshot.docs.forEach((doc) => {
          temp.push({ ...doc.data(), id: doc.id });
          //console.log(doc.data());
        });
        setData(temp);
      });

    return () => {
      unsub();
      setCancel(true);
    };
  }, [user]);
  // console.log(data);
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
        <button> {loading ? "adding" : "add"}</button>
      </form>
      <RenderList data={data} />
    </div>
  );
}

export default Home;
