// Import the functions you need from the SDKs you need
import { getFirestore} from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyDuSuMkSjQ8A7GiTFGgbDSYjb04obX2o00",

  authDomain: "task-manager-73ee9.firebaseapp.com",

  projectId: "task-manager-73ee9",

  storageBucket: "task-manager-73ee9.appspot.com",

  messagingSenderId: "273565907671",

  appId: "1:273565907671:web:a206aaf60cc422001a8e92"

};


// Initialize Firebase

initializeApp(firebaseConfig);

const db = getFirestore();

export default db;