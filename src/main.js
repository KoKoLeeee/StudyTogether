import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './routes.js'
import database from "./firebase.js";
import firebase from "firebase";

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const myRouter = new VueRouter({
  routes: Routes,
  mode: 'history'
})

// myRouter.beforeEach((to, from, next) => {
//   const auth = to.meta.auth
//   if (!auth) {
//     next();
//   } else {
//     firebase.auth().onAuthStateChanged((user) => {
//       if (!user) {
//         next('/login');
//       } else {
//         database.collection('users').doc(user.uid).get().then(snapshot => {
//           const data = snapshot.data();
//           const usertype = data.usertype;
//           if (usertype == auth) {
//             next();
//           } else {
//             alert('Not authorized!');
//             next('/');
//           }
//         })
//       }
//     })
//   }
// })
    
  
    // let currentUser = firebase.auth()
    // console.log(currentUser)
    // console.log(currentUser.currentUser)
    // if (!currentUser) {
    //   next({ path: '/login', query: {redirect: to.fullPath} })
    // } else {
    //   const usertype = await database.collection('users').doc(currentUser.uid).get().then(snapshot => {
    //     const data = snapshot.data()
    //     const user = data.usertype
    //     return user
    //   })

    //   console.log(usertype)
    // }


new Vue({
  render: h => h(App),
  router: myRouter
}).$mount('#app')
