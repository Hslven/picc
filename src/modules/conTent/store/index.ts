
//  准备引入 vuex
import { createStore } from 'vuex'
 
import LeftFolderList from './modules/LeftFolderList'
import addContent from './modules/addContent'
import editContent from './modules/editContent'
import getFolderLeft from './modules/getFolderLeft'
import getTableIfo from './modules/getTableIfo'

const store = createStore({
    modules:{
		LeftFolderList,
		addContent,
		editContent,
		getFolderLeft,
		getTableIfo
		}
})
export default store