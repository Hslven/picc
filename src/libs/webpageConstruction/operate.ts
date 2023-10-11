interface handleListType {
	key:string,
	value:string,
	label:string,
	disabled:boolean
}
interface HandleActions {
  deleteApp: (record: any) => void;
  anotherMethod?: (param: any) => void;  // 你可以继续添加其他的方法
}

  //初始化table操作按钮
	const handleList:handleListType [] = [
		{
			key:'0',
			value:'0',
			label:'详情',
			disabled:false
		},
		{
			key:'10',
			value:'10',
			label:'复制',
			disabled:false
		},
		{
			key:'1',
			value:'1',
			label:'编辑',
			disabled:false
		},
		{
			key:'2',
			value:'2',
			label:'上架',
			disabled:false
		},
		{
			key:'3',
			value:'3',
			label:'下架',
			disabled:false
		},

    {
			key:'5',
			value:'5',
			label:'链接',
			disabled:false
		},
    {
			key:'6',
			value:'6',
			label:'下载',
			disabled:false
		},
		{
			key:'7',
			value:'7',
			label:'粘贴',
			disabled:false
		},
		{
			key:'8',
			value:'8',
			label:'批量复制',
			disabled:false
		},
		{
			key:'9',
			value:'9',
			label:'批量删除',
			disabled:false
		},
		{
			key:'4',
			value:'4',
			label:'删除',
			disabled:false
		},

	]
  //操作按钮点击
   const handleChoose = (record: any, item: any,actions: HandleActions): void => {
    // if(item === '4'){
    //   // console.log(actions.deleteApp)
    //   actions.deleteApp(record);
    // }    
}
const getFilteredList = (labels: string[]) => handleList.filter(item => labels.includes(item.label));

export { handleChoose,handleListType,handleList,getFilteredList };
