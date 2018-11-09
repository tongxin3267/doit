var dataBase={

    /*必配-start*/
    mask:false,//遮罩层控制
    isShow:false,
    config:'',//公共配置信息
    wxqyh_uploadfile:{ //当前应用名称
      agent:"crm",
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
          "title":"负责人(可查看/修改)",
          "selectType": "user",
          "userName": "incharges",
          "userSelected": [],
          "deptSelected":[],
          "deptSelectedShow": false,
          "callBack": {
            "confirm": null,
          },
        },
        "ccPersonList": {
          "title":"相关人(可查看)",
          "selectType": "user",
          "userName": "relatives",
          "userSelected": [],
          "deptSelected":[],
          "deptSelectedShow": false,
          "callBack": {
            "confirm": null,
          },
        },
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
    //首页
    crm:{
      headData:{
        show:true,
        nav:[
          {class:"ic_sea", text:"公海池", url:"/jsp/wap/crm/territorialSea/territorialSea_list.jsp", name:"", value:""},
          {class:"ic_customer", text:"客户", url:"/jsp/wap/crm/client/client_list.jsp", name:"notReadClientNum", value:""},
          {class:"ic_contact", text:"联系人", url:"/jsp/wap/crm/contact/contact_list.jsp", name:"notReadContactsNum", value:""},
          {class:"ic_visit", text:"拜访", url:"/jsp/wap/crm/outsideworkinfo/outsideworkinfo_list.jsp?status=1&appId=1", name:"notReadVisitNum", value:""},
          {class:"ic_bussiness", text:"商机", url:"/jsp/wap/crm/business/business_list.jsp?type=0", name:"notReadBusinessNum", value:""},
          {class:"ic_agreenment", text:"合同", url:"/jsp/wap/crm/contract/contract_list.jsp?submitStatus=1", name:"notReadContractNum", value:""},
          {class:"ic_data", text:"数据看板", url:"/jsp/wap/crm/client/data_board.jsp", name:"", value:""},
          {class:"ic_check", text:"查重", url:"checkList", name:"", value:""}
        ],
        addnav:[
          {class:"ic_customer", text:"客户", url:"clientOperate", num:""},
          {class:"ic_contact", text:"联系人", url:"/jsp/wap/crm/contact/contact_add.jsp", num:""},
          {class:"ic_visit", text:"拜访", url:"/jsp/wap/crm/outsideworkinfo/outsideworkinfo_add.jsp?appId=1", num:""},
          {class:"ic_bussiness", text:"商机", url:"/jsp/wap/crm/business/business_add.jsp", num:""},
          {class:"ic_agreenment", text:"合同", url:"/jsp/wap/crm/contract/contract_add.jsp", num:""},
        ],
      }
    },
   // 客户新增、编辑页面
   client: {
    clientDetail: {
      buttonConfig:{ //操作按钮
        defaultList:[{type:"default",name:'保存并关闭', callBack:null}],
        primaryList:[{type:"primary",name:'保存并创建联系人',callBack:null}],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
    },
   },

  };
  export default dataBase;
