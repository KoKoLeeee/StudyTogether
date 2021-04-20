<template>
  <div>
    <app-header></app-header>

    <div class="full-container">
      <div class="chatlist">
        <vuescroll :ops="ops">
          <ul>
            <li
              class="indiv-chatlist"
              v-for="(chat, index) in displayed_userlist"
              :key="index"
              :id="chat['id']"
              v-on:click="fetchMessage($event, index)"
            >
              <div class="title">
                <h4>{{ chat["businessName"] }}</h4>
                <p>
                  Last Message:
                  {{
                    chat["newDate"].toLocaleString("default", {
                      month: "short",
                    }) +
                    " " +
                    chat["newDate"].getDate()
                  }}
                  |
                  {{ chat["newDate"].toTimeString().split(" ")[0] }}
                </p>
              </div>
              <p>{{ chat["last_user"] }}: {{ chat["last_message"] }}</p>
            </li>
          </ul>
        </vuescroll>
      </div>

      <div class="chatpage">
        <div v-if="messages.length != ''">
          <div class="chatpage-header">
            <h4>{{ chattingName }}</h4>
          </div>
          <div class="scroll">
            <vuescroll :ops="ops" ref="scrollchat">
              <ul class="chat-messages" v-if="messages.length != ''">
                <li v-for="(message, index) in messages" :key="index">
                  <div class="right" v-if="message.sender == userID">
                    <p class="right-content">{{ message.message }}</p>
                    <p class="small-date-right">
                      {{
                        message["newDate"].toLocaleString("default", {
                          month: "short",
                        }) +
                        " " +
                        message["newDate"].getDate()
                      }}
                      |
                      {{ message["newDate"].toTimeString().split(" ")[0] }}
                    </p>
                  </div>
                  <div class="middle" v-else-if="message.sender == 'System'">
                    {{ message.message }}
                  </div>
                  <div class="left" v-else>
                    <p class="left-content">
                      {{ message.message }}
                    </p>
                    <p class="small-date-left">
                      {{
                        message["newDate"].toLocaleString("default", {
                          month: "short",
                        }) +
                        " " +
                        message["newDate"].getDate()
                      }}
                      |
                      {{ message["newDate"].toTimeString().split(" ")[0] }}
                    </p>
                  </div>
                </li>
              </ul>
            </vuescroll>
          </div>

          <div class="chatbar">
            <b-form-input
              v-model="text"
              placeholder="Send a Message..."
              v-on:keyup.enter="sendMessage()"
            ></b-form-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "./UI/Header.vue";
import firebase from "firebase";
import database from "../firebase.js";
import vuescroll from "vuescroll";

export default {
  components: {
    "app-header": Header,
    vuescroll: vuescroll,
  },

  data() {
    return {
      userID: "",
      usertype: "",
      // [[message, time, user], ... ]
      messages: [],
      // [[doc.id, userID, lastmessage, lastperson, lastdate]]
      userlist: [],
      chattingName: "",
      chatroomID: "",
      text: "",
      index: 0,
      ops: {
        scrollPanel: {
          initialScrollY: "100%",
        },
        bar: {
          opacity: 0.8,
          background: "#cfcfcf",
        },
      },
    };
  },

  computed: {
    displayed_userlist: function () {
      let array = this.userlist;
      return array.sort((a, b) => b["newDate"] - a["newDate"]);
    },
  },

  methods: {
    // fetchUserID: function() {
    //     firebase.auth().onAuthStateChanged(user => {
    //         if (user) {
    //             this.userID = user.uid;
    //         }
    //     })
    //     console.log(this.userID)

    // },
    fetchUserID: async function () {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          this.userID = user.uid;
          await database
            .collection("users")
            .doc(this.userID)
            .get()
            .then((snapshot) => {
              const data = snapshot.data();
              this.usertype = data.usertype;
            });
          console.log(this.usertype);
          var query = "";
          if (this.usertype == "customer") {
            query = "customerID";
          } else {
            query = "businessID";
          }
          await database
            .collection("chatrooms")
            .where(query, "==", this.userID)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                let toAdd = doc.data();
                let newDate = toAdd.last_date.toDate();
                let item = { ...toAdd, ["id"]: doc.id, ["newDate"]: newDate };
                console.log(newDate);
                this.userlist.push(item);
              });
            });

          console.log(this.userlist);
        }
      });
      //   return new Promise((resolve, reject) => {
      //     const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      //       unsubscribe();
      //       resolve(user);
      //       this.userID = user.uid;
      //       console.log(this.userID);

      //       await database
      //         .collection("users")
      //         .doc(this.userID)
      //         .get()
      //         .then((snapshot) => {
      //           const data = snapshot.data();
      //           this.usertype = data.usertype;
      //         });
      //         console.log(this.usertype)
      //     }, reject);
      //   });
    },

    fetchMessage: async function (event, index) {
      this.index = index;
      this.messages = [];
      let doc_id = event.currentTarget.getAttribute("id");
      console.log(doc_id);

      await database
        .collection("chatrooms")
        .doc(doc_id)
        .collection("messages")
        .orderBy("time")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let toAdd = doc.data();
            let newDate = toAdd.time.toDate();
            let item = { ...doc.data(), ["newDate"]: newDate };
            this.messages.push(item);
          });
        });

      this.chatroomID = doc_id;

      if (this.usertype == "customer") {
        this.chattingName = this.userlist[index]["businessName"];
      } else {
        this.chattingName = this.userlist[index]["customerName"];
      }

      this.$refs["scrollchat"].scrollTo(
        {
          y: "100%",
        },
        200
      );
    },

    sendMessage: async function () {
      if (this.text == "") {
        return;
      }
      let item = {
        sender: this.userID,
        message: this.text,
        newDate: new Date(),
      };
      console.log(item);

      console.log(this.userlist);

      await database
        .collection("chatrooms")
        .doc(this.chatroomID)
        .collection("messages")
        .add({
          sender: this.userID,
          message: this.text,
          time: item.newDate,
        });

      // Vue.set(this.messages, this.messages.length, item)
      this.messages.push(item);
      let itemToUpdate = this.userlist[this.index];
      console.log(itemToUpdate);
      console.log(itemToUpdate.newDate);
      itemToUpdate.newDate = item.newDate;
      itemToUpdate.last_message = item.message;
      if (this.usertype == "customer") {
        itemToUpdate.last_user = itemToUpdate.customerName;
      } else {
        itemToUpdate.last_user = itemToUpdate.businessName;
      }

      //   console.log(itemToUpdate)

      //   console.log(this.userlist);
      //   console.log(this.index)
      //   this.userlist.splice(this.index, 1);
      //   console.log(this.userlist);
      //   this.userlist.push(itemToUpdate);

      console.log(this.userlist);

      await database.collection("chatrooms").doc(this.chatroomID).update({
        last_date: item.newDate,
        last_message: this.text,
        last_user: itemToUpdate.last_user,
      });
      //   this.userlist[this.index]["last_date"] = item.time;
      //   this.userlist[this.index]["last_message"] = this.text;
      //   this.userlist.sort((x, y) => {
      //     return y["last_date"] - x["last_date"];
      //   });

      console.log(this.messages);
      this.text = "";
      this.index = 0;

      this.$refs["scrollchat"].scrollTo(
        {
          y: "100%",
        },
        600
      );
      console.log("helo");
    },

    // fetchUsertype: async function () {
    //   await database
    //     .collection("users")
    //     .doc(this.userID)
    //     .get()
    //     .then((snapshot) => {
    //       const data = snapshot.data();
    //       this.usertype = data.usertype;
    //     });
    //   console.log(this.usertype);
    // },

    // fetchUserList: function () {
    //   var query = "";
    //   if (this.usertype == "customer") {
    //     query = "customerID";
    //   } else {
    //     query = "businessID";
    //   }
    //   database
    //     .collection("chatrooms")
    //     .where(query, "==", this.userID)
    //     .get()
    //     .then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         const data = doc.data();
    //         this.userlist.push([data["businessName"]]);
    //       });
    //     });
    //   console.log(this.userlist);
    // },
  },

  created() {
    this.fetchUserID();
    // this.fetchUserList();
  },
};
</script>


<style scoped>
.ps2 {
  height: 400px;
}

li {
  list-style: none;
}

ul {
  padding-left: 0;
}

.full-container {
  display: flex;
  margin: auto;
  padding: 0;
  width: 95%;
}

.chatlist {
  float: left;
  width: 20%;
  text-align: left;
  margin: 0 1% 0 0;
  border-bottom: 1px solid grey;
  height: 65vh;
}

.indiv-chatlist {
  padding-top: 12px;
  border-top: 1px solid grey;
  cursor: pointer;
}

.indiv-chatlist:hover {
  background-color: lightgrey;
}

.chatpage {
  float: right;
  width: 80%;
  padding-left: 5%;
  border-left: 1px solid grey;
}

.chatpage-header {
  padding-bottom: 5px;
  border-bottom: 1px solid grey;
}

.scroll {
  height: 60vh;
}

.right {
  text-align: right;
  padding: 2px;
}

.right-content {
  display: inline-block;
  width: 40%;
  background-color: pink;
  margin: 0px;
  text-align: left;
  padding: 5px 15px 5px 15px;
  border-radius: 20px;
  word-break: break-all;
}

.left {
  text-align: left;
}

.left-content {
  display: inline-block;
  width: 40%;
  background-color: whitesmoke;
  margin: 0px;
  text-align: left;
  padding: 5px 15px 5px 15px;
  border-radius: 20px;
  word-break: break-all;
}

.chat-messages {
  padding-top: 10px;
}

.small-date-right {
  margin-bottom: 0px;
  padding-top: 1px;
  padding-right: 15px;
}

.small-date-left {
  margin-bottom: 0px;
  padding-top: 1px;
  padding-left: 15px;
}
</style>