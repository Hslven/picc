export default{
	namespace:true,
	state:()=>({
		operationList:[],
		chooseType:{},
		paginationValue:{
			current:1,
			defaultCurrent: 1, // 默认当前页数
			defaultPageSize: 10, // 默认当前页显示数据的大小
			total:0, // 总数，必须先有
			showSizeChanger: true,
			showQuickJumper: true,
			pageSizeOptions: ["5", "10", "15", "20"],
			showTotal: (total:number) => `共 ${total} 条`, // 显示总
		},
	}),
	mutations:{
		changeOperationList(state: { operationList: any },value: any){
			 
			state.operationList = value
		},
		changeChooseType(state: any,value: any){
			 
			state.chooseType = value
		},
		changePaginationValue(state:any,value:any){
			 
			state.paginationValue = value
		}
	},
	actions:{
		 
	}
}