firebase.auth().onAuthStateChanged(async function (user) {
  let db = firebase.firestore();

  //   myJson;

  /*for (i = 0; i < myJson.length; i++) {
      var exercise = myJson[i];
      db.collection("Exercises").add ({
        "Main Muscle Group": myJson[i]["Main Muscle Group"],
        "Muscles Trained": myJson[i]["Muscles Trained"],
        "Exercise Name": myJson[i]["Exercise Name"],
        "Level": myJson[i]["Level"],
        "Main Body Group": myJson[i]["Main Body Group"],
        "Pull or Push": myJson[i]["Pull or Push"],
        "Type of equipment": myJson[i]["Type of equipment"],
        "Modality": myJson[i]["Modality"],
        "Joint": myJson[i]["Joint"],
        "Recommended Sets": myJson[i]["Recommended Sets"],
        "Recommended Reps": myJson[i]["Recommended Reps"],
        "Ideal For": myJson[i]["Ideal For"],
      })
};*/

  console.log(user);
  if (user) {
    // Signed in
    console.log("signed in");
    document
      .querySelector(".fitness-database-filters")
      .classList.remove("display-none");
    document
      .querySelector(".fitness-database-filters")
      .classList.add("display-show");
    db.collection("Users").doc(user.uid).set({
      name: user.displayName,
      email: user.email,
    });

    document.querySelector(".sign-in-or-sign-out").innerHTML = `
      <p>Welcome ${user.displayName}</p>
      <button class="text-blue-500 underline sign-out">Sign Out</button>
    `;
    document
      .querySelector(".sign-out")
      .addEventListener("click", function (event) {
        console.log("sign out clicked");
        document
          .querySelector(".fitness-database-filters")
          .classList.remove("display-show");
        document
          .querySelector(".fitness-database-filters")
          .classList.add("display-none");
        firebase.auth().signOut();
        document.location.href = "index.html";
      });

    SyncExercise();

    document
      .getElementById("muscleDropdown")
      .addEventListener("click", async function (event) {
        event.preventDefault();
        let dropdowntext = event.target.innerHTML;
        document.getElementById("muscleDropdowntext").innerHTML = dropdowntext;
        SyncExercise();
      });

    document
      .getElementById("equipmentDropdown")
      .addEventListener("click", async function (event) {
        event.preventDefault();
        let dropdowntext = event.target.innerHTML;
        document.getElementById(
          "equipmentDropdowntext"
        ).innerHTML = dropdowntext;
        SyncExercise();
      });

    document
      .getElementById("movementDropdown")
      .addEventListener("click", async function (event) {
        event.preventDefault();
        let dropdowntext = event.target.innerHTML;
        document.getElementById(
          "movementDropdowntext"
        ).innerHTML = dropdowntext;
        SyncExercise();
      });

    document
      .getElementById("levelDropdown")
      .addEventListener("click", async function (event) {
        event.preventDefault();
        let dropdowntext = event.target.innerHTML;
        document.getElementById("levelDropdowntext").innerHTML = dropdowntext;
        SyncExercise();
      });

    function SyncExercise() {
      let exerciseArray = [];
      let exercisesArray = db
        .collection("Exercises")
        .get()
        .then((querySnapshot) => {
          let Muscle = document.getElementById("muscleDropdowntext").innerHTML;
          let Equipment = document.getElementById("equipmentDropdowntext")
            .innerHTML;
          let Movement = document.getElementById("movementDropdowntext")
            .innerHTML;
          let Level = document.getElementById("levelDropdowntext").innerHTML;
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

            if (
              (doc.data()["Main Muscle Group"] == Muscle ||
                Muscle == "Primary Muscle Trained:") &&
              (doc.data()["Type of equipment"] == Equipment ||
                Equipment == "Type of Equipment:") &&
              (doc.data()["Joint"] == Movement ||
                Movement == "Type of Movement:") &&
              (doc.data()["Level"] == Level || Level == "Level:")
            ) {
              exerciseArray.push(doc.data());
            }
          });
          document.querySelector(".exercises").innerHTML = "";
          renderExercises(exerciseArray, ".exercises");
        });
    }

    function SyncFavorites() {
      let FavortiesArray = db
        .collection("Favorites")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());

            if (doc.data()["User ID"] == user.uid) {
              console.log(
                doc.data()["User ID"],
                user.uid,
                doc.data()["Exercise Name"]
              );
              let Buttontext = doc.data()["Exercise Name"] + "-buttonfav";
              let Buttontext2 = doc.data()["Exercise Name"] + "-buttonrem";
              console.log(document.getElementById(Buttontext));
              document.getElementById(Buttontext).classList.add("display-none");
              document
                .getElementById(Buttontext2)
                .classList.remove("display-none");
              document
                .getElementById(Buttontext2)
                .classList.add("display-show");
            }
          });
        });
    }

    SyncFavorites();
  } else {
    // Signed out
    console.log("signed out");
    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "index.html",
    };
    // Starts FirebaseUI Auth
    ui.start(".sign-in-or-sign-out", authUIConfig);
  }
});

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function ShowDropdown(id) {
  document.getElementById(id).classList.toggle("display-show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("display-show")) {
        openDropdown.classList.remove("display-show");
      }
    }
  }
};

function renderExercises(exercisesArrays, ArrayClass) {
  for (let i = 0; i < exercisesArrays.length; i++) {
    let exercise = exercisesArrays[i];
    document.querySelector(ArrayClass).insertAdjacentHTML(
      "beforeend",
      `
  <tr id=>
  <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
    ${exercise["Exercise Name"]}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
  ${exercise["Type of equipment"]}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
  ${exercise["Recommended Sets"]}
  </td>
  <td class="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
  ${exercise["Recommended Reps"]}
  </td>
  <td id="${exercise["Exercise Name"]}-buttonfav" class=" px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <a href="#" class="${exercise["Exercise Name"]}-button text-indigo-600 hover:text-indigo-900" onclick="AddtoFavourites('${exercise["Exercise Name"]}')">Add to favourites</a>
  </td>
    <td id="${exercise["Exercise Name"]}-buttonrem" class="display-none px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <a href="#" class="${exercise["Exercise Name"]}-button text-indigo-600 hover:text-indigo-900" onclick=" RemoveFavourites('${exercise["Exercise Name"]}')">Remove from favourites</a>
  </td>
</tr>`
    );
  }
}

function AddtoFavourites(exerciseName) {
  firebase.auth().onAuthStateChanged(function (user) {
    event.preventDefault();
    let UserID = user.uid;
    console.log(UserID, exerciseName);
    let db = firebase.firestore();
    db.collection("Favorites").doc(`${UserID}-${exerciseName}`).set({
      "User ID": UserID,
      "Exercise Name": exerciseName,
    });
    let Buttontext = exerciseName + "-buttonfav";
    let Buttontext2 = exerciseName + "-buttonrem";
    console.log(document.getElementById(Buttontext));
    document.getElementById(Buttontext).classList.remove("display-show");
    document.getElementById(Buttontext).classList.add("display-none");
    document.getElementById(Buttontext2).classList.remove("display-none");
    document.getElementById(Buttontext2).classList.add("display-show");
  });
}

function RemoveFavourites(exerciseName) {
  firebase.auth().onAuthStateChanged(function (user) {
    event.preventDefault();
    let UserID = user.uid;
    console.log(UserID, exerciseName);
    let db = firebase.firestore();
    db.collection("Favorites").doc(`${UserID}-${exerciseName}`).delete();
    let Buttontext = exerciseName + "-buttonrem";
    let Buttontext2 = exerciseName + "-buttonfav";
    console.log(document.getElementById(Buttontext));
    document.getElementById(Buttontext).classList.remove("display-show");
    document.getElementById(Buttontext).classList.add("display-none");
    document.getElementById(Buttontext2).classList.remove("display-none");
    document.getElementById(Buttontext2).classList.add("display-show");
  });
}
