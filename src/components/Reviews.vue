<template>
  <div id="review">
    <app-header></app-header>

    <h1>Write Your Review</h1>

    <div class="container">
      <div class="left-container">
        <!-- cafe name and picture -->
        <h3 class="name">{{ listingDetail["name"] }}</h3>
        <img
          :src="listingDetail['cover_photo']"
          alt="listing-pic"
          class="main-pic"
        />
      </div>
      <div class="right-container">
        <!-- <div> -->
        <form class="form">
          <!-- title -->
          <!-- <div class="row">
							<div class="col-25"> -->
          <div class="title">
            <label for="title" id="fields">Your Title:</label>
            <!-- </div> -->
            <!-- <div class="col-75"> -->
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
          <!-- </div> -->
          <!-- </div> -->
          <!-- noise -->
          <!-- <div class="row">
							<div class="col-25"> -->
          <div class="noise">
            <label for="noise" id="fields">Noise Level:</label>
            <!-- </div> -->
            <!-- <div class="col-75"> -->
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
          <!-- </div> -->
          <!-- </div> -->
          <!-- rating -->
          <!-- <div class="row"> -->
          <!-- <div class="col-25"> -->
          <div class="rating">
            <label for="rating" id="fields">Rating:</label>
            <!-- </div> -->
            <!-- <div class="col-75"> -->
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
          <!-- </div> -->
          <!-- </div> -->
          <!-- review -->
          <!-- <div class="row"> -->
          <!-- <div class="col-25"> -->
          <div class="review">
            <label for="review" id="fields">Some comments:</label>
            <!-- </div> -->
            <!-- <div class="col-75"> -->
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
          <!-- </div> -->
          <!-- </div> -->
          <!-- send button -->
          <!-- <br /> -->
          <!-- <div id="send"> -->
          <!-- <div class="row"> -->
          <div class="submit">
            <input type="submit" value="Submit" v-on:click="send" />
          </div>
          <!-- </div> -->
          <!-- </div> -->
        </form>
        <!-- </div> -->
      </div>
    </div>

    <!-- old code -->

    <!-- <h1>Write a Review</h1>
		<h3>Thank you !</h3>
        <span id="name">{{ listingDetail["name"] }}</span>
		<img :src="listingDetail['photoURL2']" alt="listing-pic" id="main-pic" />
		<br /><br />
		<br /><br />
		<form id="feedback">
			<label for="title"> Title: </label>
			<input
				type="text"
				style="background-color:#DCDCDC"
				v-model="title"
				required
			/>
			<br /><br />
			<label for="reviewText" id="reviewLabel">Review: </label>
			<textarea
				name="reviewText"
				id="reviewText"
				cols="30"
				rows="10"
				style="background-color:#DCDCDC"
				v-model="comment"
				required
			>
			</textarea>
		</form>

		<br /><br />
		<label for="noise" id="noise">Noise:</label>
		<span></span>
		<select id="noiseOptions" name="noiseOptions" v-model="noise" required>
			<option value="quiet">1 - Quiet</option>
			<option value="tolerable">2 - Tolerable</option>
			<option value="whiteNoise">3 - Perfect</option>
		</select>
		<br /><br />
		<label for="rating" id="rating">Rating:</label>
		<select id="rating" name="rating" v-model="rating" required>
			<option value="veryPoor">1</option>
			<option value="poor">2</option>
			<option value="average">3</option>
			<option value="good">4</option>
			<option value="excellent">5</option>
		</select>

		<br /><br /><br />
		<button
			type="submit"
			v-on:click="
				send();
				route();
			"
		>
			Send !
		</button>
		<br /><br /><br /> -->

    <!-- <label for="rating">Rating:</label>
    <img src="https://img.icons8.com/fluent/48/000000/star.png"/>
    <img src="https://img.icons8.com/fluent/48/000000/star.png"/>
    <img src="https://img.icons8.com/fluent/48/000000/star.png"/>
    <img src="https://img.icons8.com/fluent/48/000000/star.png"/>
    <img src="https://img.icons8.com/fluent/48/000000/star.png"/> -->
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
          console.log(toAdd);
          console.log(this.listingDetail);
          console.log(this.$route.params.id);
          console.log(this.$route.query.date);
        });
    },

    updateData: async function () {
      const locationID = this.$route.params.id;
      var monthString = this.$route.query.date;
      console.log(monthString);
      var someArr = [];
      await database
        .collection("listings")
        .doc(this.$route.params.id)
        .collection("monthlyData")
        .doc(monthString)
        .get()
        .then((querySnapshot) => {
          console.log("checking...");
          if (!querySnapshot.exists) {
            console.log("its empty");
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
          console.log(querySnapshot.id, "=>", querySnapshot.data());
          let data = { ...querySnapshot.data(), ["id"]: querySnapshot.id };
          someArr.push(data);
        });

      console.log(someArr);
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
      var monthString = this.$route.query.date;
      console.log(monthString);

      var result = await this.updateData();
      console.log(result);

      var currNumRatings = Number(0);
      var currTotalRatings = Number(0);
      var currRatings = Number(0);

      result.forEach((doc) => {
        currNumRatings += Number(doc.numRatings);
        currTotalRatings += Number(doc.totalRatings);
        currRatings += Number(doc.ratings);
        this.monthID += doc.id;
        console.log(doc.id);
      });

      console.log("currentRatings", currRatings);
      var locationID = this.$route.params.id;
      console.log(locationID);
      console.log("month", this.monthID);

      var newNumRatings = Number(Number(currNumRatings) + 1);

      var newRatingTotal = Number(
        Number(currTotalRatings) + Number(this.rating)
      );
      var newAvgRating = Number(
        Math.round((Number(newRatingTotal) / Number(newNumRatings)) * 2) / 2
      );
      console.log("new rating", newAvgRating);

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
          console.log(newNoiseTotal);
          console.log(newAvgNoise);
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

/* 
#all {
	display: flex;
	flex-wrap: wrap;
	background-color: #ffe5b4;
	width: 2000px;
	height: 800px;
} */

/* #main-pic {
	position: absolute;
	right: 150px;
	height: 510px;
	width: 510px;
	left: 8%;
	bottom: 10px;
	top: 50%;
	border-radius: 30px;
} */

/* #name {
	position: relative;
	bottom: 400px;
	top: 8%;
	left: 90%;
	font-size: 40px;
}

#reviewLabel {
	position: relative;
	bottom: 150px;
}

#fields {
	font-size: 16px;
} */

/* #details {
	position: fixed;
} */

/* #send {
	position: relative;
	right: 25%;
} */
/* 
#form {
	position: relative;
	left: 3px;
	right: 16%;
	top: 100px;
} */

/* #intro {
	justify-content: flex-end;
	justify-content: center;
	position: relative;
	left: 24%;
	font-size: 18px;
	height: inherit;
} */

/* START OF IMPORTED CSS FOR OVERALL PAGE*/

/* * {
	box-sizing: border-box;
	font-size: 16px;
	font-family: Verdana, Geneva, Tahoma, sans-serif;
}

input[type="text"],
select,
textarea {
	width: 100%;
	padding: 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
	resize: vertical;
}

label {
	padding: 12px 12px 12px 0;
	display: inline-block;
}

button {
	background-color: #4caf50;
	color: white;
	padding: 12px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	float: right;
}

input[type="submit"]:hover {
	background-color: #45a049;
} */

/* .container {
	position: absolute;
    right: 2%;
	display: flex;
	flex-wrap: wrap;
	width: 700px;
	height: 600px;
	margin-left: 52%;
	margin-top: 5%;
	border-radius: 7px;
	background-color: #ffcba4;
	padding: 20px;
	justify-content: center;
} */
/* 
.col-25 {
	float: left;
	width: 25%;
	margin-top: 6px;
}

.col-75 {
	float: left;
	width: 75%;
	margin-top: 6px;
} */

/* Clear floats after the columns */
/* .row:after {
	content: "";
	display: table;
	clear: both;
} */

/* Responsive layout - when the screen is less than 600px wide, make the two columns stack on top of each other instead of next to each other */
/* @media screen and (max-width: 600px) {
	.col-25,
	.col-75,
	input[type="submit"] {
		width: 100%;
		margin-top: 0;
	}
} */
</style>
