export default{
	namespace:true,
	state:()=>({
		LeftFolderList:[]
	}),
	mutations:{
		getLeftFolderList(state:any,value:any){
			 
			state.LeftFolderList = value
		}
	},
	actions:{
		 
	}
}