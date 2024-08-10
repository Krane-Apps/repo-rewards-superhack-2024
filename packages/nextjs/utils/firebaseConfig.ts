import { initializeApp } from "firebase/app";
import { GithubAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqGO6twhoTamyYhpi18vRpcO1AiUr6YY8",
  authDomain: "repo-rewards-9ed47.firebaseapp.com",
  projectId: "repo-rewards-9ed47",
  storageBucket: "repo-rewards-9ed47.appspot.com",
  messagingSenderId: "271299680704",
  appId: "1:271299680704:web:8fc5fc20f16eaed4e7d025",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const githubProvider = new GithubAuthProvider();
