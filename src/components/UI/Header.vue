<template>
  <div>
    <header id="header" class="alt">
      <nav class="stroke">
        <strong><h1>Study Together</h1></strong>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li v-if="loggedIn != 'owner'"><router-link to="/listings">Listings</router-link></li>
          <li v-if="loggedIn == 'customer'"><router-link to="/bookings">Bookings</router-link></li>
          <li v-if="loggedIn == 'customer'"><router-link to="/favourites">Favourites</router-link></li>
          <li v-if="loggedIn == 'owner'"><router-link to="/mybiz">My Biz</router-link></li>
          <li v-if="loggedIn == 'owner'"><router-link :to="{path: '/listings/' + this.userID }">My Listings</router-link></li>
          <li v-if="loggedIn == 'owner'"><router-link to="/bizBookings">Bookings</router-link></li>
          <li v-if="loggedIn != 'none'"><router-link to="/chat">Chats</router-link></li>
          <li v-if="loggedIn == 'customer'"><router-link to="/userChart">My Stats</router-link></li>
          <li v-if="loggedIn == 'owner'"><router-link to ="/bizdashboard">Business Stats</router-link></li>
          <li v-if="loggedIn != 'none'"><router-link v-on:click.native="signOut" to="/">Logout</router-link></li>
          <li v-else><router-link to="/login">Login</router-link></li>
        </ul>
      </nav>
    </header>
    <br />
  </div>
</template>

<script>
import firebase from 'firebase';
import database from '../../firebase.js';

export default {
  
  data() {
    return {
      loggedIn: "none",
      userID: "",
    };
  },

  methods: {
    setupFirebase: async function () {
      firebase.auth().onAuthStateChanged(async user => {
        if (user) {
          this.userID = user.uid
          console.log(this.userID)
          await database.collection('users').doc(user.uid).get().then(doc => {
            const data = doc.data()
            this.loggedIn = data.usertype;
          })
        } else {
          this.loggedIn = "none";
          this.userID = "";
        }
      })
    },

    signOut: function() {
      this.loggedIn = 'none';
      this.userID = "";
      firebase.auth().signOut().catch(err => console.log(err))
    }
  },
  
  created() {
    this.setupFirebase();
  }
};
</script>

<style scoped>
header {
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
}

h1 {
  font-family: monospace;
  font-size: 3em;
}

nav {
  width: 95%;
  margin: 0 auto;
  background: #fff;
  padding: 5px 0;
  box-shadow: 0px 5px 0px #dedede;
}

nav ul {
  list-style: none;
  text-align: center;
  padding-left: 0px;
}
nav ul li {
  display: inline-block;
}
nav ul li a {
  display: block;
  padding: 15px;
  text-decoration: none;
  color: #aaa;
  font-weight: 800;
  text-transform: uppercase;
  margin: 0 10px;
}
nav ul li a,
nav ul li a:after,
nav ul li a:before {
  transition: all 0.5s;
}
nav ul li a:hover {
  color: #555;
}

nav.stroke ul li a,
nav.fill ul li a {
  position: relative;
}

nav.stroke ul li a:after,
nav.fill ul li a:after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 0%;
  content: ".";
  color: transparent;
  background: #333;
  height: 1px;
}

nav.stroke ul li a:hover:after {
  width: 100%;
}

nav.fill ul li a:after {
  text-align: left;
  content: ".";
  margin: 0;
  opacity: 0;
}

nav.fill ul li a:hover {
  color: #023f1c;
  z-index: 1;
}
nav.fill ul li a:hover:after {
  z-index: -10;
  animation: fill 1s forwards;
  -webkit-animation: fill 1s forwards;
  -moz-animation: fill 1s forwards;
  opacity: 1;
}

</style>