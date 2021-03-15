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
        firebase.auth().signOut();
        document.location.href = "index.html";
      });

    {
      document
        .querySelector(`.my-workout`)
        .addEventListener("click", async function (event) {
          event.preventDefault();
          await db.collection("Users").doc(user.uid).set({
            show: "my-workout",
            name: user.displayName,
            email: user.email,
          });
          document.querySelector(".header").innerHTML = "My Workout";
          document.querySelector(".workout").classList.remove("display-none");
          document
            .querySelector(".fitness-database-filters")
            .classList.remove("display-show");
          document
            .querySelector(".fitness-database-filters")
            .classList.add("display-none");
        });
    }

    {
      document
        .querySelector(`.fitness-database`)
        .addEventListener("click", async function (event) {
          event.preventDefault();
          await db.collection("Users").doc(user.uid).set({
            show: "fitness-database",
            name: user.displayName,
            email: user.email,
          });
          document.querySelector(".header").innerHTML = "Fitness Database";
          document
            .querySelector(".fitness-database-filters")
            .classList.remove("display-none");
          document.querySelector(".workout").classList.remove("display-show");
          document.querySelector(".workout").classList.add("display-none");
        });

      document
        .querySelector(`.add-workout`)
        .addEventListener("click", async function (event) {
          event.preventDefault();
          document
            .querySelector(".workout-form")
            .classList.remove("display-none");
          document
            .querySelector(".add-workout")
            .classList.remove("display-show");
          document.querySelector(".add-workout").classList.add("display-none");
        });

      SyncExercise();

      document
        .getElementById("muscleDropdown")
        .addEventListener("click", async function (event) {
          event.preventDefault();
          let dropdowntext = event.target.innerHTML;
          document.getElementById(
            "muscleDropdowntext"
          ).innerHTML = dropdowntext;
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
            let Muscle = document.getElementById("muscleDropdowntext")
              .innerHTML;
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
            renderExercises(exerciseArray);
          });
      }
    }
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

function WorkoutForm() {
  document.querySelector(".add-workout").classList.remove("display-none");
  document.querySelector(".workout-form").classList.remove("display-show");
  document.querySelector(".workout-form").classList.add("display-none");
  let ExcerciseID = parseFloat(
    document.getElementById("Workout-Form").ExerciseID.value
  );
  let Datenow = parseFloat(document.getElementById("Workout-Form").date.value);
  let Reps = parseFloat(document.getElementById("Workout-Form").Reps.value);
  let SetNumber = parseFloat(document.getElementById("Workout-Form").Set.value);
  let Weight = parseFloat(document.getElementById("Workout-Form").Weight.value);
  firebase.auth().onAuthStateChanged(function (user) {
    let UserID = user.uid;
    let db = firebase.firestore();
    db.collection("Workout").add({
      "Exercise ID": ExcerciseID,
      Date: Datenow,
      Reps: Reps,
      "Set Number": SetNumber,
      "User ID": UserID,
      Weight: Weight,
    });
  });
}

function renderExercises(exercisesArrays) {
  for (let i = 0; i < exercisesArrays.length; i++) {
    let exercise = exercisesArrays[i];
    document.querySelector(".exercises").insertAdjacentHTML(
      "beforeend",
      `
  <tr>
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
  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <a href="#" class="${exercise["Exercise Name"]}-button text-indigo-600 hover:text-indigo-900" onclick="AddtoFavourites()">Add to favourites</a>
  </td>
</tr>`
    );
  }
}

function AddtoFavourites() {
  firebase.auth().onAuthStateChanged(function (user) {
    let UserID = user.uid;
    console.log(UserID);
    let db = firebase.firestore();
    db.collection("Favorites").add({
      "User ID": UserID,
    });
  });
}

function RemoveFavourites() {
  firebase.auth().onAuthStateChanged(function (user) {
    let UserID = user.uid;
    console.log(UserID);
    let db = firebase.firestore();
    db.collection("Favorites").delete({
      "User ID": UserID,
    });
  });
}
