<template>
  <div id="review">
    <app-header></app-header>

    <h1>Write Your Review</h1>

    <div class="container">
      <div class="left-container">
        <h3 class="name">{{ listingDetail["name"] }}</h3>
        <img
          :src="listingDetail['cover_photo']"
          alt="listing-pic"
          class="main-pic"
        />
      </div>
      <div class="right-container">
        <form class="form">
          <div class="title">
            <label for="title" id="fields">Your Title:</label>
            <input
              class="input"
              type="text"
              id="title"
              name="title"
              placeholder=" Title"
              v-model="title"
              required
            />
          </div>
          <div class="noise">
            <label for="noise" id="fields">Noise Level:</label>
            <select
              id="noiseOptions"
              class="input"
              name="noiseOptions"
              v-model="noise"
              required
            >
              <option :value="1">1 - Quiet</option>
              <option :value="2">2 - Normal</option>
              <option :value="3">3 - Some Noise</option>
            </select>
          </div>
          <div class="rating">
            <label for="rating" id="fields">Rating:</label>
            <select
              id="rating"
              name="rating"
              v-model="rating"
              class="input"
              placeholder="How was your experience?"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div class="review">
            <label for="review" id="fields">Some comments:</label>
            <textarea
              class="input"
              id="review"
              name="review"
              placeholder=" Additional Comments:"
              style="height: 200px"
              v-model="comment"
              required
            ></textarea>
          </div>
          <div class="submit">
            <input type="submit" value="Submit" v-on:click="send" />
          </div>
        </form>
      </div>
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
      listingDetail: {},
      title: "",
      comment: "",
      noise: 0,
      rating: 0,
      monthID: "",
    };
  },

  components: {
    "app-header": Header,
  },

  methods: {
    fetchItems: function () {
      database
        .collection("listings")
        .doc(this.$route.params.id)
        .get()
        .then((snapshot) => {
          const toAdd = snapshot.data();
          this.listingDetail = toAdd;
        });
    },

    updateData: async function () {
      const locationID = this.$route.params.id;
      var monthString = this.$route.query.date;
      var someArr = [];
      await database
        .collection("listings")
        .doc(this.$route.params.id)
        .collection("monthlyData")
        .doc(monthString)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.exists) {
            database
              .collection("listings")
              .doc(locationID)
              .collection("monthlyData")
              .doc(monthString)
              .set({
                month: monthString,
                bookings: Number(0),
                clicks: Number(0),
                revenue: Number(0),
                ratings: Number(0),
                totalRatings: Number(0),
                numRatings: Number(0),
              });
          }
          let data = { ...querySnapshot.data(), ["id"]: querySnapshot.id };
          someArr.push(data);
        });

      return someArr;
    },

    send: async function (e) {
      e.preventDefault();
      if (
        this.title == "" ||
        this.comment == "" ||
        this.noise == 0 ||
        this.rating == 0
      ) {
        return;
      }
      const locationId = this.$route.params.id;
      const userId = firebase.auth().currentUser.uid;
      const docId = this.$route.query.doc_id;

      async function retrieveUser(idOfUser) {
        var username = "";
        await database
          .collection("users")
          .doc(idOfUser)
          .get()
          .then((doc) => {
            let data = doc.data();
            username = data["name"];
          });
        return username;
      }
      let username = await retrieveUser(userId);

      database
        .collection("listings")
        .doc(locationId)
        .collection("reviews")
        .add({
          title: this.title,
          comments: this.comment,
          noise: Number(this.noise),
          rating: Number(this.rating),
          userid: userId,
          user: username,
          date: new Date(),
        });

      database
        .collection("bookings")
        .doc(docId)
        .delete()
        .then(() => console.log("review sent and past booking deleted"));

      // get month doc id and currbookings and currrevenue
      var result = await this.updateData();

      var currNumRatings = Number(0);
      var currTotalRatings = Number(0);

      result.forEach((doc) => {
        currNumRatings += Number(doc.numRatings);
        currTotalRatings += Number(doc.totalRatings);
        this.monthID += doc.id;
      });

      var locationID = this.$route.params.id;

      var newNumRatings = Number(Number(currNumRatings) + 1);

      var newRatingTotal = Number(
        Number(currTotalRatings) + Number(this.rating)
      );
      var newAvgRating = Number(
        Math.round((Number(newRatingTotal) / Number(newNumRatings)) * 2) / 2
      );

      await database
        .collection("listings")
        .doc(locationID)
        .collection("monthlyData")
        .doc(this.monthID)
        .update({
          ratings: Number(newAvgRating),
          numRatings: Number(newNumRatings),
          totalRatings: Number(newRatingTotal),
        });

      await database
        .collection("listings")
        .doc(locationID)
        .get()
        .then((snapshot) => {
          const toUpdate = snapshot.data();
          var newNumRatings = Number(Number(toUpdate.numRatings) + 1);
          var newRatingTotal = Number(
            Number(toUpdate.totalRating) + Number(this.rating)
          );
          var newAvgRating =
            Math.round((Number(newRatingTotal) / Number(newNumRatings)) * 2) /
            2;
          var newNoiseTotal = Number(
            Number(toUpdate.totalNoise) + Number(this.noise)
          );
          var newAvgNoise = Number(
            Math.round(Number(newNoiseTotal) / Number(newNumRatings))
          );
          database
            .collection("listings")
            .doc(locationID)
            .update({
              rating: newAvgRating,
              totalRating: newRatingTotal,
              numRatings: newNumRatings,
              noise: newAvgNoise,
              totalNoise: newNoiseTotal,
            })
            .then(this.$router.push({ path: "/bookings" }));
        });
    },
  },

  created: function () {
    this.fetchItems();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  width: 85%;
  margin: auto;
}

.left-container {
  float: left;
  width: 50%;
  padding-right: 10%;
}

.name {
  padding-bottom: 5px;
  border-bottom: 2px solid grey;
}

.main-pic {
  width: 100%;
  border-radius: 15px;
}

.right-container {
  width: 50%;
  float: right;
  margin-left: auto;
  border-left: 1px solid grey;
}

.form {
  width: 60%;
  text-align: left;
  margin: auto;
}

.title,
.noise,
.rating,
.review {
  width: 100%;
  margin-right: 0px;
  padding-bottom: 5px;
}

.input {
  width: 100%;
  border-radius: 5px;
  padding: 4px;
}

label {
  margin-bottom: 3px;
  font-size: 18px;
}
</style>
