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

function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth.signInWithPopup(provider)
    .then((result) => {

      const user = result.user;

      document.getElementById("name").innerText =
        "Name: " + user.displayName;

      const userRef = db.collection("users").doc(user.uid);

      userRef.get().then((doc) => {

        if (!doc.exists) {

          userRef.set({
            name: user.displayName,
            points: 0
          });

          document.getElementById("points").innerText =
            "Points: 0";

        } else {

          document.getElementById("points").innerText =
            "Points: " + doc.data().points;

        }

      });

    })
    .catch((error) => {
      alert(error.message);
    });
}
