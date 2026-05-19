const firebaseConfig = {
  apiKey: "AIzaSyBj-aJSXJBliniA_ov2TSx0Q8396XUP-0M",
  authDomain: "points-list-1f968.firebaseapp.com",
  projectId: "points-list-1f968",
  storageBucket: "points-list-1f968.firebasestorage.app",
  messagingSenderId: "310357374560",
  appId: "1:310357374560:web:6cc2e11e8d6250689e3505",
  measurementId: "G-W2CR989JNY"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/* PACKAGE MAX */

const packageMax = {
wp:100,
11:250,
22:300,
56:400,
86:500,
112:650,
172:700,
257:900,
343:1200,
429:1500,
514:1800,
600:2000,
706:2300,
878:2500,
963:3000,
1050:3350,
1135:3900,
1220:4400,
1412:5400,
2195:6000,
3688:6500,
4394:7000,
5534:8000,
6238:9200,
7376:10000
};

/* REGISTER */

async function register(){

const email =
document.getElementById(
"registerEmail"
).value;

const username =
document.getElementById(
"registerUsername"
).value;

const password =
document.getElementById(
"registerPassword"
).value;

if(
email === "" ||
username === "" ||
password === ""
){

alert("Fill all fields");
return;

}

try{

const result =
await auth.createUserWithEmailAndPassword(
email,
password
);

const user = result.user;

const redeemData = {};

Object.keys(packageMax).forEach((key)=>{

redeemData[key] = 0;

});

await db.collection("users")
.doc(user.uid)
.set({

email:email,
username:username,
packageRedeems:redeemData

});

alert("Register Success");

showLogin();

}catch(error){

alert(error.message);

}

}

/* LOGIN */

async function login(){

const email =
document.getElementById(
"loginEmail"
).value;

const password =
document.getElementById(
"loginPassword"
).value;

try{

await auth.signInWithEmailAndPassword(
email,
password
);

}catch(error){

alert(error.message);

}

}

/* AUTO LOGIN */

auth.onAuthStateChanged(async(user)=>{

if(user){

const doc =
await db.collection("users")
.doc(user.uid)
.get();

const data = doc.data();

document.getElementById(
"welcomeText"
).innerText =
"Welcome " +
data.username;

loadRedeems(
data.packageRedeems
);

document.getElementById(
"loginPage"
).style.display = "none";

document.getElementById(
"registerPage"
).style.display = "none";

document.getElementById(
"homePage"
).style.display = "block";

}else{

document.getElementById(
"loginPage"
).style.display = "block";

document.getElementById(
"homePage"
).style.display = "none";

}

});

/* LOAD REDEEMS */

function loadRedeems(data){

Object.keys(data).forEach((key)=>{

const element =
document.getElementById(
"redeem-" + key
);

if(element){

element.innerText =
"Redeem " +
data[key] +
"/" +
packageMax[key];

}

});

}

/* LOGOUT */

function logout(){

auth.signOut();

}

/* SHOW REGISTER */

function showRegister(){

document.getElementById(
"loginPage"
).style.display = "none";

document.getElementById(
"registerPage"
).style.display = "block";

}

/* SHOW LOGIN */

function showLogin(){

document.getElementById(
"registerPage"
).style.display = "none";

document.getElementById(
"loginPage"
).style.display = "block";

}

/* FORGOT PASSWORD */

async function forgotPassword(){

const email = prompt(
"Enter your registered Gmail"
);

if(!email){

return;

}

try{

await auth.sendPasswordResetEmail(email);

alert(
"Password reset email sent.\nCheck your Gmail inbox."
);

}catch(error){

alert(error.message);

}

}
