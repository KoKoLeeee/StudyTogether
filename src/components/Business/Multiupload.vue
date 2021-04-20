<template>
  <div>
    <b-form-file
      v-model="imgData"
      @change="uploadImage"
      ref="file-input"
      class="mb-2"
      multiple
    ></b-form-file>

    <b-button @click="img = []">Reset</b-button>

    <p class="mt-2">
      Selected file: <b>{{ imgData }}</b>
    </p>

    <vueper-slides
      bullets-outside
      class="menu-slides"
      :arrows-outside="false"
      :disableArrowsOnEdges="true"
      :infinite="false"
      fixed-height="200px;"
      @next="index += 1"
      @previous="index -= 1"
    >
      <vueper-slide v-for="(url,index) in img" :image="url" :key="index"/>
    </vueper-slides>
  </div>
</template>


<script>
import firebase from "firebase";
import database from "../../firebase.js";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";

export default {
  components: {
    "vueper-slides": VueperSlides,
    "vueper-slide": VueperSlide,
  },
  data() {
    return {
      bizID: "",
      index: 0,
      img: new Array(),
      imgData: new Array(),
    };
  },

  methods: {
    fetchID: async function () {
      var user = firebase.auth().currentUser;
      var userID = user.uid;
      this.bizID = userID;
    },

    fetchImg: function() {
      database.collection('listings').doc(this.bizID).get().then(snapshot => {
        
      })
    },

    uploadImage: function (e) {
      this.imgData = e.target.files;

      if (this.imgData.length > 0) {
        for (var i = 0; i < this.imgData.length; i++) {
          var imageData = this.imgData[i];
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
                this.img.push(url);
              });
            }
          );
        }
      }
    },
  },

  created() {
    this.fetchID();
  },
};
</script>

<style scoped>
</style>