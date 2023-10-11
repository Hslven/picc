export default{
	namespace:true,
	state:()=>({
		labeTreeList:[],
		contentType:''
	}),
	mutations:{
		getLabeTreeList(state:any,value:any){
			 
			state.labeTreeList = value
		},
		getContentType(state:any,value:any){
			 
			state.contentType = value
		}
	},
	actions:{
		 
	}
}