export default{
	namespace:true,
	state:()=>({
		columnList:[]
	}),
	mutations:{
		changeColumnList(state: any,value: any){
			 
			state.columnList = value
		},
	},
	actions:{
		 
	}
}