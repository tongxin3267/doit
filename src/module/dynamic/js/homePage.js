var homePage={
  searchBar:{ //头部搜索框
    show:true,
    keyWord:'',
    rightSpan:{
      show:true,
      callback:null
    },
    moreFunction:{
      show:true,
      defaultChoose:'',
      option:[
        {name:'员工祝福', callback:null, placeholder:'搜索', value:0},
        {name:'私人信箱', callback:null, placeholder:'搜索', value:1}
      ]
    }
  },
  actionSheet: { // 搜索框右边点击动作面板
    show: false,
    title: '',//头部标题
    btnConfig: [
      {title: "我发布的", data:3, callBack: null},
      {title: "草稿", data:4, callBack: null},
      {title: "取消", callBack: null}
    ]
  },
  homeFooter: {//有发布动态权限，底部按钮
    text: "发布动态",
    callBack: null
  },
  //加载更多组件
  loadMore:{
    url:"/portal/dynamicinfomanage/dynamicinfomanageAction!listPageDynamicInfoByType.action",     //请求路径
    pageIndexName:"page",//不同应用不同分页参数
    data:{ //ajax入参数据
      page:1,
      size:10,
      status:1,
      schType:'',
      belongAgent: dataBase.wxqyh_uploadfile.agent,
      'tbXyhDynamicinfoPO.dynamicType':1,
      'tbXyhDynamicinfoPO.title':''//搜索框keyWord
    },
    pageConfig:{},
    hasRecord:{
      show:false,
      setTop:false,//是否置顶?覆盖整个页面
      icon:"qwui-icon_text",
      title:"没有内容",//若text无内容则title为16px #bbb，有则为18px #666
      text:"可通过管理后台发布内容",//标题下面的提示
    }
  },
};
export default homePage;
