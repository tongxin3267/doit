var dataBase={

  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:false,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"diary",
  },
  /*必配-end*/
  loading:{ //加载、提交成功、删除成功
    show: false,
    text: "",
    icon: "",
  },
  selectConfig:{ //负责人、相关人
    show:false,
    signIndex:'',
    selectList:{
      "toPersonList": {
        "show": false,
        "title":"负责人",
        "selectType": "user",
        "userName": "incharges",
        "userSelected": [],
        "deptSelected":[],
        "deptSelectedShow": true,
        "callBack": {
          "confirm": null,
        }
      },
      "ccPersonList": {
        "title":"相关人",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelected":[],
        "deptSelectedShow": true,
        "callBack": {
          "confirm": null,
        }
      },
      "FlowAuditUser":{
        "list":[],
        "callBack": {
          "confirm": null,
        }
      }

    }
  },
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:[//中间自定义内容
    ],
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"", callBack:null}, //次操作按钮
    }
  },

  //需要公用的数据
  home:{
    //首页底部菜单
    homeFooterList:{
      nav_on:0,
      nav:[
        {
          class:"ic_tabar1",
          text:"已提交",
          data:{// 首页列表 已提交
            status:1,
            typeId:'',
            type:1,
            keyWord:'',
            page:1,
            historyYear:'',
            pageSize:20,
          },
          callBack:null
        },
        {
          class:"ic_tabar5",
          text:"待阅",
          data:{ // 待阅
            status:1,
            typeId:'',
            type:2,
            keyWord:'',
            page:1,
            historyYear:'',
            pageSize:20,
          },
          num:"",
          callBack:null
        },
        {
          class:"ic_tabar6",
          text:"统计",
          callBack:null
        },
        {
          class:"ic_tabar7",
          text:"相关日志",
          data:{ // 我负责的 + 我相关的
            status:3,
            typeId:'',
            type:2,
            keyWord:'',
            page:1,
            historyYear:'',
            pageSize:20,
          },
          callBack:null
        }
      ]
    },

    //汇总页
    summaryData:{
      url:'/portal/diaryAction!summaryDiaries.action',
      ids:'',//汇总的日志id
      data:[]
    }
  },

};
export default dataBase;
