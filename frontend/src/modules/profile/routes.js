import profile from './pages/profile.vue';

export const routes = [

  {

    path: '/profile',
    meta:{nameOfPage:'Профиль', requiredAuthStatus:true},
    component: profile,
    name:'profile',
    
  },

];
