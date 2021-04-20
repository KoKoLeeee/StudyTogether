import Homepage from './components/Homepage.vue';
import Loginpage from './components/Loginpage.vue';
import Listings from './components/Listings.vue';
import SignupPage from './components/SignupPage.vue';
import IndividualListings from './components/IndividualListings.vue';
import Bookings from './components/Bookings.vue';
import Reviews from './components/Reviews.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import Favourites from './components/Favourites.vue';
import userChart from "./components/userCharts.vue";
import Reservation from './components/Reservation.vue';
import MyBusiness from './components/Business/MyBusiness.vue';
import BusinessSignup from './components/Business/BusinessSignup.vue';
import BizBookings from './components/Business/Biz Bookings.vue';
import Information from './components/Business/Information.vue';
import EditTimeslots from './components/Business/EditTimeslots.vue';
import BizDashboard from './components/Business/Dashboard/BizDashboard.vue'
import ChatRoom from './components/ChatRoom.vue';

import firebase from 'firebase'
import database from './firebase';


export default [
	{
		path: "/",
		component: Homepage,
	},
	{
		path: "/listings",
		component: Listings,
	},
	{
		path: "/listings/:id",
		name: "indiv",
		component: IndividualListings,
		props: true,
	},
	{
		path: "/login",
		component: Loginpage,
	},
	{
		path: "/signup",
		component: SignupPage,
	},
	// {path: '/indiv', component: IndividualListings, props: true},
	{
		path: "/bookings",
		component: Bookings,
	},
	{
		path: "/userChart",
		component: userChart,
		meta: { auth: "customer" },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a customer to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},
	{
		path: "/forgotpassword",
		component: ForgotPassword,
	},
	{
		path: "/favourites",
		name: "favourites",
		component: Favourites,
		meta: { auth: "customer" },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a customer to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},
	{
		path: "/reviews/:id",
		component: Reviews,
		props: true,
		meta: { auth: "customer" },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a customer to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},
	{
		path: "/listings/:id/reserve",
		name: "reservation",
		component: Reservation,
		props: true,
		meta: { auth: "customer" },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a customer to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},
	{
		path: "/mybiz",
		name: "business",
		component: MyBusiness,
		meta: { auth: "owner" },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a business owner to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},
	{
		path: "/bizsignup",
		component: BusinessSignup,
	},
	// {
	// 	path: "/info",
	// 	name: "info",
	// 	component: Information,
	// 	meta: { auth: "owner" },
		
	// },
	{
		path: "/bizBookings",
		component: BizBookings,
		meta: { auth: "owner" },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a business owner to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},
	// {
	// 	path: "/edit",
	// 	name: "edit",
	// 	component: EditTimeslots,
	// 	props: true,
	// 	meta: { auth: "owner" },
	// },
	{
		path: '/bizdashboard',
		component: BizDashboard,
		meta: { auth: 'owner' },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					database.collection('users').doc(user.uid).get().then(snapshot => {
						const data = snapshot.data()
						const usertype = data.usertype;
						if (usertype == to.meta.auth) {
							next();
						} else {
							alert('Log in as a business owner to acess!')
							next(from);
						}
					})
				} else {
					next('/login')
				}
			})
		}
	},

	{
		path: '/chat',
		component: ChatRoom,
		meta: { requiredAuth: true },
		beforeEnter: (to, from, next) => {
			firebase.auth().onAuthStateChanged(user => {
				if (user) {
					next()
				} else {
					alert('Log in to have access!')
					next(from);
				}
			})
		}
	}
];
