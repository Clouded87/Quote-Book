import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, 
         signInWithEmailAndPassword, 
         onAuthStateChanged,
         signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBEBzX_1oDGVrh84OrNg9kkuQBIhUwyMSU",
  authDomain: "quote-book-87.firebaseapp.com",
  projectId: "quote-book-87",
  storageBucket: "quote-book-87.firebasestorage.app",
  messagingSenderId: "633173164469",
  appId: "1:633173164469:web:181ccf5780ca589eb5d9fc"
};

import { getAndDisplayQuotes } from './script.js';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export const firestoredb = getFirestore(app);
const logoutBtn1 = document.getElementById('logout-btn1')
const logoutBtn2 = document.getElementById('logout-btn2')
const loreBtn1 = document.getElementById('lore-btn1')
const loreBtn2 = document.getElementById('lore-btn2')
const loreBackBtn = document.getElementById('lore-back-btn')
const loreLogoutBtn = document.getElementById('lore-logout-btn')
const loggedInView = document.getElementById('logged-in-view')
const adminView = document.getElementById('admin-logged-in-view')
const loggedOutView = document.getElementById('logged-out-view')
const emailSignInForm = document.getElementById('signin-email-input')
const passwordSignInForm = document.getElementById('signin-password-input')
const loginBtn = document.getElementById('sign-in-btn')
//const logoutBtns = document.getElementById('logout-button')
let email = ""
let uid = '';
const loreView = document.getElementById('lore-view')
function logout() {
  
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
    location.reload(true)
  
}

onAuthStateChanged(auth, async (user) => { // Await checkAdmPings here
    if (user) {
      uid = user.uid;
      email = user.email;
      console.log(uid);
      if (uid == "Ka02GemtK8fqTR31PnliLqBxRJI2" || uid == "fhlTbn28L0ZkHnimiZoVZP7fr9v2") {
        adminView.style.display = 'block'
      } else {
      loggedInView.style.display = 'block'}
      emailSignInForm.innerText = email
      emailSignInForm.value = ""
      passwordSignInForm.value = ""
      loggedOutView.style.display = 'none'
      getAndDisplayQuotes();

    } else {
      // User is signed out
      loggedInView.style.display = 'none' 
      loggedOutView.style.display = 'block'
       
    }
  });
loginBtn.addEventListener('click', () => {
    signInWithEmailAndPassword(auth, emailSignInForm.value, passwordSignInForm.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //console.log(user)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //console.log(errorMessage)
            passwordSignInForm.value = ""
        });
  })
passwordSignInForm.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginBtn.click();
  }
});
logoutBtn1.addEventListener('click', () => {logout()})
logoutBtn2.addEventListener('click', () => {logout()})
// Lore navigation handlers
if (loreBtn1) loreBtn1.addEventListener('click', () => { showView('lore') })
if (loreBtn2) loreBtn2.addEventListener('click', () => { showView('lore') })
if (loreBackBtn) loreBackBtn.addEventListener('click', () => { showView('quotes') })
if (loreLogoutBtn) loreLogoutBtn.addEventListener('click', () => { logout() })

function showView(viewName) {
  // hide all main views then show the requested one
  const views = [loggedInView, adminView, loggedOutView, loreView]
  views.forEach(v => { if (v) v.style.display = 'none' })

  if (viewName === 'lore') {
    if (loreView) loreView.style.display = 'block'
  } else if (viewName === 'quotes') {
    // show admin if admin uid, else normal logged-in view
    if (uid == "Ka02GemtK8fqTR31PnliLqBxRJI2" || uid == "fhlTbn28L0ZkHnimiZoVZP7fr9v2") {
      if (adminView) adminView.style.display = 'block'
    } else {
      if (loggedInView) loggedInView.style.display = 'block'
    }
  } else if (viewName === 'logged-out') {
    if (loggedOutView) loggedOutView.style.display = 'block'
  }
}
