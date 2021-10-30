import { initializeApp } from "firebase/app";

var conf = {
  apiKey: "AIzaSyDjZ8h3BCpJYJsT-WMvYXVSyOWQ-gvOeE4",
  authDomain: "inventory-f6870.firebaseapp.com",
  databaseURL: "https://inventory-f6870-default-rtdb.firebaseio.com",
  projectId: "inventory-f6870",
  storageBucket: "inventory-f6870.appspot.com",
  messagingSenderId: "234150437746",
  appId: "1:234150437746:web:ddcbc43cd00c82fdfa73eb",
};

const firebaseApp = initializeApp(conf);

export default firebaseApp;
