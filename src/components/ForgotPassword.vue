<template>
  <div>
    <app-header></app-header>
    <div class="box">
      <p class="title">Reset Password</p>
      <div id="error-container"></div>
      <form class="form">
        <input
          class="email"
          type="email"
          align="center"
          placeholder="Email"
          v-model="resetform.email"
          required
        />
        <button class="submit" type="submit" align="center" v-on:click="submit">
          <span>Reset</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import Header from "./UI/Header.vue";
import firebase from "firebase";

export default {
  data() {
    return {
      resetform: {
        email: "",
      },
    };
  },
  components: {
    "app-header": Header,
  },

  methods: {
    submit: function (e) {
      e.preventDefault();

      if (!this.resetform.email) {
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

      firebase
        .auth()
        .sendPasswordResetEmail(this.resetform.email)
        .then(() => {
            document.getElementById("error-container").innerHTML = "Check your email to reset password"
            document.getElementById("error-container").style.backgroundColor =
          "rgb(139, 255, 139)";
        document.getElementById("error-container").style.borderRadius = "20px";
        document.getElementById("error-container").style.width = "72.5%";
        document.getElementById("error-container").style.margin = "auto";
        document.getElementById("error-container").style.padding = "3px";
        document.getElementById("error-container").style.marginBottom = "5px";
        document.getElementById("error-container").style.fontFamily =
          '"Ubuntu", sans-serif';
        document.getElementById("error-container").style.fontWeight = "500";
        document.getElementsByClassName("title")[0].style.marginBottom = "8px";
        })
        .catch((err) => {
            console.log(err)
          if (err.code == "auth/user-not-found") {
              document.getElementById("error-container").innerHTML = "Email not registered";
          } else if (err.code == "auth/invalid-email") {
              document.getElementById("error-container").innerHTML = "Invalid Email Format"
          }

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
        });
    },
  },
};
</script>

<style scoped>
.box {
  background-color: #ffffff;
  width: 400px;
  height: 240px;
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

.email,
.pass {
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

.email:focus,
.pass:focus {
  outline: none;
  border-color: darkgrey;
}

.email:focus::-webkit-input-placeholder,
.pass:focus::-webkit-input-placeholder {
  opacity: 0;
}

.submit {
  display: inline-block;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 20px;
  color: whitesmoke;
  background: linear-gradient(to right, #9c27b0, #e040fb);
  border: 0px;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 10px;
  padding-top: 10px;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 13px;
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
  color: rgb(253, 200, 200);
}
</style>