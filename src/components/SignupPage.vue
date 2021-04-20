<template>
  <div>
    <app-header></app-header>
    <div class="box">
      <p class="title">Register</p>
      <div id="error-container"></div>
      <form class="form">
        <input
          class="email"
          type="email"
          align="center"
          placeholder="Email"
          v-model="signup.email"
          required
        />
        <input
          class="user"
          type="text"
          align="center"
          placeholder="Name"
          v-model="signup.name"
          required
        />
        <input
          class="pass"
          type="password"
          align="center"
          placeholder="Password"
          v-model="signup.password"
          required
        />
        <input
          class="number"
          type="text"
          align="center"
          placeholder="Phone Number"
          v-model="signup.number"
          required
        />
        <br />
        <button class="submit" type="submit" align="center" v-on:click="submit">
          <span>Sign Up</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Header from "./UI/Header.vue";
import firebase from "firebase";
import database from "../firebase.js";

export default {
  data() {
    return {
      signup: {
        email: "",
        password: "",
        name: "",
        number: "",
      },
    };
  },
  components: {
    "app-header": Header,
  },

  methods: {
    submit: async function (e) {
      e.preventDefault();

      if (
        !this.signup.email ||
        !this.signup.password ||
        !this.signup.name ||
        !this.signup.number
      ) {
        document.getElementById("error-container").innerHTML =
          "Fill in all fields";
        document.getElementById("error-container").style.backgroundColor =
          "rgb(255, 168, 168)";
        document.getElementById("error-container").style.borderRadius = "20px";
        document.getElementById("error-container").style.width = "72.5%";
        document.getElementById("error-container").style.margin = "auto";
        document.getElementById("error-container").style.padding = "3px";
        document.getElementById("error-container").style.marginBottom = "5px";
        document.getElementById("error-container").style.fontFamily =
          '"Ubuntu", sans-serif';
        document.getElementById("error-container").style.fontWeight = "500";
        document.getElementsByClassName("title")[0].style.marginBottom = "8px";
        return;
      }

      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.signup.email, this.signup.password)
        .then()
        .catch((err) => {
          console.log(err);
          if (err.code == "auth/invalid-email") {
            document.getElementById("error-container").innerHTML =
              "Invalid Email Format";
          } else if (err.code == "auth/email-already-in-use") {
            document.getElementById("error-container").innerHTML =
              "Email is already in use";
          } else if (err.code == "auth/weak-password") {
            document.getElementById("error-container").innerHTML =
              "Password should be at least 6 characters";
          }
          document.getElementById("error-container").style.backgroundColor =
            "rgb(255, 168, 168)";
          document.getElementById("error-container").style.borderRadius =
            "20px";
          document.getElementById("error-container").style.width = "72.5%";
          document.getElementById("error-container").style.margin = "auto";
          document.getElementById("error-container").style.padding = "3px";
          document.getElementById("error-container").style.marginBottom = "5px";
          document.getElementById("error-container").style.fontFamily =
            '"Ubuntu", sans-serif';
          document.getElementById("error-container").style.fontWeight = "500";
          document.getElementsByClassName("title")[0].style.marginBottom =
            "8px";
        });

      var data = {
        name: this.signup.name,
        email: this.signup.email,
        number: this.signup.number,
        favourites: new Array(),
        usertype: 'customer'
      };

      var user = firebase.auth().currentUser;

      database.collection("users").doc(user.uid).set(data);

      await user.updateProfile({
        displayName: this.signup.name,
      });

      await user.sendEmailVerification();

      firebase.auth().signOut();

      alert(
        "Account created successfully! Verify your account with link sent to your email!"
      );

      this.$router.push({ path: "/login" });
     
    },
  },
};
</script>

<style scoped>
.box {
  background-color: #ffffff;
  width: 400px;
  height: 430px;
  margin: 7em auto;
  border-radius: 40px;
  box-shadow: 0px 0px 10px 10px lightgrey;
}

.title {
  padding-top: 40px;
  color: #8c55aa;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 23px;
}

.user,
.pass,
.email,
.number {
  width: 75%;
  color: darkgrey;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 1px;
  background: whitesmoke;
  padding: 10px;
  border-radius: 20px;
  box-sizing: border-box;
  border: 2px solid white;
  text-align: center;
  margin-bottom: 20px;
  font-family: "Ubuntu", sans-serif;
}

.user:focus,
.pass:focus,
.email:focus,
.number:focus {
  outline: none;
  border-color: darkgrey;
}

.user:focus::-webkit-input-placeholder,
.pass:focus::-webkit-input-placeholder,
.email:focus::-webkit-input-placeholder,
.number:focus::-webkit-input-placeholder {
  opacity: 0;
}

.submit {
  display: inline-block;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 20px;
  color: whitesmoke;
  background: linear-gradient(to right, #9c27b0, #e040fb);
  border: 0;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  padding-top: 10px;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 13px;
  transition: 0.2s;
}

.forgot {
  color: plum;
  padding-top: 10px;
  font-weight: bold;
}

.signup {
  font-weight: bold;
}

a {
  color: plum;
  text-decoration: none;
}

.submit span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.submit span:after {
  content: "\00bb";
  position: absolute;
  opacity: 0;
  right: -40px;
  transition: 0.5s;
}

.submit:hover span {
  padding-right: 15px;
}

.submit:hover span:after {
  opacity: 1;
  right: -10px;
}

.submit:focus {
  outline: none;
}
</style>