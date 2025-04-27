
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBt7p636Gmcxg9qG7YEeDbAqB0Q7-XFN-I",
    authDomain: "bhoj-ki-khoj-c4738.firebaseapp.com",
    projectId: "bhoj-ki-khoj-c4738",
    storageBucket: "bhoj-ki-khoj-c4738.appspot.com",
    messagingSenderId: "42637820862",
    appId: "1:42637820862:web:d062effd0a7d2396fd2fef",
    measurementId: "G-4T9D2NC277"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
