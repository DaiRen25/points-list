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

const packagePoints = {
wp:6,
11:2,
22:5,
56:16,
86:25,
112:45,
172:62,
257:100,
343:180,
514:240,
706:320,
878:360,
1050:520,
1412:640,
2195:680,
3688:730,
5534:960,
7376:1500
};

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
points:0
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
"pointsText"
).innerText =
"Points: " + data.points;

document.getElementById(
"profileName"
).innerText =
"Username: " +
(data.username || "Not Set");

document.getElementById(
"profilePoints"
).innerText =
"Points: " + data.points;

document.getElementById(
"username"
).value =
data.username || "";

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
"Please set your Telegram username. Admin needs your username to add points."
);

showPage("profile");

}

});

}

async function saveUsername(){

const username =
document.getElementById(
"username"
).value;

if(username === ""){

alert("Enter Telegram Username");

return;

}

const userRef =
db.collection("users")
.doc(currentUserUID);

await userRef.update({
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

if(!packagePoints[item]){

alert("Invalid Package");

return;

}

const addPoints =
packagePoints[item] * amount;

const snapshot =
await db.collection("users")
.where("username","==",username)
.get();

if(snapshot.empty){

alert("User not found");

return;

}

snapshot.forEach(async(doc)=>{

const current =
doc.data().points || 0;

await db.collection("users")
.doc(doc.id)
.update({

points:
current + addPoints

});

});

alert(
"Added " +
addPoints +
" points to " +
username
);

}
