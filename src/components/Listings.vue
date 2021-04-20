<template>
  <div>
    <app-header></app-header>

    <div class="toptopbar">
      <div class="topbar">
        <b-input-group class="searchbar">
          <b-form-input
            class="search"
            v-model="searchString"
            placeholder="What are you looking for?"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-secondary" v-b-modal.modal-prevent-closing
              ><b-icon icon="filter"></b-icon
            ></b-button>
          </b-input-group-append>
        </b-input-group>

        <div class="sorting">
          <b-dropdown variant="outline-secondary" text="SortBy">
            <b-dropdown-item
              v-for="option in sortOptions"
              :key="option.value"
              :value="option.value"
              @click="sortBy = option.value"
            >
              {{ option.text }}
            </b-dropdown-item>
            <template v-slot:button-content>
              {{ sortBy }}
            </template>
          </b-dropdown>
          <b-button
            
            variant="outline-secondary"
            v-on:click="ascending = !ascending"
            class="sort-button"
          >
            <b-icon v-if="ascending" icon="sort-down"></b-icon>
            <b-icon v-else icon="sort-down-alt"></b-icon>
          </b-button>
        </div>
      </div>

      <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="Choose your Filters"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
        ok-only
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <h4>Location</h4>
          <b-form-checkbox-group
            v-model="location"
            :options="locationOptions"
             class="checkgroup"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-checkbox-group>
          <h4>Price Level</h4>
          <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="price"
            :aria-describedby="ariaDescribedby"
            class="checkgroup"
          >
            <b-form-checkbox value="cheap"
              ><b-icon icon="cash-stack" class="filter-cash"></b-icon
            ></b-form-checkbox>
            <b-form-checkbox value="medium"
              ><b-icon icon="cash-stack" class="filter-cash"></b-icon
              ><b-icon icon="cash-stack" class="filter-cash"></b-icon
            ></b-form-checkbox>
            <b-form-checkbox value="expensive"
              ><b-icon icon="cash-stack" class="filter-cash"></b-icon
              ><b-icon icon="cash-stack" class="filter-cash"></b-icon
              ><b-icon icon="cash-stack" class="filter-cash"></b-icon
            ></b-form-checkbox>
          </b-form-checkbox-group>
          <h4>Noise Level</h4>
          <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="noise"
            :aria-describedby="ariaDescribedby"
            class="checkgroup"
          >
            <b-form-checkbox :value="1"
              ><b-icon icon="volume-off" class="filter-volume"></b-icon
            ></b-form-checkbox>
            <b-form-checkbox :value="2"
              ><b-icon icon="volume-off" class="filter-volume"></b-icon
              ><b-icon icon="volume-down" class="filter-volume"></b-icon
            ></b-form-checkbox>
            <b-form-checkbox :value="3"
              ><b-icon icon="volume-off" class="filter-volume"></b-icon
              ><b-icon icon="volume-down" class="filter-volume"></b-icon
              ><b-icon icon="volume-up" class="filter-volume"></b-icon
            ></b-form-checkbox>
          </b-form-checkbox-group>

        </form>
      </b-modal>
    </div>

    
    <div class="listings">
      <ul class="listings-list">
        <li v-for="listing in displayedList" :key="listing.id">
          <img
            class="main-pic"
            v-bind:src="listing.cover_photo"
            height="30px"
            v-bind:id="listing.id"
            v-on:click="route($event)"
          />
          <div class="title">
            <h5 class="name" v-bind:id="listing.id" v-on:click="route($event)">
              {{ listing.name }}
            </h5>

            <b-icon
              v-if="favourites.includes(listing.id)"
              icon=" bookmark-fill"
              style="cursor: pointer"
              class="bookmark"
              v-bind:id="listing.id"
              v-on:click="unbookmark($event)"
            ></b-icon>
            <b-icon
              v-else
              icon="bookmark"
              style="cursor: pointer"
              class="bookmark"
              v-bind:id="listing.id"
              v-on:click="bookmark($event)"
            ></b-icon>
          </div>
          <div class="details">
            <p class="location" style="font-size: 25px">
              <b-icon
                icon="geo-fill"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 50px;
                  color: red;
                "
              ></b-icon>
              {{ listing.loc_neighbourhood }}
            </p>
            <p class="price" style="font-size: 25px">
              <b-icon
                icon="cash-stack"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 50px;
                  color: green;
                "
              ></b-icon>
              ${{ listing.price }}
            </p>

            <p v-if="listing.noise == 1" class="noise" style="font-size: 25px">
              <b-icon
                icon="volume-mute"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 50px;
                "
              ></b-icon>
              Quiet
            </p>

            <p v-if="listing.noise == 2" class="noise" style="font-size: 25px">
              <b-icon
                icon="volume-down"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 50px;
                "
              ></b-icon>
              Normal
            </p>

            <p v-if="listing.noise == 3" class="noise" style="font-size: 25px">
              <b-icon
                icon="volume-up"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 50px;
                "
              ></b-icon>
              Some Noise
            </p>

            <p class="reviews" style="font-size: 25px">
              <b-icon
                v-if="listing.rating >= 1"
                icon="star-fill"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-else-if="listing.rating >= 0.5"
                icon="star-half"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-if="listing.rating >= 2"
                icon="star-fill"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-else-if="listing.rating >= 1.5"
                icon="star-half"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-if="listing.rating >= 3"
                icon="star-fill"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-else-if="listing.rating >= 2.5"
                icon="star-half"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-if="listing.rating >= 4"
                icon="star-fill"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-else-if="listing.rating >= 3.5"
                icon="star-half"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-if="listing.rating >= 5"
                icon="star-fill"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
              <b-icon
                v-else-if="listing.rating >= 4.5"
                icon="star-half"
                style="
                  margin-top: auto;
                  margin-bottom: auto;
                  margin-right: 5px;
                  color: gold;
                "
              ></b-icon>
            </p>
          </div>
        </li>
        <div class="divider"></div>
      </ul>
    </div>
  </div>
</template>

<script>
import Header from "./UI/Header.vue";
import database from "../firebase.js";
import firebase from "firebase";

export default {
  data() {
    return {
      list: [],
      searchString: "",
      showFilter: false,
      isModalVisible: false,
      location: [],
      price: [],
      noise: [],
      locationOptions: [
        { item: "North", name: "North" },
        { item: "South", name: "South" },
        { item: "East", name: "East" },
        { item: "West", name: "West" },
        { item: "Central", name: "Central" },
      ],
      sortOptions: [
        { value: "Name", text: "Name" },
        { value: "Ratings", text: "Ratings" },
        { value: "Price", text: "Price" },
        { value: "Noise", text: "Noise" },
      ],
      sortBy: "Sort By",
      ascending: true,
      docid: '',
      favourites: [],
    };
  },

  components: {
    "app-header": Header,
  },

  computed: {
    //computed method to watch over search, filter and sort to update displayed list
    displayedList: function () {
      let tempList = this.list;

      //search method
      if (this.searchString != "" && this.searchString) {
        tempList = tempList.filter((item) =>
          item.name.toLowerCase().includes(this.searchString.toLowerCase())
        );
      }

      //filter method
      var location = ["North", "South", "East", "West", "Central"];
      var price = ["cheap", "medium", "expensive"];
      var noise = [1, 2, 3];
      if (this.location.length != 0) {
        location = this.location;
      }

      if (this.price.length != 0) {
        price = this.price;
      }

      if (this.noise.length != 0) {
        noise = this.noise;
      }

      tempList = tempList.filter(
        (x) =>
          location.includes(x["loc_filter"]) &&
          price.includes(x["price_filter"]) &&
          noise.includes(x["noise"])
      );

      //sort method
      if (this.sortBy == "Name") {
        tempList = tempList.sort((x, y) => {
          let fx = x.name.toLowerCase(),
            fy = y.name.toLowerCase();
          return fx < fy ? -1 : 1;
        });
      } else if (this.sortBy == "Ratings") {
        tempList = tempList.sort((x, y) => x.rating - y.rating);
      } else if (this.sortBy == "Price") {
        tempList = tempList.sort((x, y) => x.price - y.price);
      } else {
        tempList = tempList.sort((x, y) => x.noise - y.noise);
      }

      // Show sorted array in descending or ascending order
      if (!this.ascending) {
        tempList.reverse();
      }

      return tempList;
    },
  },

  methods: {
    fetchItems: async function () {
      await database
        .collection("listings")
        .get()
        .then((querySnapShot) => {
          let item = {};
          querySnapShot.docs.forEach((doc) => {
            item = { ...doc.data(), ["id"]: doc.id };
            if (item["published"] == true) {
              if (item["price"] <= 10) {
                item["price_filter"] = "cheap";
              } else if (item["price"] > 20) {
                item["price_filter"] = "expensive";
              } else {
                item["price_filter"] = "medium";
              }
              this.list.push(item);
            }
          });
        });

      this.displayedList = this.list;

      let user = firebase.auth().currentUser;
      await database
        .collection("users")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();
          var fav = data.favourites;

          this.favourites = fav;
        });

    },

    route: async function(event) {
      this.docid = event.target.getAttribute("id");

      var result = await this.fetchClicks()
      var monthClicks = 0;
      var monthID = '';

      result.forEach(doc => {
        monthClicks += Number(doc.clicks)
        monthID += doc.id
      })
      await database.collection('listings').doc(this.docid).collection('monthlyData').doc(monthID).update({
        clicks: Number(monthClicks + 1)
      })
      this.$router.push({name:"indiv", params: {id:this.docid}});
    },

    fetchClicks: async function() {
      
      var currDate = new Date()
      let dateInString = currDate.toDateString()
      let monthString = dateInString.slice(4,7)

      var someArr = []
        await database.collection('listings').doc(this.docid).collection('monthlyData').doc(monthString).get().then(querySnapshot => {
          if(!querySnapshot.exists) {
            database.collection('listings').doc(this.docid).collection('monthlyData').doc(monthString).set({
              month: monthString,
              bookings: Number(0),
              clicks: Number(0),
              revenue: Number(0),
              ratings: Number(0),
              totalRatings: Number(0),
              numRatings: Number(0)
            }) 
          }
        })
        await database.collection('listings').doc(this.docid).collection('monthlyData').doc(monthString).get().then(querySnapshot => {
            let data = {...querySnapshot.data(), ['id']: querySnapshot.id}
            someArr.push(data)
          }) 
      return someArr;
    

    },

    bookmark: async function (event) {
      //add the place to favourites
      let doc_id = event.currentTarget.getAttribute("id");
      let user = firebase.auth().currentUser;
      await database
        .collection("users")
        .doc(user.uid)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();

          var fav = data.favourites;

          if (fav == undefined) {
            fav = [];
          }

          if (fav.includes(doc_id)) {
            alert("Already bookmarked");
            return;
          } else if (doc_id) {
            fav.push(doc_id);
            this.favourites.push(doc_id);
          }

          database
            .collection("users")
            .doc(user.uid)
            .update({ favourites: fav });
        });
    },

    unbookmark: function (event) {
      let doc_id = event.currentTarget.getAttribute("id");
      let user = firebase.auth().currentUser;

      this.favourites = this.favourites.filter(function (value) {
        return value != doc_id;
      });

      database
        .collection("users")
        .doc(user.uid)
        .update({ favourites: this.favourites });
    },
  },

  created: function () {
    this.fetchItems();
    this.displayList = this.list;
  },
};
</script>

<style scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding-top: 1%;
  padding-left: 0;
  margin: auto;
}
li {
  width: 300px;
  margin-top: 5px;
  border-radius: 25px;
  font-family: "Ubuntu", sans-serif;
  margin-left: 4%;
}

.main-pic {
  margin-bottom: 15px;
  border-radius: 15px;
  width: 100%;
  height: 250px;
  cursor: pointer;
}

.title {
  padding-bottom: 12px;
  border-bottom: 2px solid grey;
  padding-left: 7px;
  padding-right: 7px;
  display: flex;
  font-size: 35px;
}
.name {
  font-size: 35px;
  text-align: left;
  float: left;
  cursor: pointer;
}

.rating {
  float: right;
  margin-right: 50px;
}

.location,
.price,
.noise {
  padding-left: 7px;
  text-align: left;
  font-family: "Ubuntu", sans-serif;
  margin: auto;
  margin-bottom: 5px;
  margin-top: 5px;
}

.bookmark {
  float: right;
  margin-left: auto;
}

.filter-cash {
  margin-left: 7px;
  margin-right: 7px;
  font-size: 25px;
}

.filter-volume {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 25px;
}

input {
  margin-top: 5px;
}

.searchbar {
  width: 60%;
}

.search {
  margin-top: 0;
}

.topbar {
  display: flex;
  width: 33%;
  margin: auto;
}

.toptopbar {
  padding-bottom: 10px;
  border-bottom: 2px solid grey;
  width: 90%;
  margin: auto;
}

.sorting {
  margin-left: 5px;
  display: flex;
}

.sort-button {
  margin-left: 5px;
}

.checkgroup {
  padding-bottom: 10px;
}

@import url(https://fonts.googleapis.com/css?family=Open+Sans);

</style>