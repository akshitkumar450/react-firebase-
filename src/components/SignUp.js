import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { login } from "../Redux/actions";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cancel, setCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

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

      // uploading image and getting url
      const imagePath = `profiles/${authUser.user.uid}/${image.name}`;
      const img = await storage.ref(imagePath).put(image);
      const imageUrl = await img.ref.getDownloadURL();

      await authUser.user.updateProfile({
        displayName: name,
        photoURL: imageUrl,
      });

      // save the properties to currenly signed up used as a document
      // when user signed up its login will true
      db.collection("users").doc(authUser.user.uid).set({
        name,
        email,
        photo: imageUrl,
        online: true,
      });

      dispatch(
        login({
          name: authUser.user.displayName,
          email: authUser.user.email,
          uid: authUser.user.uid,
          photo: authUser.user.photoURL,
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
  //   to prevent updating state if component is unmounted
  //   this will be true when this component unmounts
  //when cancel is true then any state update will not happen(line 38)
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
        <label>
          <span>upload image</span>
          <input
            accept="image/*"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <button>{loading ? "loading" : "signup"} </button>
      </form>
    </div>
  );
}

export default SignUp;
