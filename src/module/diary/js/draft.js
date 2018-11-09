var draft = {
  //草稿页面 加载更多组件
  loadMore:{
    url:"/portal/diaryAction!myDiary.action",     //请求路径
    pageIndexName:"page",
    data:{ //ajax入参数据
      status:0,
      typeId:'',
      type:1,
      keyWord:'',
      page:1,
      historyYear:'',
      pageSize:20
    },
    padeConfig:{
      currPage:"",
      maxPage:"",
      pageData:[],  //返回的列表数据
      totalRows:"",//数据总条数
    },
    hasRecord:{
      show:false,
      setTop:true,//是否置顶?覆盖整个页面
      icon:"qwui-icon_text",
      title:"暂无记录",//若text无内容则title为16px #bbb
      text:"",
    }
  },

  //搜索框
  searchBar:{
    show:true,//搜索框，默认显示
    keyWord:'',
    moreFunction:{
      show:true,
      option:[
        {name:'标题', callback:null, placeholder:'搜索标题'},
        {name:'填写时间', callback:null, placeholder:'搜索填写时间', value:2}
      ]
    }
  },

  // 点状弹窗列表操作
  dialogListConfig: {
    show: false,
    title: '',
    btnConfig: []
  },
  // 删除草稿
  deleteFun:{
    url:"/portal/diaryAction!ajaxBatchDelete.action",
    data:{}
  },

};
export  default draft;
