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

/* ADMIN UID */

const adminUIDs = [
"ew4aLAuauqTh0IBdXNfQMmm83Mw1"
];

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

/* PACKAGE ADD POINTS */

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
429:200,
514:240,
600:300,
706:320,
878:360,
963:500,
1050:520,
1135:545,
1220:570,
1412:640,
2195:680,
3688:730,
4394:800,
5534:960,
6238:1100,
7376:1500
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
packageRedeems:redeemData,
history:[]

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

document.getElementById(
"profileEmail"
).innerText =
"Email : " + data.email;

document.getElementById(
"profileUsername"
).innerText =
"Username : " + data.username;

loadRedeems(
data.packageRedeems
);

loadHistory(
data.history || []
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

if(adminUIDs.includes(user.uid)){

document.getElementById(
"adminPanel"
).style.display = "block";

}

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

/* LOAD HISTORY */

function loadHistory(history){

const historyList =
document.getElementById(
"historyList"
);

if(history.length === 0){

historyList.innerHTML =
"No History";

return;

}

historyList.innerHTML = "";

history.forEach((item)=>{

historyList.innerHTML += `

<div class="history-card">

<p>
Package : ${item.package}
</p>

<p>
Points : ${item.points}
</p>

<p>
Time : ${item.time}
</p>

</div>

`;

});

}

/* SHOW SECTION */

function showSection(section){

document.getElementById(
"homeSection"
).style.display = "none";

document.getElementById(
"listSection"
).style.display = "none";

document.getElementById(
"historySection"
).style.display = "none";

document.getElementById(
"profileSection"
).style.display = "none";

if(section === "home"){

document.getElementById(
"homeSection"
).style.display = "block";

}

if(section === "list"){

document.getElementById(
"listSection"
).style.display = "block";

}

if(section === "history"){

document.getElementById(
"historySection"
).style.display = "block";

}

if(section === "profile"){

document.getElementById(
"profileSection"
).style.display = "block";

}

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

/* DELETE ACCOUNT */

async function deleteAccount(){

const confirmDelete =
confirm(
"Delete Account?"
);

if(!confirmDelete){

return;

}

try{

const user =
auth.currentUser;

await db.collection("users")
.doc(user.uid)
.delete();

await user.delete();

alert("Account Deleted");

}catch(error){

alert(error.message);

}

}

/* ADMIN ADD POINTS */

async function addPoints(){

const username =
document.getElementById(
"targetUsername"
).value;

const packageName =
document.getElementById(
"packageSelect"
).value;

const amount =
parseInt(
document.getElementById(
"packageAmount"
).value
);

if(!amount){

alert("Enter amount");
return;

}

const addValue =
packagePoints[packageName] * amount;

const snapshot =
await db.collection("users")
.where("username","==",username)
.get();

if(snapshot.empty){

alert("User not found");
return;

}

snapshot.forEach(async(doc)=>{

const data = doc.data();

const redeemData =
data.packageRedeems || {};

const history =
data.history || [];

redeemData[packageName] =
(redeemData[packageName] || 0)
+ addValue;

history.push({

package:packageName,
points:addValue,
time:new Date().toLocaleString()

});

await db.collection("users")
.doc(doc.id)
.update({

packageRedeems:redeemData,
history:history

});

});

alert(
"Points Added Successfully"
);

}
