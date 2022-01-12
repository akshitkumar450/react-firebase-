import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";
import { login } from "../Redux/actions";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cancel, setCancel] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authUser = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      //   console.log(authUser.user);
      await authUser.user.updateProfile({
        displayName: name,
      });

      dispatch(
        login({
          name: authUser.user.displayName,
          email: authUser.user.email,
          uid: authUser.user.uid,
        })
      );
      //   histroy.push("/");
      //   we cant update the state if the user unmounts this component
      // this can be done if the user click on signup btn and quickly go to other page
      if (!cancel) {
        setEmail("");
        setPassword("");
        setName("");
        setLoading(false);
      }
    } catch (err) {
      alert(err.message);
      if (!cancel) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    return () => {
      setCancel(true);
    };
  }, []);
  return (
    <div>
      <h3>Sign up :</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <span>email</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          <span>password</span>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          <span>name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button>{loading ? "loading" : "signup"} </button>
      </form>
    </div>
  );
}

export default SignUp;
