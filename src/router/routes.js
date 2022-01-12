function guardMyroute (to, from, next) {
  var isAuthenticated = false;
  // //this is just an example. You will have to find a better or 
  // // centralised way to handle you localstorage data handling 
  if (localStorage.getItem('token'))
    isAuthenticated = true;
  else
    isAuthenticated = false;
  if (isAuthenticated) {
    next(); // allow to enter route
  }
  else {
    next('/')
  }
}

function ifnotguardMyroute (to, from, next) {
  var isAuthenticated = false;
  // //this is just an example. You will have to find a better or 
  // // centralised way to handle you localstorage data handling 
  if (!localStorage.getItem('token'))
    isAuthenticated = true;
  else
    isAuthenticated = false;
  if (isAuthenticated) {
    next(); // allow to enter route
  }
  else {
    next('/home')
  }
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '/Signup', component: () => import('pages/Signup.vue'), beforeEnter: ifnotguardMyroute },
      { path: '', component: () => import('pages/Login.vue'), beforeEnter: ifnotguardMyroute },
      { path: '/signout', component: () => import('pages/signout.vue'), beforeEnter: guardMyroute }
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), beforeEnter: guardMyroute },
      { path: '/registration_code', component: () => import('src/pages/RegistrationCode.vue'), beforeEnter: guardMyroute },
      { path: '/wallet', component: () => import('src/pages/wallet.vue'), beforeEnter: guardMyroute },
      { path: '/order_history', component: () => import('src/pages/OrderHistory.vue'), beforeEnter: guardMyroute },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
