<template>
  <div class="favourites list">
    <app-header></app-header>
    <h1 class="subheader">Favourites</h1>
    <ul class="favourites-list">
      <li class="segment" v-for="(listing, index) in list" :key="index">
        <img :src="listing.cover_photo" alt="picture" :id="listing.id" class="main-pic" v-on:click="route($event)"/>
        <div class="info">
          <div class="title" :id="listing.id" v-on:click="route($event)">
            <h3 class="name">
              {{ listing.name }}
            </h3>

            <b-button
              class="button"
              variant="outline-danger"
              v-bind:index="index"
              v-bind:id="listing.id"
              v-on:click="remove($event)"
              >Remove</b-button
            >
          </div>
          <p>
            {{ listing.description }} 
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from "firebase";
import database from "../firebase.js";
import Header from "./UI/Header.vue";

export default {
  data() {
    return {
      list: [],
      idList: [],
    };
  },

  components: {
    "app-header": Header,
  },

  created() {
    this.fetchItems();
  },

  methods: {
    getListing: async function () {
      var arr = [];
      await database
        .collection("listings")
        .get()
        .then((querySnapShot) => {
          let item = {};
          querySnapShot.docs.forEach((doc) => {
            item = { ...doc.data(), ["id"]: doc.id };
            arr.push(item);
          });
        });
      return arr;
    },

    getUser: async function () {
      var arr = [];
      await database
        .collection("users")
        .get()
        .then((querySnapShot) => {
          let item = {};
          querySnapShot.docs.forEach((doc) => {
            item = { ...doc.data(), ["id"]: doc.id };

            arr.push(item);
          });
        });
      return arr;
    },

    fetchItems: async function () {
      var listArr = await this.getListing();

      var user = firebase.auth().currentUser;

        await database.collection('users').doc(user.uid).get().then(snapshot => {
            const data = snapshot.data();
            this.idList = data.favourites;
        })

      for (var j = 0; j < listArr.length; j++) {
        if (this.idList.includes(listArr[j].id)) {
            this.list.push(listArr[j]);
        }
      }

    },

    remove: function (event) {
      let index = event.currentTarget.getAttribute("index");
      this.list.splice(index,1)
      let doc_id = event.currentTarget.getAttribute("id")
      var newList = [];
      for (var k = 0; k < this.idList.length; k++) {
          if (doc_id != this.idList[k]) {
              newList.push(this.idList[k]);
          }
      }

      this.idList = newList;

      let user = firebase.auth().currentUser;
      database
        .collection("users")
        .doc(user.uid)
        .update({ favourites: this.idList })
        .then();
    },

    route: function(event) {
      let id = event.currentTarget.getAttribute("id")
      this.$router.push({ name:"indiv", params: { id: id}})
    }
  },
};
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin: auto;
  padding-left: 0;
}

li {
  display: flex;
  width: 60%;
  height: 200px;
  text-align: center;
  font-family: "Ubuntu", sans-serif;
  margin: auto;
}

.title {
  padding-bottom: 12px;
  border-bottom: 2px solid grey;
  display: flex;
  font-size: 35px;
  margin-bottom: 15px;
  cursor: pointer;
}

.button {
  font-size: 20px;
  margin-top: 0px;
  float: right;
  margin-left: auto;
}

.name {
  font-size: 35px;
  text-align: left;
  float: left;
  margin-bottom: 0px;
}


.subheader {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 40px;
  margin-bottom: 15px;
  width: 30%;
  margin: auto;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 2px solid grey;
}

.segment {
  margin-top: 40px;
  padding-bottom: 40px;
  padding-left: 50px;
  padding-right: 50px;
  border-bottom: 2px solid wheat;
}

.main-pic {
  float: left;
  border-radius: 15px;
  margin-right: 10px;
}

.info {
  width: 100%;
  float: right;
  margin: auto;
  padding-left: 20px;
}

.main-pic {
  float: left;
  border-radius: 15px;
  width: 40%;
  height: 100%;
  cursor: pointer;
}

</style>
