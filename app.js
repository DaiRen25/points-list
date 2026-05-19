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

const packagePoints = {
  wp: 6,
  11: 2,
  22: 5,
  56: 16,
  86: 25,
  112: 45,
  172: 62,
  257: 100,
  343: 180,
  514: 240,
  600: 300,
  706: 320,
  878: 360,
  963: 500,
  1050: 520,
  1135: 545,
  1220: 570,
  1412: 640,
  2195: 680,
  3688: 730,
  4394: 800,
  5534: 960,
  6238: 1100,
  7376: 1500
};

let currentUserUID = "";

function login(){

  const provider =
  new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)

  .then(async(result)=>{

    const user = result.user;

    currentUserUID = user.uid;

    document.getElementById("name").innerText =
    "Name: " + user.displayName;

    const userRef =
    db.collection("users").doc(user.uid);

    const doc = await userRef.get();

    if(!doc.exists){

      await userRef.set({
        name:user.displayName,
        points:0
      });

      document.getElementById("points").innerText =
      "Points: 0";

    }else{

      document.getElementById("points").innerText =
      "Points: " + doc.data().points;

    }

  })

  .catch((error)=>{
    alert(error.message);
  });

}

async function adminAdd(){

  const uid =
  document.getElementById("uid").value;

  const item =
  document.getElementById("item").value.toLowerCase();

  const amount =
  parseInt(document.getElementById("amount").value);

  if(!packagePoints[item]){
    alert("Invalid Package");
    return;
  }

  const addPoints =
  packagePoints[item] * amount;

  const userRef =
  db.collection("users").doc(uid);

  const doc =
  await userRef.get();

  if(doc.exists){

    const current =
    doc.data().points || 0;

    await userRef.update({
      points: current + addPoints
    });

    alert(
      "Added " +
      addPoints +
      " points"
    );

  }else{

    alert("User not found");

  }

}
