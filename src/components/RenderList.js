import React from "react";
import { db } from "../firebase";

function RenderList({ data }) {
  const handleDelete = async (id) => {
    await db.collection("recipies").doc(id).delete();
  };
  return (
    <div>
      <h3>All transactions</h3>
      {data.map((item) => (
        <h4 key={item.id}>
          {item.title}-{item.amount}-
          <span onClick={() => handleDelete(item.id)}>X</span>
        </h4>
      ))}
    </div>
  );
}

export default RenderList;
