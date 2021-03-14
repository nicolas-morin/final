firebase.auth().onAuthStateChanged(async function (user) {
  let db = firebase.firestore();
  console.log(user);
  if (user) {
    // Signed in
    console.log("signed in");
    db.collection("users").doc(user.uid).set({
      name: user.displayName,
      email: user.email,
    });
    document.querySelector(".sign-in-or-sign-out").innerHTML = `
    <button class="text-pink-500 underline sign-out">Sign Out</button>
    `;
    document
      .querySelector(".sign-out")
      .addEventListener("click", function (event) {
        console.log("sign out clicked");
        fire.aut().signOut();
        document.location.href = "index.html";
      });
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
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};
