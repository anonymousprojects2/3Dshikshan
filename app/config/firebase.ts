import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE6QtjKKrDodkvXHIkac7BLt0lMQ2RbAU",
  authDomain: "dshikshan-auth.firebaseapp.com",
  projectId: "dshikshan-auth",
  storageBucket: "dshikshan-auth.firebasestorage.app",
  messagingSenderId: "176165300695",
  appId: "1:176165300695:web:2cc7c54d409849d77e0392",
  measurementId: "G-LCKW75MWFB"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
