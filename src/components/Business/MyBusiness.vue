<template>
  <div>
    <app-header></app-header>
    <b-tabs content-class="mt-3" justified>
      <b-tab title="Edit General Information" active><div><information></information></div></b-tab>
      <b-tab title="Edit Timeslots"><div><timeslots></timeslots></div></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Header from "../UI/Header.vue";
import Information from './Information.vue';
import Timeslots from './EditTimeslots.vue';

export default {
  components: {
    "app-header": Header,
    information: Information,
    timeslots: Timeslots,
  }
};
</script>

<style scoped>
.info,
.booking-timings,
button {
  font-size: 30px;
}

.info button {
  margin-left: auto;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
  color: whitesmoke;
  background: #ed7a78;
  border: 2px solid transparent;
  height: 80px;
  width: 200px;
  font-family: "Ubuntu", sans-serif;
  font-weight: bold;
  font-size: 20px;
  transition: 0.2s;
}

.info button:hover {
  border-color: white;
  background-color: #e33c39;
}
</style>

