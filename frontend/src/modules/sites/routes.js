import siteList from './pages/siteList.vue';
import siteListRequests from './pages/siteListRequests.vue';
import createRequest from './pages/createRequest.vue';
import objectList from './pages/objectList.vue';
import updateRequest from './pages/updateRequest.vue';


export const routes = [

  {

    path: '/siteList',

    component:siteList,

    meta:{nameOfPage:'Список сайтов', requiredAuthStatus:true},
    
  },

  {

    path: '/siteList/:siteName/requestsList', 

    component:siteListRequests,

    meta:{nameOfPage:'', requiredAuthStatus:true},

  },

  {

    path: '/siteList/:siteName/createRequest',

    component:createRequest,

    meta:{nameOfPage:'', requiredAuthStatus:true},
    
  },

  {

    path: '/siteList/:siteName/updateRequest/:requestId',

    component:updateRequest,

    meta:{nameOfPage:'', requiredAuthStatus:true},
    
  },


  {

    path: '/siteList/:siteName/:requestId/objectsList',

    component:objectList,

    meta:{nameOfPage:'', requiredAuthStatus:true},
    
  },


];
