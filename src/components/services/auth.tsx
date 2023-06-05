import { initializeApp } from "@firebase/app";
import { FIREBASE_CONFIG } from "../../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
initializeApp(FIREBASE_CONFIG);

const AuthService: any = {};

AuthService.register = (name: any, email: any, password: any) => {
  const fauth = getAuth();

  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(fauth, email, password)
      .then((userCredential) => {
        if (fauth.currentUser != null) {
          updateProfile(fauth.currentUser, {
            displayName: name,
          })
            .then(() => {
              resolve({ status: true, message: "Register successfully." });
            })
            .catch((error) => {
              resolve({ status: false, message: error.message });
            });
        }
      })
      .catch((error) => {
        let message = "Something Went Wrong";
        if (error && error.code && error.code == "auth/email-already-in-use") {
          message = "Email already used.";
        }
        resolve({ status: false, message: message });
      });
  });
};

AuthService.login = (email: any, password: any) => {
  const fauth = getAuth();
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(fauth, email, password)
      .then((user) => {
        if (user) {
          resolve({ status: true, message: "Login successfully." });
        } else {
          resolve({ status: false, message: "Incorrect Email or Password." });
        }
      })
      .catch((err) => {
        reject({ status: false, message: "Incorrect Email or Password." });
      });
  });
};

AuthService.user = false;

AuthService.getProfile = (hard = false) => {
  return new Promise(async (res, rej) => {
    const fauth = getAuth();

    await fauth.onAuthStateChanged((user) => {
      if (user) {
        res(user);
      } else {
        res(false);
      }
    });
  });
};

AuthService.logout = async () => {
  return new Promise((resolve) => {
    const fauth = getAuth();
    fauth
      .signOut()
      .then(() => {
        resolve({ status: true, message: "Logged out successfully." });
      })
      .catch((err) => {
        resolve({ status: true, message: "Logged out successfully." });
      });
  });
};

export default AuthService;
