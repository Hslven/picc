export default{
	namespace:true,
	state:()=>({
		editContentList:'',
		editCOntentId:''
	}),
	mutations:{
		getEditContentId(state:any,value:any){
			
		},
		getEditContentList(state:any,value:any){
			state.editContentList = value
		}
	},
	actions:{
		// getEditContentList(state:any,value:any){
		// 	 
		// 	debugger
		// 	state.editContentList = value
		// }
	}
}