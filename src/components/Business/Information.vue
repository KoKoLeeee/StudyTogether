<template>
  <div id="editInfo">
    <!-- <app-header></app-header> -->
    <h1>Edit Business Information:</h1>
    <!--    <form> -->
    <div class="full-container">
      <div class="details1">
        <h3>General Information</h3>
        <!-- <div class="editName">
        <label class="inputField" for="name">Name of Business: </label>
        <input type="text" id="name" name="name" v-model="name" required />
      </div> -->
        <div class="name">
          <h6>Business Name:</h6>
          <b-form-input
            v-model="name"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Enter your name"
            trim
            required
          ></b-form-input>
        </div>
        <div class="description">
          <h6>Description:</h6>
          <b-form-textarea
            v-model="description"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Enter description"
            trim
            required
          ></b-form-textarea>
        </div>
        <!-- <hr /> -->
        <div class="editAmenities">
          <div id="changeAmenities">
            <h6>Amenities:</h6>
            <div id="choose">
              <multiselect :data-items="this.options" v-model="amenities">
              </multiselect>
            </div>
          </div>
          <!-- <br /> -->
          <!-- <div id="existingAmenities"> -->
          <!-- Existing Amenities: <b> {{ amenities }} </b> -->
          <!-- <div v-for="v in this.amenities" :key="v.index">{{ v }}</div> -->
          <!-- </div> -->
        </div>
        <!-- <hr /> -->
        <div class="editPrice">
          <h6>Price:</h6>
          <b-input-group size="sm" prepend="$" append="/ hr" placeholder="0">
            <b-form-input v-model="price"></b-form-input>
          </b-input-group>
        </div>

        <!-- <hr /> -->
        <div class="editLocation">
          <h6>Location Address:</h6>
          <b-form-textarea
            v-model="exact_loc"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Enter Location of Business"
            trim
            required
          ></b-form-textarea>
          <!-- <textarea v-model="exact_loc" row="20" cols="50"> </textarea> -->
        </div>
        <!-- <hr /> -->
        <div class="region-neighbourhood">
          <div class="editRegion">
            <h6>Region:</h6>
            <select class="region-dropdown" v-model="region">
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
              <option>Central</option>
            </select>
          </div>
          <div class="editNeighbourhood">
            <h6>Neighbourhood:</h6>
            <b-form-input
              v-model="neighbourhood"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="Enter Location of Business"
              trim
              required
            ></b-form-input>
            <!-- <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            v-model="neighbourhood"
            required
          /> -->
          </div>
        </div>
        <div class="phoneNum">
          <h6>Business Phone Number:</h6>
          <b-form-input
            v-model="phoneNum"
            aria-describedby="input-live-help input-live-feedback"
            placeholder="Enter Business Phone Number"
            trim
            required
          ></b-form-input>
        </div>

        <div class="submit-button">
          <!-- <button v-if="!published" @click.prevent="save">Publish Listing</button>
        <button v-if="published" @click.prevent="save">Save Changes</button> -->
          <b-button
            v-if="!published"
            @click.prevent="save"
            variant="outline-secondary"
            >Publish Listing</b-button
          >
          <b-button
            v-if="published"
            @click.prevent="save"
            variant="outline-secondary"
            >Save Changes</b-button
          >
        </div>
      </div>

      <div class="details2">
        <h3>Gallery</h3>
        <b-form-file
          @change="uploadPhotos"
          ref="file-input"
          class="mb-2"
          multiple
        ></b-form-file>

        <!-- <b-button @click="photos = []">Reset</b-button> -->

        <!-- <p class="mt-2">
          Selected file: <b>{{ photos }}</b>
        </p> -->

        <vueper-slides
          bullets-outside
          class="photo-slides"
          :bullets="false"
          :arrows-outside="true"
          :disableArrowsOnEdges="true"
          :infinite="false"
          fixed-height="200px;"
          @next="photoIndex += 1"
          @previous="photoIndex -= 1"
        >
          <vueper-slide
            v-for="(url, index) in photos"
            :image="url"
            :key="index"
          />
        </vueper-slides>

        <b-button-group>
          <b-button @click="photos = []" variant="outline-secondary"><b-icon icon="arrow-clockwise"  variant="danger"></b-icon></b-button>

        <b-button @click.prevent="deletePhoto" variant="outline-secondary"
          ><b-icon icon="trash"></b-icon></b-button
        >

        <b-button @click.prevent="saveCover" variant="outline-secondary"
          >Set as Cover Photo</b-button
        >

        <b-button @click.prevent="savePhotos" variant="outline-secondary"
          ><b-icon icon="check-square" variant="success"></b-icon></b-button
        >
        </b-button-group>

        
        <!-- <div class="editPhotos">
          Current Photos:
          <br /><br />
          <img class="place" v-bind:src="this.photo1" />
          <img class="place" v-bind:src="this.photo2" />
          <img class="place" v-bind:src="this.photo3" />
          <br />
          <br />
          <br />
          <label for="photos">Upload New Photos: </label>
          <br /><br />
          <upload></upload>
        </div> -->
      </div>

      <div class="details3">
        <h3>Menu</h3>
        <b-form-file
          @change="uploadMenu"
          ref="file-input"
          class="mb-2"
          multiple
        ></b-form-file>

        <!-- <p class="mt-2">
          Selected file: <b>{{ menu }}</b>
        </p> -->

        <vueper-slides
          bullets-outside
          class="photo-slides"
          :bullets="false"
          :arrows-outside="false"
          :disableArrowsOnEdges="true"
          :infinite="false"
          fixed-height="200px;"
          @next="menuIndex += 1"
          @previous="menuIndex -= 1"
        >
          <vueper-slide
            v-for="(url, index) in menu"
            :image="url"
            :key="index"
          />
        </vueper-slides>

        <b-button-group>
          <b-button @click="menu = []" variant="outline-secondary"><b-icon icon="arrow-clockwise"  variant="danger"></b-icon></b-button>
          <b-button @click.prevent="deleteMenu" variant="outline-secondary"
          ><b-icon icon="trash"></b-icon></b-button
        >
          <b-button @click.prevent="saveMenu" variant="outline-secondary"
          ><b-icon icon="check-square" variant="success"></b-icon></b-button
        >
        </b-button-group>

        

        

        
        <!-- <multi
          @upload-success="uploadImageSuccess"
          @edit-image="editImage"
          @mark-is-primary="markIsPrimary"
          @limit-exceeded="limitExceeded"
          @before-remove="beforeRemove"
          id-upload="myIdUpload"
          id-edit="myIdEdit"
          :max-image="20"
          primary-text="Default"
          browse-text="Browse picture(s)"
          drag-text="Drag pictures"
          mark-is-primary-text="Set as default"
          popup-text="This image will be displayed as default"
          :multiple="true"
          :show-edit="true"
          :show-delete="true"
          :show-add="true"
        >
        </multi> -->
        <!-- <multi></multi> -->
        <!-- <div class="editMenu">
          Current Menu:
          <br /><br />
          <img v-bind:src="this.menu" />
          <br /><br />
          <label for="menu">Upload New Menu: </label>
          <br /><br />
          <uploadMenu></uploadMenu>
          <br />
        </div> -->
      </div>
      <!--    </form> -->
      <br />
    </div>
  </div>
</template>

<script>
// import Header from "../UI/Header.vue";
import database from "../../firebase.js";
import firebase from "firebase";
import { MultiSelect } from "@progress/kendo-vue-dropdowns";
import "@progress/kendo-theme-default/dist/all.css";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
// import Upload from "./UploadPhoto.vue";
// import multi from './Multiupload.vue';
// import VueUploadMultipleImage from "vue-upload-multiple-image";
// import UploadMenu from "./UploadMenu.vue";

export default {
  data() {
    return {
      listingDetail: {},
      bizID: "",
      name: "",
      description: "",
      exact_loc: "",
      region: "",
      neighbourhood: "",
      phoneNum: "",
      photos: [],
      cover_photo: "",
      // photo2: "",
      // photo3: "",
      price: 0,
      menu: [],
      amenities: [],
      options: ["Wifi", "Toilet", "Power Plug", "Airconditioning"],
      published: null,
      photoData: [],
      photoIndex: 0,
      menuIndex: 0,
    };
  },

  components: {
    // "app-header": Header,
    multiselect: MultiSelect,
    "vueper-slides": VueperSlides,
    "vueper-slide": VueperSlide,
    // upload: Upload,
    // multi: multi,
    // multi: VueUploadMultipleImage,
    // uploadMenu: UploadMenu,
  },

  watch: {
    photoIndex: function () {
      console.log(this.photoIndex);
    },
  },

  methods: {
    fetchID: async function () {
      var user = firebase.auth().currentUser;
      console.log(user.uid);
      var userID = user.uid;
      this.bizID = userID;
    },

    fetchItems: async function () {
      await database
        .collection("listings")
        .doc(this.bizID)
        .get()
        .then((snapshot) => {
          const toAdd = snapshot.data();
          this.listingDetail = toAdd;
          this.region = toAdd.loc_filter;
          this.description = toAdd.description;
          this.phoneNum = toAdd.phoneNum;
          this.neighbourhood = toAdd.loc_neighbourhood;
          this.exact_loc = toAdd.exact_loc;
          this.name = toAdd.name;
          this.price = toAdd.price;
          this.amenities = toAdd.amenities;
          // check again
          this.photos = toAdd.photos;
          // this.photo2 = toAdd.photoURL2;
          // this.photo3 = toAdd.photoURL3;
          this.menu = toAdd.menu;
          this.published = toAdd.published;
          console.log(toAdd);
          console.log(this.listingDetail);
        });
    },

    save: async function () {
      console.log("name", this.name);
      database.collection("listings").doc(this.bizID).update({
        loc_filter: this.region,
        loc_neighbourhood: this.neighbourhood,
        exact_loc: this.exact_loc,
        name: this.name,
        price: this.price,
        amenities: this.amenities,
        description: this.description,
        phoneNum: this.phoneNum,
        published: true,
      });
      console.log("bizid", this.bizID);
      console.log(this.name);
      console.log(this.exact_loc);
      alert("Information sucessfully updated!");
    },

    savePhotos: function () {
      database.collection("listings").doc(this.bizID).update({
        photos: this.photos,
        cover_photo: this.cover_photo,
      });
      alert("Photos successfully updated!");
    },

    uploadPhotos: function (e) {
      this.photoData = e.target.files;
      console.log(e.target.files);

      if (this.photoData.length > 0) {
        for (var i = 0; i < this.photoData.length; i++) {
          console.log("hello");
          var imageData = this.photoData[i];
          const storageRef = firebase
            .storage()
            .ref(`${imageData.name}`)
            .put(imageData);
          storageRef.on(
            `state_changed`,
            (snapshot) => {
              this.uploadValue =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              console.log(error.message);
            },
            () => {
              this.uploadValue = 100;
              storageRef.snapshot.ref.getDownloadURL().then((url) => {
                this.photos.push(url);
                console.log(this.photos);
                // this.img1 = url;
                // console.log(this.img1);
              });
            }
          );
        }
      }
      console.log(this.img);
    },

    deletePhoto: function () {
      if (this.photos.length > 0) {
        this.photos.splice(this.photoIndex, 1);
        alert('Photo deleted!')
      }
    },

    saveCover: function () {
      this.cover_photo = this.photos[this.photoIndex];
      alert("Cover photo saved!");
    },

    uploadMenu: function (e) {
      this.photoData = e.target.files;
      console.log(e.target.files);

      if (this.photoData.length > 0) {
        for (var i = 0; i < this.photoData.length; i++) {
          console.log("hello");
          var imageData = this.photoData[i];
          const storageRef = firebase
            .storage()
            .ref(`${imageData.name}`)
            .put(imageData);
          storageRef.on(
            `state_changed`,
            (snapshot) => {
              this.uploadValue =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              console.log(error.message);
            },
            () => {
              this.uploadValue = 100;
              storageRef.snapshot.ref.getDownloadURL().then((url) => {
                this.menu.push(url);
                console.log(this.menu);
                // this.img1 = url;
                // console.log(this.img1);
              });
            }
          );
        }
      }
      console.log(this.img);
    },
    deleteMenu: function () {
      if (this.menu.length > 0) {
        this.menu.splice(this.menuIndex, 1);
        alert("Menu deleted!");

      }
    },
    saveMenu: function () {
      database.collection("listings").doc(this.bizID).update({
        menu: this.menu,
      });
      alert("Menu sucessfully updated!");
    },
  },

  created: function () {
    this.fetchID();
    this.fetchItems();
  },

  // updated: function() {
  //     this.fetchItems()
  // }
};
</script>

<style scoped >
@import url(https://fonts.googleapis.com/css?family=Lato:700,300);
@import url(https://fonts.googleapis.com/css?family=Dosis:400);

#choose {
  width: 100%;
  margin: auto;
  border-radius: 5px;
}

#changeAmenities #existingAmenities {
  display: inline-block;
}

.details {
  border: 2px solid grey;
  padding: 20px;
  width: 30%;
  margin: auto;
}

.name,
.description,
.phoneNum,
.editAmenities,
.editPrice,
.editLocation {
  text-align: left;
}

/* .editPrice {
  text-align: left;
}

.editLocation {
  text-align: left;
} */

.region-neighbourhood {
  display: flex;
}

.editRegion {
  text-align: left;
  width: 48%;
  height: 100%;
  float: left;
}

.region-dropdown {
  width: 90%;
  height: 38px;
  border-radius: 5px;
}

.editNeighbourhood {
  text-align: left;
  width: 52%;
  float: right;
  padding-left: 5px;
  border-left: 2px solid grey;
}

.submit-button {
  text-align: center;
  display: inline-block;
  margin-top: 2px;
  margin: auto;
}

.name,
.description,
.editAmenities,
.editPrice,
.editLocation,
.region-neighbourhood,
.phoneNum {
  padding-bottom: 5px;
  border-bottom: 2px solid grey;
}

.description,
.editAmenities,
.editPrice,
.editLocation,
.region-neighbourhood {
  padding-top: 8px;
}

.submit-button {
  padding-top: 8px;
}

.full-container {
  width: 90%;
  display: flex;
  margin: auto;
}

.details1 {
  float: left;
  margin-left: auto;
  border: solid 2px grey;
  padding: 15px;
  width: 30%;
  height: 100%;
  overflow: auto;
}

.details2 {
  float: left;
  margin-left: auto;
  border: solid 2px grey;
  padding: 15px;
  width: 30%;
  height: 100%;
  overflow: auto;
}

.photo-slides {
  width: 75%;
  margin: auto;
  margin-bottom: 10px;
}

.details3 {
  float: right;
  margin-left: auto;
  border: solid 2px grey;
  padding: 15px;
  width: 30%;
  height: 100%;
  overflow: auto;
}

h6 {
  padding-left: 2px;
}

.mb-2 {
  text-align: left;
}

/* .editName,
.editAmenities,
.editPrice,
.editLocation,
.editRegion,
.editPhotos,
.editNeighbourhood,
.editMenu {
  padding: 20px;
  width: 50%;
  margin: auto;
} */

/* textArea {
  width: 80%;
} */

/* img {
  width: 90%;
} */
/* 
hr {
  display: block;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  margin-left: auto;
  margin-right: auto;
  border-style: inset;
  border-width: 1px;
  color: grey;
  border: 1.5px solid grey;
} */
</style>
