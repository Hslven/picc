import { baseApi } from './BaseApi';

//运营位-列表查看
export const getSelectReachMainInfo = (data: any) => baseApi.post('/content/reachMain/selectReachMainInfo', data, 'lc');
//运营位-查看详情-内容
export const getReachContent = (data: any) => baseApi.post('/content/reachContent/getReachContentInfo', data, 'lc');

// public async getScoreDetailList() {
// 	this.formState.page = this.userTablePagination.current;
// 	this.formState.pageSize = this.userTablePagination.pageSize;
// 	const data: any = await scoreDetailQuery(this.formState);
// 	 
// 	if (data.result) {
// 			this.userTablePagination.total = data.result.totalCount;
// 			this.searchTableData = data.result.scoreAccountChannelDataList;
// 	}
// }