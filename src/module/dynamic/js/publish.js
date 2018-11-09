var publish={
  searchBar:{ //头部搜索框
    show:true,
    keyWord:'',
    rightSpan:{
      show:false,
      callback:null
    },
  },
  actionSheet: { // 动作面板
    show: false,
    title: '',//头部标题
    btnConfig: []
  },
  //加载更多组件
  loadMore:{
    url:"",     //请求路径
    pageIndexName:"page",//不同应用不同分页参数
    data:{ //ajax入参数据
      isPassReview:1,
      page:1,
      belongAgent: dataBase.wxqyh_uploadfile.agent
    },
    pageConfig:{},
    hasRecord:{
      show:false,
      setTop:false,//是否置顶?覆盖整个页面
      icon:"qwui-icon_text",
      title:"没有审核动态",//若text无内容则title为16px #bbb，有则为18px #666
      text:"",//标题下面的提示
    }
  },
};
export default publish
