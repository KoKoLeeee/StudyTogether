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
            <!-- <i v-if="ascending" class="fa fa-sort-up"></i>
        <i v-else class="fa fa-sort-down"></i>
        Reverse -->
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
            class="mb-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-checkbox-group>
          <div>
            Selected: <strong>{{ location }}</strong>
          </div>
          <h4>Price Level</h4>
          <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="price"
            :aria-describedby="ariaDescribedby"
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
          <div>
            Selected: <strong>{{ price }}</strong>
          </div>
          <h4>Noise Level</h4>
          <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="noise"
            :aria-describedby="ariaDescribedby"
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
          <div>
            Selected: <strong>{{ noise }}</strong>
          </div>

          <!-- <div>
          <input type="checkbox" id="cheap" value="cheap" v-model="price" />
          <label for="cheap"></label>
          <b-icon icon="cash-stack" class="filter-cash"></b-icon>
          <input type="checkbox" id="medium" value="medium" v-model="price" />
          <label for="medium"> </label>
          <b-icon icon="cash-stack" class="filter-cash"></b-icon>
          <b-icon icon="cash-stack" class="filter-cash"></b-icon>
          <input
            type="checkbox"
            id="expensive"
            value="expensive"
            v-model="price"
          />
          <label for="expensive"></label>
          <b-icon icon="cash-stack" class="filter-cash"></b-icon>
          <b-icon icon="cash-stack" class="filter-cash"></b-icon>
          <b-icon icon="cash-stack" class="filter-cash"></b-icon>
          </div> -->
          <!-- <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameState"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group> -->
        </form>
      </b-modal>
    </div>

    <!-- <div class="wrap">
      <div class="search">
        <input
          v-model="searchString"
          type="text"
          placeholder="What are you looking for?"
          class="searchTerm"
        />
        <i class="fa fa-search"></i>

        <button
          type="button"
          v-on:click="showModal"
        >
          Filter
        </button>
      </div>
    </div> -->

    <!-- <div class="search">
      <b-input-group>
        <b-form-input
          type="text"
          placeholder="What are you searching for?"
          v-model="searchString"
        ></b-form-input>

        <b-input-group-append>
          <b-button variant="outline-primary"
            ><b-icon icon="search"></b-icon
          ></b-button>
          <b-button variant="outline-primary" @click="showModal"
            ><b-icon icon="filter"></b-icon
          ></b-button>
        </b-input-group-append>
      </b-input-group>
    </div> -->

    <!-- <div>
      <b-dropdown
        id="dropdown-1"
        text="Sort By"
        class="m-md-2"
        v-model="sortBy"
      >
        <b-dropdown-item
          v-for="(option, index) in options"
          :key="index"
          v-bind:value="option.value"
          >{{ option.text }}</b-dropdown-item
        >
      </b-dropdown>
    </div> -->

    <!-- <div> -->
    <!-- <select v-model="sortBy">
        <option
          v-for="(option, index) in options"
          :key="index"
          v-bind:value="option.value"
        >
          {{ option.text }}
        </option>
      </select> -->

    <!-- <button v-on:click="ascending = !ascending" class="sort-button">
        <i v-if="ascending" class="fa fa-sort-up"></i>
        <i v-else class="fa fa-sort-down"></i>
        Reverse
      </button>
    </div> -->

    <!-- <div>
      <modal 
        v-show="isModalVisible" 
        @close="closeModal" 
        @apply="closeModal"
      >
        <template v-slot:header>
          Filter By:
        </template>

        <template v-slot:body>
          <div>
            <div>
              <label for="name">Location:</label><br />
              <input
                type="checkbox"
                id="North"
                value="North"
                v-model="location"
              />
              <label for="North">North</label>
              <input
                type="checkbox"
                id="South"
                value="South"
                v-model="location"
              />
              <label for="South">South</label>
              <input
                type="checkbox"
                id="East"
                value="East"
                v-model="location"
              />
              <label for="East">East</label>
              <input
                type="checkbox"
                id="West"
                value="West"
                v-model="location"
              />
              <label for="West">West</label>
              <input
                type="checkbox"
                id="Central"
                value="Central"
                v-model="location"
              />
              <label for="Central">Central</label>
            </div>
            <div>
              <label for="name">Price Point:</label><br />
              <input type="checkbox" id="cheap" value="cheap" v-model="price" />
              <label for="cheap"></label>
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <input
                type="checkbox"
                id="medium"
                value="medium"
                v-model="price"
              />
              <label for="medium"> </label>
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <input
                type="checkbox"
                id="expensive"
                value="expensive"
                v-model="price"
              />
              <label for="expensive"></label>
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
            </div>
            <div>
              <label for="name">Noise Level:</label><br />
              <input
                type="checkbox"
                id="quiet"
                value="1"
                v-model.number="noise"
              />
              <label for="quiet"></label>
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <input
                type="checkbox"
                id="moderate"
                value="2"
                v-model.number="noise"
              />
              <label for="moderate"></label>
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <input
                type="checkbox"
                id="loud"
                value="3"
                v-model.number="noise"
              />
              <label for="loud"></label>
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
            </div>
          </div>
        </template>
      </modal>
    </div> -->

    <!-- <div v-if="displayedList().length == 0"> No Results Found:(</div>
  <div v-else> {{displayedList().length}} Results Found</div> -->

    <!-- <div class="listings">
      <ul class="listings-list">
        <li v-for="listing in displayedList" :key="listing.id" >
          <div class="name" v-bind:id="listing.id" v-on:click="route($event)"> {{ listing.name }}</div>
          <br>
          <img id="main-pic" v-bind:src = "listing.photoURL1" height="30px">
          <br><br>
          <div class="rating">
            <img
              v-if="listing.rating > 0"
              src="https://img.icons8.com/fluent/48/000000/star.png"
            />
            <img
              v-if="listing.rating > 1"
              src="https://img.icons8.com/fluent/48/000000/star.png"
            />
            <img
              v-if="listing.rating > 2"
              src="https://img.icons8.com/fluent/48/000000/star.png"
            />
            <img
              v-if="listing.rating > 3"
              src="https://img.icons8.com/fluent/48/000000/star.png"
            />
            <img
              v-if="listing.rating > 4"
              src="https://img.icons8.com/fluent/48/000000/star.png"
            />
          </div>
          <div class="location">
            <img
              id="location-pin"
              src="https://img.icons8.com/pastel-glyph/64/000000/place-marker--v1.png"
              width="40px"
            />
            <span id="locationVal">{{ listing.loc_neighbourhood }}</span>
          </div>
          <br />

          <div class="price">
            <span id="price-pics">
              <img
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <img
                v-if="listing.price > 10 && listing.price <= 20"
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
              <img
                v-if="listing.price > 20"
                src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                width="40px"
              />
            </span>
          </div>
          <br />
          <div class="noise">
            <span id="noise-pics">
              <img
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <img
                v-if="listing.noise > 1"
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
              <img
                v-if="listing.noise > 2"
                id="noise-pic"
                src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                width="40px"
              />
            </span>
          </div>

          <div class="bookmark">
            <img
              v-bind:id="listing.id"
              v-on:click="bookmark($event)"
              src="https://img.icons8.com/windows/32/000000/bookmark-ribbon--v1.png"
              width="40px"
            />
          </div>
        </li>
        <div class="divider"></div>
      </ul>
    </div> -->
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
            <!-- <div class="rating">
              <img
                v-if="listing.rating > 0"
                src="https://img.icons8.com/fluent/48/000000/star.png"
              />
              <img
                v-if="listing.rating > 1"
                src="https://img.icons8.com/fluent/48/000000/star.png"
              />
              <img
                v-if="listing.rating > 2"
                src="https://img.icons8.com/fluent/48/000000/star.png"
              />
              <img
                v-if="listing.rating > 3"
                src="https://img.icons8.com/fluent/48/000000/star.png"
              />
              <img
                v-if="listing.rating > 4"
                src="https://img.icons8.com/fluent/48/000000/star.png"
              />
            </div> -->
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
            <!-- <div class="location">
              <img
                id="location-pin"
                src="https://img.icons8.com/pastel-glyph/64/000000/place-marker--v1.png"
                width="40px"
              />
              <span id="locationVal">{{ listing.loc_neighbourhood }}</span>
            </div> -->
            <!-- <br /> -->

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

            <!-- <div class="price">
              <span id="price-pics">
                <img
                  src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                  width="40px"
                />
                <img
                  v-if="listing.price > 10 && listing.price <= 20"
                  src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                  width="40px"
                />
                <img
                  v-if="listing.price > 20"
                  src="https://img.icons8.com/metro/26/000000/us-dollar--v1.png"
                  width="40px"
                />
              </span>
            </div> -->
            <!-- <br /> -->
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
            <!-- <div class="noise">
              <span id="noise-pics">
                <img
                  id="noise-pic"
                  src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                  width="40px"
                />
                <img
                  v-if="listing.noise > 1"
                  id="noise-pic"
                  src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                  width="40px"
                />
                <img
                  v-if="listing.noise > 2"
                  id="noise-pic"
                  src="https://img.icons8.com/fluent-systems-regular/24/000000/low-volume.png"
                  width="40px"
                />
              </span>
            </div> -->

            <!-- <div class="bookmark">
              <img
                v-bind:id="listing.id"
                v-on:click="bookmark($event)"
                src="https://img.icons8.com/windows/32/000000/bookmark-ribbon--v1.png"
                width="40px"
              />
            </div> -->
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
// import Modal from "./Modal.vue";

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
        // { value: null, text: "Sort By" },
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
    // modal: Modal,
  },

  watch: {
    location: function () {
      console.log(this.location)
    },

    searchString: function() {
      console.log(this.searchString)
    },
    noise: function() {
      console.log(typeof this.noise[0])
    },
    price: function() {
      console.log(this.price)
    },

    sortBy: function() {
      console.log(this.sortBy)
    }
  },

  computed: {
    //computed method to watch over search, filter and sort to update displayed list
    displayedList: function () {
      let tempList = this.list;

      console.log("computed");

      //search method
      if (this.searchString != "" && this.searchString) {
        tempList.map((item) => {
          console.log(item.name);
        });
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

      console.log(tempList);

      tempList = tempList.filter(
        (x) =>
          location.includes(x["loc_filter"]) &&
          price.includes(x["price_filter"]) &&
          noise.includes(x["noise"])
      );

      console.log(tempList);

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

      console.log(tempList)

      return tempList;
    },
  },

  methods: {
    showModal() {
      this.isModalVisible = true;
      console.log(this.isModalVisible);
    },
    closeModal() {
      this.isModalVisible = false;
    },

    fetchItems: async function () {
      await database
        .collection("listings")
        .get()
        .then((querySnapShot) => {
          let item = {};
          querySnapShot.docs.forEach((doc) => {
            item = { ...doc.data(), ["id"]: doc.id };
            console.log(item);
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
      console.log(this.list);

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

      console.log(this.favourites);
    },

    route: async function(event) {
      this.docid = event.target.getAttribute("id");
      console.log(this.docid)
      var currDate = new Date()
      let dateInString = currDate.toDateString()
      let monthString = dateInString.slice(4,7)
      console.log(monthString)

      var result = await this.fetchClicks()
      console.log(result)
      var monthClicks = 0;
      var monthID = '';

      result.forEach(doc => {
        monthClicks += Number(doc.clicks)
        console.log("clicks1", doc.clicks)
        console.log("clicks2", monthClicks)
        monthID += doc.id
        console.log(doc.id)
      })
      console.log("clicks3", monthClicks)
      await database.collection('listings').doc(this.docid).collection('monthlyData').doc(monthID).update({
        clicks: Number(monthClicks + 1)
      })

      console.log(this.docid);
      // database.collection("listings").doc(doc_id).collection("monthlyData")
      this.$router.push({name:"indiv", params: {id:this.docid}});
    },

    fetchClicks: async function() {
      
      var currDate = new Date()
      let dateInString = currDate.toDateString()
      let monthString = dateInString.slice(4,7)

      var someArr = []
    //  try {
        console.log("check if empty")
        console.log("check this id", this.docid)
        await database.collection('listings').doc(this.docid).collection('monthlyData').doc(monthString).get().then(querySnapshot => {
          console.log("checking...")
          if(!querySnapshot.exists) {
            console.log("its empty")
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
        //  querySnapshot.docs.forEach((doc) => {
            console.log(querySnapshot.id, "=>", querySnapshot.data())
            let data = {...querySnapshot.data(), ['id']: querySnapshot.id}
            someArr.push(data)
          }) 
    
  
      console.log("check", someArr)
      return someArr;
    

    },

    bookmark: async function (event) {
      //add the place to favourites
      console.log('bookmark')
      let doc_id = event.currentTarget.getAttribute("id");
      let user = firebase.auth().currentUser;
      console.log(user.uid)
      // var newFav = [];
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

          console.log(fav);

          database
            .collection("users")
            .doc(user.uid)
            .update({ favourites: fav });

          // snapshot.docs.forEach((doc) => {
          //   let fav = doc.data().favourites;
          //   if (doc.id == user.uid) {
          //     newFav = fav;
          //     if (!fav.includes(doc_id)) {
          //       newFav.push(doc_id);
          //     }
          //   }
          // });
          // console.log(newFav);
          // database
          //   .collection("users")
          //   .doc(user.uid)
          //   .update({ favourites: newFav });
          // console.log("bookmark");
        });
    },

    unbookmark: function (event) {
      let doc_id = event.currentTarget.getAttribute("id");
      let user = firebase.auth().currentUser;

      console.log(doc_id);

      this.favourites = this.favourites.filter(function (value) {
        return value != doc_id;
      });

      database
        .collection("users")
        .doc(user.uid)
        .update({ favourites: this.favourites });
    },

    // clicked: function (event) {
    //   let doc_id = event.target.getAttribute("id");
    //   if (this.favorites.includes(doc_id)) {
    //     return "bookmark-fill";
    //   } else {
    //     return "bookmark";
    //   }
    // },
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
  /* padding: 10%; */
  padding-top: 1%;
  padding-left: 0;
  margin: auto;
}
li {
  width: 300px;
  /* text-align: center; */
  /* padding: 10px;
  border: 5px solid #ed7a78;
  margin: 10px; */
  margin-top: 5px;
  border-radius: 25px;
  font-family: "Ubuntu", sans-serif;
  margin-left: 4%;
}
/* .listings-list {
  margin-left: 3%;
} */
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
  /* margin: auto; */
  margin-left: 5px;
  display: flex;
}

.sort-button {
  margin-left: 5px;
}
/* .location,
.noise,
.price {
  display: flex;
  flex-flow: row wrap;
  margin-left: 50px;
  font-size: 20px;
} */

/* #locationVal,
.noiseVal {
  margin-top: 10px;
  margin-left: 3px;
} */

/* .bookmark {
  float: right;
  margin-right: 50px;
} */

@import url(https://fonts.googleapis.com/css?family=Open+Sans);

/* body {
  background: #f2f2f2;
  font-family: "Open Sans", sans-serif;
} */

/* .search {
  width: 30%;
  margin: auto;
} */

/* .searchTerm {
  width: 100%;
  border: 3px solid #ed7a78;
  border-right: none;
  padding: 5px;
  height: 20px;
  border-radius: 5px 0 0 5px;
  outline: none;
  color: #ed7a78;
}

.searchTerm:focus {
  color: #ed7a78;
} */

/*Resize the wrap to see the search bar change!*/
/* .wrap {
  width: 30%;
  position: relative;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
} */

/* @media (min-width: 740px) and (max-width: 1412px) {
  .listings-list {
    margin-left: 3%;
    width: 100%;
  }
  ul {
    width: 100%;
  }
  li {
    text-align: center;
    padding: 10px;
    border: 5px solid #ed7a78;
    margin: 10px;
    margin-top: 5px;
    border-radius: 25px;
    font-family: "Ubuntu", sans-serif;
    margin: auto;
  }
} */
</style>