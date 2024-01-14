
import { defineStore } from 'pinia'

import { useAutorizationStore } from '@/modules/autorization'

export const useRequestsStore = defineStore('requests',{

	state:()=>{
		
		return{
			
			
			requestsList:[],
			
			siteName:'',


		}
		
	},

	actions:{

		setRequestsList(arrayOfRequests){
			
			this.requestsList=arrayOfRequests;


		},

		addRequest(newRequest){
			
			this.requestsList.unshift(newRequest);

		},
		
		
		updateRequest(newRequest){
				
			this.requestsList=this.requestsList.map((el)=>{
					
				if(el.id==newRequest.id){
						
					return {...newRequest};
						
				}else{
						
					return {...el};
						
				}
					
			});

		},
		

		deleteRequest(idToDelete){

			this.requestsList= this.requestsList.filter(el => el.id != idToDelete);

		},
		
		setSiteName(newName){
			
			this.siteName=newName;	
			
		}
		
	},

})