import { signIn } from "./auth.js";

async function onLoginClick(){
    try {
      const user = document.getElementById("username").value;
      const pw = document.getElementById("password").value;
      const response = await signIn(user, pw);
      console.log(`good: ${user}, ${pw}, ${response}`);
    } catch (e){
      console.log(e)
    }
  }


document.addEventListener("DOMContentLoaded", async() => {
    const loginButton = document.getElementById("button_login");
    loginButton.addEventListener("click", async () => {
        onLoginClick();
    })
});