import Homepage from './components/Homepage.vue';
import Loginpage from './components/Loginpage.vue';
import Listings from './components/Listings.vue';
import SignupPage from './components/SignupPage.vue';
import IndividualListings from './components/IndividualListings.vue';
import Bookings from './components/Bookings.vue';
import Reviews from './components/Reviews.vue';
<<<<<<< HEAD
import ForgotPassword from './components/ForgotPassword.vue';
=======
import Favourites from './components/Favourites.vue';
import Reservation from './components/Reservation.vue';
>>>>>>> bb5dc1fc4820259897b5e1b1c436ee22fbbc34e8

export default[
    {path: '/', component: Homepage},
    {path: '/listings', component: Listings},
    {path: '/listings/:id', name: 'indiv', component: IndividualListings, props:true},
    {path: '/login', component: Loginpage},
    {path: '/signup', component: SignupPage},
    // {path: '/indiv', component: IndividualListings, props: true},
    {path: '/bookings', component: Bookings},
<<<<<<< HEAD
    {path: '/reviews', component: Reviews},
    {path: '/forgotpassword', component: ForgotPassword}
=======
    {path: '/favourites', name: "favourites", component: Favourites},
    {path: '/reviews/:id', component: Reviews, props: true},
    {path: '/listings/:id/reserve', name: 'reservation', component: Reservation, props:true}
>>>>>>> bb5dc1fc4820259897b5e1b1c436ee22fbbc34e8
]