export default{
	namespace:true,
	state:()=>({
		tableInfo:{
            isRowSelected:false
        }
	}),
	mutations:{
		isTableRowSelected(state:any,value:any){
			state.tableInfo.isRowSelected = value
            console.log(state.tableInfo.isRowSelected,value,'zzzzzzzzz');
            
		}
	},
	actions:{
		 
	}
}