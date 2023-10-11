export default{
	namespace:true,
	state:()=>({
		chooseEditReachId:'',
		chooseEditInfo:[],//编辑进入后表单数据
		editTypeValue:'0',//0新增，1编辑
		contentDetailsIdList:[],
	}),
	mutations:{
		changeEditReachId(state: { chooseEditReachId: string },value: any){
			 
			state.chooseEditReachId = value
		},
		changeEditInfo(state: { chooseEditInfo: any },value: any){
			state.chooseEditInfo = value
		},
		changeEditTypeValue(state: { editTypeValue: any },value: any){
			state.editTypeValue = value
		},
		changeContentDetailsIdList(state: { contentDetailsIdList: any },value: any){
			state.contentDetailsIdList = value
		}
	},
	actions:{
		 
	}
}