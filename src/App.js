// eslint-disable-next-line
import firebaseApp from "./firebase";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { ref, getDatabase, get, child, set } from "firebase/database";
import Inventory from "./Inventory";
import { Form, Button } from "react-bootstrap";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const dbRef = ref(db);
      get(child(dbRef, `users/${user.uid}`))
        .then((snapshot) => {
          if (!snapshot.exists()) {
            set(ref(db, "users/" + user.uid), { inventory: 0, invoices: 0 });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user]);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "visible",
        callback: (response) => {
          onSignInSubmit();
        },
      },
      auth
    );
  };

  const onSignInSubmit = (e) => {
    e.preventDefault();
    setupRecaptcha();
    const phoneNumber = phone;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;

        const code = prompt("Enter the code");
        confirmationResult
          .confirm(code)
          .then((result) => {
            const user = result.user;
            setUser(user);
          })
          .catch((error) => {
            alert("Invalid Code");
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="main">
      {!user ? (
        <div className="login">
          <h1>Google Phone Login</h1>
          <form onSubmit={onSignInSubmit}>
            <Form.Control
              type="text"
              placeholder="Phone no"
              className="phone-input my-3"
              onChange={(e) => setPhone(e.target.value)}
            />
            <Form.Control
              type="password"
              placeholder="Password"
              className="phone-input my-3"
            />
            <div id="recaptcha-container"></div>
            <Button variant="dark" type="submit">
              Submit
            </Button>
          </form>
        </div>
      ) : (
        <>
          <Inventory uid={user.uid} />
        </>
      )}
    </div>
  );
}

export default App;
