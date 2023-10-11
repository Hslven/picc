
//  准备引入 vuex
import { createStore } from 'vuex'
import changeOperationList from './modules/operationManage'
import contentList from './modules/addOperation'
import editOperation from './modules/editOperation'
import chooseTopicList from './modules/chooseTopicList'

const store = createStore({
    modules:{
			changeOperationList,
			contentList,
			editOperation,
			chooseTopicList
		}
})
export default store