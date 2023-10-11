export default{
	namespace:true,
	state:()=>({
		ditch:'',
		operationName:'',
		coverLength:'',
		coverWidth:'',
		contentList:[],//内容描述抽屉列表数据
		contentAllNumber:0,//数据总量
		tableContentList:[],//选中的内容描述数据
		editContentList:[],
		contentListAll:[],
		chooseContentListAll:[],//选中的内容总数据
		includeTagList:[],//标签列表
		displayContentList:[],//反显内容
		contentDetailsIds:[],
		formDataName:'',
		editTypeValue:''
	}),
	mutations:{
		changeAddDitch(state: { ditch: any },value: any){
			state.ditch = value
		},

		changeAddOperationName(state: { operationName: any },value: any){
			state.operationName = value
		},

		changeAddCoverLength(state: { coverLength: any },value: any){
			state.coverLength = value
		},

		changeAddCoverWidth(state: { coverWidth: any },value: any){
			state.coverWidth = value
		},

		changeContentList(state: { contentList: any },value: any){
			 
			state.contentList = value
		},

		changeContentAllNumber(state: { contentAllNumber: any },value: any){
			state.contentAllNumber = value
		},

		changeTableContentList(state:any,value:any){
			state.chooseContentListAll = []
			 
			state.tableContentList = value
			value.forEach((res:any) => {
				 
				state.chooseContentListAll.push(...res.contentIdList)
			})
			 
			state.contentListAll = []
			state.chooseContentListAll.forEach((res:any) => {
				state.contentListAll.push(res)
			})
			state.editContentList.forEach((res:any) => {
				state.contentListAll.push(res)
			})
			 
			 
		},
		changeTableContentEditList(state:any,value:any){
			state.editContentList = []
			 
			if(value === '1'){

			} else {
				state.editContentList = value.map((res:any) => {return {contentId:res}})
				state.contentListAll = []
				state.chooseContentListAll.forEach((res:any) => {
					state.contentListAll.push(...res.contentDataList)
				})
				if(state.editContentList.length !== 0){
					state.editContentList.forEach((res:any) => {
						state.contentListAll.push(res)
					})
				}
			}
			// if(value.length === 0){
			// 	state.editContentList = []
			// } else {
			// 	state.editContentList = value.map((res:any) => {return {contentId:res}})
			// }
			 
			 
		},

		changeIncludeTagList(state: { includeTagList: any },value: any){
			 
			state.includeTagList = value
		},
		
		changeDisplayContentList(state: { displayContentList: any },value: any){
			state.displayContentList = value
		},
		changeContentDetailsIds(state:any,value:any){
			state.contentDetailsIds = value
		},
		changeFormDataName(state:any,value:string){
			state.formDataName = value
		},
		changeEditTypeValue(state: any,value: any){
			if(value === '0'){
				state.ditch = '',
				state.operationName = '',
				state.coverLength = '',
				state.coverWidth = '',
				state.contentList = [],
				state.contentAllNumber = 0,
				state.tableContentList = [],
				state.includeTagList = [],
				state.contentDetailsIds = [],
				state.formDataName = ''
			}
		}
	},
	actions:{
		 
	}
}