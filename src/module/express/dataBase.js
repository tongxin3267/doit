var dataBase={
  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:false,
  loading:{
    show: false,
    text: "",
    icon: "",
  },//加载、提交成功、删除成功
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"express",
  },
  /*必配-end*/
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:[],//中间自定义内容
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"", callBack:null}, //次操作按钮
    }
  },
  selectConfig:{ //负责人、相关人
    show:false,
    signIndex:'',
    selectList:{
      "toPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "incharges",
        "userSelected": [],
        "callBack": {
          "confirm": null
        }
      }
    }
  },
  home:{
    dialogBottomConfig: { // 底部弹框操作
      show: false,
      title: '',
      btnConfig: []
    },
    searchBar:{ //头部搜索框
      show:true,
      keyWord:'',
      rightSpan:{
        show:false,
        callback:null
      },
      moreFunction:{
        show:true,
        option:[
          {name:'收件人', callback:null, placeholder:'搜索收件人', value:0},
          {name:'创建时间', callback:null, placeholder:'按创建时间搜索', value:1}
]
      }
    },
    homeNav: {//菜单栏
      index:0,
      scroll:true,
      nav:[
        {
          content: '未领取',
          data:{
            keyWord:'',
            page:1,
            status:0,
            toptypes:''//按收件人查找是0 ，按时间查找是1
          }
        },
        {
          content: '已领取',
          data:{
            keyWord:'',
            page:1,
            status:1,
            toptypes:''
          }
        }
      ],
    },
    homeList:{
      loadMore:{//加载更多组件
        url:"/portal/expressAction!ajaxSearch.action",     //请求路径
        pageIndexName:"page",//不同应用不同分页参数
        data:{ //ajax入参数据
          keyWord:'',
          page:1,
          status:0,
          toptypes:'0'
        },
        padeConfig:{
          currPage:"",
          maxPage:"",
          pageData:[],  //返回的列表数据
          totalRows:""//数据总条数
        },
        hasRecord:{
          show:false,
          setTop:false,//是否置顶?覆盖整个页面
          icon:"qwui-icon_box",
          title:"没有快递记录",//若text无内容则title为16px #bbb，有则为18px #666
          text:"手机扫码快速录入、一键催领"//标题下面的提示
        }
      }
    },
    homeFooter: {//有输入权限，底部的样式
      text: "录入快递",
      callBack: null
    },
    buttonConfig:{ //点击复选框后，显示的底部操作按钮，选择后催领/关闭
      show:false,
      primaryList:[],
      defaultList:[{type:"default",name:'催领快递', callBack:null},{type:"default",name:'关闭快递', callBack:null}],
      class:"active"//按钮是否置底部 active :底部、"":相对定位
    },
    oneKeyUrge:{//一键催领
      url:"/portal/expressAction!batchSendMsg.action"
    },
    oneKeyClose:{//一键关闭
      url:"/portal/expressAction!oneKeyClose.action"
    },
    doUrge:{
      url:"/portal/expressAction!againBatchSendMsg.action"
    },
    doClose:{
      url:"/portal/expressAction!closeExpress.action"
    }
  },
  add:{
    url:"/portal/expressAction!ajaxAdd.action",
    hasRecord:{
      show:false,
      setTop:true,//是否置顶?覆盖整个页面
      icon:"qwui-icon_noPermission",
      title:"i18n.noPermission",//若text无内容则title为16px #bbb，有则为18px #666
      text:"i18n.noExpressPermission",//标题下面的提示
    },
    imgUpload: {
      picList: [],
      clearCache: false,
    },
    settingStatus:{
      url:"/portal/expressAction!getIsPower.action"
    },
    buttonConfig:{
      show:true,
      primaryList:[{type:"primary",name:'提交', callBack:null}],
      defaultList:[],
      style:{class:""}//按钮是否置底部 active :底部、"":相对定位
    }
  },
  detail:{
    getDetail:{
      url:"/portal/expressAction!getDetail.action",
      detail:{}
    },
    doUrge:{ //详情页的催领
      url:'/portal/expressAction!againSendMsg.action'
    },
    update:{ //详情页的关闭\确认领取
      url:"/portal/expressAction!updateExpressStatus.action",
    },
    //代领
    addRecipient:{
      url:"/portal/expressAction!addRecipient.action",
    }
  }
};

export default dataBase;
