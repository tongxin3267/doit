var homePage = {
  // 搜索框数据
  searchData: {
    show: true, // 搜索框，默认显示
    keyWord: '',
    ridMask: false,
    moreFunction: {
      show: true,
      option: [
        {
          name: '课程',
          callback: null,
          placeholder: '课程名称',
          value: 0
        },
        {
          name: '直播',
          callback: null,
          placeholder: '直播名称',
          value: 1
        },
        {
          name: '考试/练习',
          callback: null,
          placeholder: '考试/练习名称',
          value: 2
        }
      ]
    }
  },
  //加载更多组件
    loadMore:{
      url:"/portal/diaryAction!myDiary.action",     //请求路径
      pageIndexName:"page",//不同应用不同分页参数
      data:{ //ajax入参数据
        status:1,
        typeId:'',
        type:1,
        keyWord:'',
        page:1,
        historyYear:'',
        pageSize:20,
      },
      padeConfig:{},
      hasRecord:{
        show:false,
        setTop:false,//是否置顶?覆盖整个页面
        icon:"qwui-icon_text",
        title:"暂无记录",//若text无内容则title为16px #bbb，有则为18px #666
        text:"",//标题下面的提示
      }
    },
}

export default homePage
