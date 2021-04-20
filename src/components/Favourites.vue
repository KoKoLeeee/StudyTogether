<template>
  <div class="favourites list">
    <app-header></app-header>
    <h1 class="subheader">Favourites</h1>
    <ul class="favourites-list">
      <li class="segment" v-for="(listing, index) in list" :key="index">
        <img :src="listing.cover_photo" alt="picture" class="main-pic" />
        <div class="info">
          <div class="title">
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
        <!-- <div id="name">
          <b> {{ listing.name }} </b>
        </div>
        <button class="button" v-bind:index="index" v-on:click="remove($event)">
        Button to cancel bookmark -->
        <!-- <button
          class="button"
          v-bind:index="index"
          v-on:click="remove($event)"
        >
          Remove
        </button> -->
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
            // console.log(item)
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

            // console.log(item)
            arr.push(item);
          });
        });
      return arr;
    },

    fetchItems: async function () {
      // await setTimeout(() => {}, 1000)
      var listArr = await this.getListing();
      // var userArr = await this.getUser()
      console.log("get listings" + listArr);

      var user = firebase.auth().currentUser;

      console.log(user);

        await database.collection('users').doc(user.uid).get().then(snapshot => {
            const data = snapshot.data();
            this.idList = data.favourites;
            //this.list = new Array(this.idList.length)
            console.log(this.idList)
        })
    
    //   for (var i = 0; i < userArr.length; i++) {
    //     if (userArr[i].id == user.id) {
    //       this.idList = userArr[i].favourites;
    //     }
    //   }

      for (var j = 0; j < listArr.length; j++) {
          console.log(this.idList)
          console.log(listArr[j].id)
            console.log(this.idList.includes(listArr[j].id))
        if (this.idList.includes(listArr[j].id)) {
            //this.list[this.idList.indexOf(listArr[j].id)] = listArr[j]
            this.list.push(listArr[j]);
        }
      }

      console.log(this.list);

      //   if (!this.idList.empty) {
      //     await database
      //       .collection("listings")
      //       .get()
      //       .then((snapshot) => {
      //         let item = {};
      //         snapshot.docs.forEach((doc) => {
      //           if (this.idList.includes(doc.id)) {
      //             item = { ...doc.data(), ["id"]: doc.id };
      //             this.list.push(item); //push the list of favourites into list
      //           }
      //         });
      //       });
      //   }
    },

    remove: function (event) {
      /**
      let doc_index = event.target.getAttribute("index");

      console.log(event.target);
      //console.log(doc_id);
      this.idList.splice(doc_index, 1);
      **/
      let index = event.currentTarget.getAttribute("index");
      this.list.splice(index,1)
      let doc_id = event.currentTarget.getAttribute("id")
      console.log(doc_id);
      var newList = [];
      for (var k = 0; k < this.idList.length; k++) {
          if (doc_id != this.idList[k]) {
              newList.push(this.idList[k]);
          }
      }
      console.log(newList);

      this.idList = newList;

      let user = firebase.auth().currentUser;
      // var fav = [];
      // var newFav = [];
      database
        .collection("users")
        .doc(user.uid)
        .update({ favourites: this.idList })
        .then();
        //.get()
        //.then((snapshot) => {
          //const data = snapshot.data();

          //var fav = data.favourites;

          //const indexOf = fav.indexOf(doc_id);

          //fav.splice(indexOf, 1);

         // database
         //   .collection("users")
         //   .doc(user.uid)
         //   .update({ favourites: fav });

          // snapshot.docs.forEach(doc => {
          // if (doc.id == user.uid) {//get the user
          //     fav = doc.data().favourites;
          //     console.log(fav);
          //     for (let i = 0; i < fav.length; i++) {
          //         if (fav[i] != doc_id) {
          //             newFav.push(fav[i]);
          //             console.log(newFav[i] + "added");
          //         }
          //     }
          //     database.collection('users').doc(user.uid).update({"favourites": newFav});
          //     console.log(newFav);
          //     console.log("remove");
          // }
          // })
        //})
    },
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
  /* height: 80%; */
  /* position: relative; */
  text-align: center;
  /* padding: 10px; */
  /* border: 3px solid #ED7A78; */
  /* margin: 10px; */
  /* margin-top: 5px; */
  /* margin-bottom: 0px; */
  /* padding-bottom: 1px; */
  /* border-radius: 25px; */
  font-family: "Ubuntu", sans-serif;
  margin: auto;
  /* margin: 0 0 10 0; */
}

.title {
  padding-bottom: 12px;
  border-bottom: 2px solid grey;
  display: flex;
  font-size: 35px;
  margin-bottom: 15px;
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
  /* position: relative; */
  float: left;
  /* right:20%; */
  border-radius: 15px;
  width: 40%;
  height: 100%;
}

/* #main-pic {
  position: relative;
  left: 1px;
  border-radius: 15px;
  width: 200px;
  height: 150px;
}

#name {
  position: relative;
  left: 30px;
  top: 15px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 30px;
  font-weight: 1000;
} */
</style>
