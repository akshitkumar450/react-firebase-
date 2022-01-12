import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import "./Navbar.css";

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const handleLogout = async () => {
    await auth.signOut();
  };
  return (
    <div className="navbar__container">
      <div className="navbar__left">
        <h3>
          <Link to="/">Home</Link>
        </h3>
      </div>
      <div className="navbar__right">
        {!user && (
          <>
            <h3>
              <Link to="/login">login</Link>
            </h3>
            <h3>
              <Link to="/signup">singup</Link>
            </h3>
          </>
        )}
        {user && (
          <>
            <h3>
              {user?.name}-{user?.email}
            </h3>
            <h3 onClick={handleLogout}>logout</h3>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
