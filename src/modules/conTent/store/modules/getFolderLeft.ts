export default{
	namespace:true,
	state:()=>({
		folderLeftInfo:{
			id:'',
			
		}, 
		folderLeftList:[]
	}),
	mutations:{
		getfolderLeftInfo(state:any,value:any){
			state.folderLeftInfo = {...value}
            console.log(state.folderLeftInfo,'state.folderLeftInfo');
            
		},
		getfolderLeftList(state:any,value:any){
			state.folderLeftList =  value
            console.log(state.folderLeftList,'state.folderLeftList');

		}
		 
	},
	actions:{
		// getEditContentList(state:any,value:any){
		// 	console.log(value,'value')
		// 	debugger
		// 	state.editContentList = value
		// }
	}
}