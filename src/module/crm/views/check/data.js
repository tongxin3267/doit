var checkData = {
  //查重页面 加载更多组件
  loadMore:{
    url:"/portal/client/searchRepeatClientList.do",     //请求路径
    pageIndexName:"page",
    data:{ //ajax入参数据
      status:0,
      typeId:'',
      type:2,
      keyWord:'',
      page:1,
      historyYear:'',
      pageSize:10
    },
    padeConfig:{
      currPage:"",
      maxPage:"",
      pageData:[],  //返回的列表数据
      totalRows:"",//数据总条数
    },
    listConfig:{
      type:"",
      topItem:"",
      secondItem:"",
      lastItem:"",
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
    show:false,//搜索框，默认显示
    keyWord:'',
    // moreFunction:{
    //   show:false,
    // }
  },

};
export  default checkData;
