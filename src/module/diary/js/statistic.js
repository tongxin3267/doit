var statistic={
  //日志统计
  list: {
    url: '/portal/diaryAction!countDiaryRule.action',
    data: [],
    powerPermission: false,
  },
  //获取历史
  history: {
    //加载更多组件
    loadMore:{
      url:"/portal/diaryAction!getRuleOfAllRecord.action",     //请求路径
      pageIndexName:"page",//不同应用不同分页参数
      data:{ //ajax入参数据
        ruleId:'',
        page:1,
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
  },

  //统计详情
  detail: {
    url: "/portal/diaryAction!getRuleSubmitDetail.action",
    sendRemindUrl:"/portal/diaryAction!sendRemindDiary.action",
    detailNav: {
      index: 0,
      nav: [
        {
          content: '已提交',
          num: '',
          data: {
            ruleId: '',
            date: '',
            type: 1,
            status: 2
          }
        },
        {
          content: '未提交',
          num: '',
          data: {
            ruleId: '',
            date: '',
            type: 2,
            status: 2
          }
        }
      ],
    },
    buttonConfig:{ //操作按钮
      primaryList:[],
      defaultList:[{type:"default",name:'下一周', callBack:null}],
      class:"active"//按钮是否置底部 active :底部、"":相对定位
    },
  },

  //没有数据
  noRecord:{
    show:true,
    title:"暂无数据",
    icon:"qwui-icon_text",
    text:"可前往",
    operation:{
      text:"设置统计规则",
      callBack:null
    }
  },

  //没有权限
  noPermission:{
    show:true,
    title:"暂无权限",
    setTop:true,//是否置顶?覆盖整个页面
    icon:"qwui-icon_noPermission",
    text:"没有权限查看日志统计，请联系管理员",
    operation:{
      text:"",
      callBack:null
    }
  }
};
export default statistic;
