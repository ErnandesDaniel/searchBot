import autorization from './pages/autorization.vue'
import confirmRegistration from './pages/confirmRegistration.vue'
import recoverPassword from './pages/recoverPassword.vue'
import createNewPassword from './pages/createNewPassword.vue'
import needForConfirmationEmail from './pages/needForConfirmationEmail.vue'
import getAuthorizationLink from './pages/getAuthorizationLink.vue'
import goToEmailToLogIn from './pages/goToEmailToLogIn.vue'
import logInByLink from './pages/logInByLink.vue'
import needForChangePassword from './pages/needForChangePassword.vue'




export const routes = [


  {
    path: '/autorization',

    meta:{requiredAuthStatus:false},
    
    children:[

      { path: '', component:autorization, name:'autorization'},

      { path: 'recoverPassword', component:recoverPassword},

      { path: 'confirmRegistration', component:confirmRegistration},

      { path: 'createNewPassword', component:createNewPassword},

      { path: 'needForConfirmationEmail', component:needForConfirmationEmail},

      { path: 'needForChangePassword', component:needForChangePassword},
      
      { path: 'getAuthorizationLink', component:getAuthorizationLink},

      { path: 'goToEmailToLogIn', component:goToEmailToLogIn},

      { path: 'logInByLink', component:logInByLink},

    ],

  },

];
