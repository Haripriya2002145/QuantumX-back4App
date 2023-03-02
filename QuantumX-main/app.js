//var Parse = require('parse/node');

Parse.initialize(
  "CPDvupg4KTSi4tSczHqEkika713yGeWeERsDRklm",
  "YaYm6qRcvM5AtnR3yyS1b20kEsoBUO2ebtS4e1y1"
);
Parse.serverURL = 'https://parseapi.back4app.com/';


// Registration Pages
async function logIn() {
    const username = document.getElementById("username").value;
    const pass = document.getElementById("pass").value;
    const formContainer = document.getElementById("form-container");
    const container = document.getElementById("container");
    let span = document.getElementById("returnMessage");

    const onFulfilled = () => {
        //formContainer.parentNode.removeChild(formContainer);
        //container.className = "";
        span.textContent = "Successful Log In!";
        window.open("website.html", "_self");
    };
  
    const onRejected = () => {
        span.textContent = "Incorrect username or password";
        //span.className = "redSpan";
    };
  
    const user = await Parse.User.logIn(username, pass).then(
      onFulfilled,
      onRejected
    );
}
async function signUp() {
    const username = document.getElementById("username").value;
    const pass = document.getElementById("pass").value;
    let span = document.getElementById("returnMessage");
    const user = new Parse.User();
    user.set("username", username);
    user.set("password", pass);
    

    try {
        await user.signUp();
        span.textContent = "Successfully signed Up";
        //span.className = "blueSpan";
        window.open("website.html", "_self");
    } catch (error) {
        span.textContent = "Error: " + error.code + " " + error.message;
        //span.className = "redSpan";
    }
}

// Add on click listener to call the create parse user function
document.getElementById("sign").addEventListener("click", async function () {
    signUp();
});

// Add on click listener to call the create parse user function
document.getElementById("login").addEventListener("click", async function () {
    logIn();
});
