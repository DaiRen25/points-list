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

let currentUserUID = "";

const adminUIDs = [
"ew4aLAuauqTh0IBdXNfQMmm83Mw1"
];

/* =========================
   PACKAGE DATA
========================= */

const packages = {
wp:{add:6,max:100},
11:{add:2,max:250},
22:{add:5,max:300},
56:{add:16,max:400},
86:{add:25,max:500},
112:{add:45,max:650},
172:{add:62,max:700},
257:{add:100,max:900},
343:{add:180,max:1200},
429:{add:200,max:1500},
514:{add:240,max:1800},
600:{add:300,max:2000},
706:{add:320,max:2300},
878:{add:360,max:2500},
963:{add:500,max:3000},
1050:{add:520,max:3350},
1135:{add:545,max:3900},
1220:{add:570,max:4400},
1412:{add:640,max:5400},
2195:{add:680,max:6000},
3688:{add:730,max:6500},
4394:{add:800,max:7000},
5534:{add:960,max:8000},
6238:{add:1100,max:9200},
7376:{add:1500,max:10000}
};

/* =========================
   LOGIN
========================= */

function login(){

const provider =
new firebase.auth.GoogleAuthProvider();

auth.signInWithPopup(provider)

.then(async(result)=>{

const user = result.user;

currentUserUID = user.uid;

const userRef =
db.collection("users").doc(user.uid);

const doc =
await userRef.get();

if(!doc.exists){

await userRef.set({
gmailName:user.displayName,
username:"",
packageRedeems:{},
history:[]
});

}

const data =
(await userRef.get()).data();

document.getElementById(
"welcomeText"
).innerText =
"Welcome " +
(data.username || "Set Username");

document.getElementById(
"profileName"
).innerText =
"Username: " +
(data.username || "Not Set");

document.getElementById(
"username"
).value =
data.username || "";

loadRedeemPoints(data.packageRedeems || {});

document.getElementById(
"loginPage"
).style.display = "none";

document.getElementById(
"homePage"
).style.display = "block";

if(adminUIDs.includes(user.uid)){

document.getElementById(
"adminPanel"
).style.display = "block";

}

if(!data.username){

alert(
"Please set your Telegram username."
);

showPage("profile");

}

});

}

/* =========================
   LOAD REDEEM POINTS
========================= */

function loadRedeemPoints(data){

Object.keys(packages).forEach((key)=>{

const current =
data[key] || 0;

const max =
packages[key].max;

const element =
document.getElementById(
"redeem-" + key
);

if(element){

element.innerText =
"Redeem " +
current +
"/" +
max;

}

});

}

/* =========================
   SAVE USERNAME
========================= */

async function saveUsername(){

const username =
document.getElementById(
"username"
).value;

if(username === ""){

alert("Enter Telegram Username");

return;

}

await db.collection("users")
.doc(currentUserUID)
.update({

username: username

});

document.getElementById(
"profileName"
).innerText =
"Username: " + username;

document.getElementById(
"welcomeText"
).innerText =
"Welcome " + username;

alert("Username Saved");

}

/* =========================
   PAGE SWITCH
========================= */

function showPage(page){

document.getElementById(
"homeSection"
).style.display = "none";

document.getElementById(
"redeemSection"
).style.display = "none";

document.getElementById(
"historySection"
).style.display = "none";

document.getElementById(
"profileSection"
).style.display = "none";

if(page === "home"){

document.getElementById(
"homeSection"
).style.display = "block";

}

if(page === "redeem"){

document.getElementById(
"redeemSection"
).style.display = "block";

}

if(page === "history"){

document.getElementById(
"historySection"
).style.display = "block";

}

if(page === "profile"){

document.getElementById(
"profileSection"
).style.display = "block";

}

}

/* =========================
   ADMIN ADD POINTS
========================= */

async function adminAdd(){

if(
!adminUIDs.includes(
currentUserUID
)
){

alert("Access Denied");

return;

}

const username =
document.getElementById(
"searchUsername"
).value;

const item =
document.getElementById(
"item"
).value.toLowerCase();

const amount =
parseInt(
document.getElementById(
"amount"
).value
);

if(!packages[item]){

alert("Invalid Package");

return;

}

const addValue =
packages[item].add * amount;

const snapshot =
await db.collection("users")
.where("username","==",username)
.get();

if(snapshot.empty){

alert("User not found");

return;

}

snapshot.forEach(async(doc)=>{

const data =
doc.data();

const currentRedeems =
data.packageRedeems || {};

const currentValue =
currentRedeems[item] || 0;

currentRedeems[item] =
currentValue + addValue;

const history =
data.history || [];

history.push({
item:item,
amount:addValue,
time:new Date().toLocaleString()
});

await db.collection("users")
.doc(doc.id)
.update({

packageRedeems:
currentRedeems,

history:history

});

if(doc.id === currentUserUID){

loadRedeemPoints(
currentRedeems
);

}

});

alert(
"Added " +
addValue +
" redeem points to " +
item
);

}
