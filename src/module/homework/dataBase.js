var dataBase={

	/*必配-start*/
	mask:false,//遮罩层控制
  isShow:false,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"homework",
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
        "title":"",
        "selectType": "user",
        "userName": "incharges",
        "userSelected": [],
        "callBack": {
          "confirm": null
        }
      },
      "ccPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "callBack": {
          "confirm": null
        }
      },
    }
  },
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:[//中间自定义内容
      //   { //进度
      //     type:"rateType",
      //     rateList: [{text: "", time: "", rateValue: ""}],
      //   },
      //   {//更新进度
      //   type:"updateRateType",
      //   updateRateType:{rateValue:"", limit:10,name:"",}//返回值名称
      //   },
      //   { //单选框
      //   type:"radioType",
      //   radioType:{name:"",title:"结束类型", list:[{text:"作业完成", value:"0",}, {text:"作业终止", value:"1",}, {text:"作业取消", value:"2",},],}
      //  },
      //   {//评分
      //   type:"scoreType",
      //   scoreType:{name:"",title:"",num:"10",score:"10"}//小标题、num:10个星级，不配置默认为10、每个星级的分数 score：10,不配置默认为1
      //   },
      // //选择时间
      //   {
      //   type:"dateTime", dateTime:{name:"",title:"",value:""}//头部标题、值
      //   },
      //   {//评语
      //   type:"comment",
      //     error:"",//错误提示
      //   comment:{
      //     name:"",//返回值名称
      //     maxLength:'',//限制字数长度
      //     placeholder:"",//描述提示
      //     value:"",//评语值
      //   }
      // },
    ],
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"", callBack:null}, //次操作按钮
    }
  },

  	//首页
  home:{
  		headData:{
        show:true,
  			nav:[
  				{class:"ic_add", text:"i18n.addHomework", url:"add"},
  				{class:"ic_draft", text:"i18n.draft", url:"draft", num:""}
  				],
        searchBar:{
          show:false,//搜索框，默认显示
        },
  		},

    //加载更多组件
      loadMore:{
        url:"/portal/homeworkAction!myHomework.action",     //请求路径
        pageIndexName:"page",//不同应用不同分页参数
        data:{ //ajax入参数据
          page:1,
          pageSize:10,
          keyWord:'',
          status:3,
          type:1
        },
        padeConfig:{},
        hasRecord:{
          show:false,
          setTop:true,//是否置顶?覆盖整个页面
          icon:"qwui-icon_text",
          title:"i18n.noRecord",//若text无内容则title为16px #bbb，有则为18px #666
          text:"",//标题下面的提示
        }
      },

    // 相关页面菜单切换 未阅 type=2, status=3; 逾期 type=2, status=5; 已关闭 type=2, status=2
      selectData: {
        index:0,
        nav:[]
      },
      homeContentList:{
        dialogListConfig: { // 点状弹窗列表操作
          show: false,
          title: '',//头部标题
          btnConfig: []
        },
        delete:{ // 删除列表
          url:"/portal/homeworkAction!ajaxBatchDelete.action",
          checkUrl: "/portal/homeworkAction!ajaxBatchCheck.action",
          data:{}
        },
        updateHomeworkStop: { // 更新截止时间
          url: "/portal/homeworkAction!updateHomeworkStop.action?homeworkId=",
          data: {}
        },
        restartOrEndHomework:{ // 重启或结束作业
          url: "/portal/homeworkAction!updateHomeworkStatus.action",
          data:{}
        },
        indexCount:{ // 首页草稿、待办的数量
          url: "/portal/homeworkAction!findCount.action",
          data:{}
        }
      },
      homeFooterList:{
        nav_on:0,
        nav:[
          {
            class:"ic_tabar1",
            text:"i18n.myPublished",
            data:{// 首页列表 type=1;status=1
              page:1,
              pageSize:10,
              keyWord:'',
              status:3,
              type:1
            },
            callBack:null
          },
          {
            class:"ic_tabar2",
            text:"i18n.myDealing",
            data:{ // 待我处理 type=2;status=0
              page:1,
              pageSize:10,
              keyWord:'',
              status:0,
              type:2
            },
            num:"",
            callBack:null
          },
          {
            class:"ic_tabar3",
            text:"i18n.myRelavent",
            data:{ // 我的 type=2;status=3
              page:1,
              pageSize:10,
              keyWord:'',
              status:3,
              type:2
            },
            callBack:null
          }
        ]
      }
  },

  //详情页数据
  detailData:{
    homeworkDetail:{
      url:"/portal/homeworkAction!getHomeworkDetail.action",
      data:{ //ajax入参数据
        homeworkId:'',
        userId:'',
        size:"10",
      },
      detail:{ //详情内容
        openPrint:true,
        creator:"",
        title:"",
        personName:"",
        createTime:"",
        describes:[],//循环字段
        content:"",
        configCopy:{},//复制页面信息到新建页面
        picList:[],//上传的图片列表
        mediaList:[],//上传的附件列表
        buttonConfig:{ //操作按钮
          primaryList:[],
          defaultList:[],
          class:"active",//按钮是否置底部 active :底部、"":相对定位
        },
        //负责人、相关人
        userListConfig:{},
        isUseRate:""
      },
      listRecRate:[], //4条作业进度列表
      template:{  //作业类型
        url:"/portal/homeworkAction!getHomeworkTemplate.action",
      },
      listComment:{ //评论
        get:{  //获取
          url:"/portal/homeworkAction!listComment.action",
          pageIndexName:"page",//当前分页参数名称
          hasMore:false,
          data:{
            id:"",
            size:10,
            commentStatus:"1",//1只看评论，2显示全部
            page:1,
          },
        },
        send:{ //发送
          url:"/portal/homeworkAction!commitComment.action",
          contentObject:'tbQyHomeworkCommentPO.content',//传送的内容字符串
          data:{}
        },
        delete:{ //删除
          url:"/portal/homeworkAction!deleteComment.action",
          commentId:"commentId",//需要传的id字段
          data:{}
        },
        comments:[], //评论数据列表
        totalPages:0
      },
      getRateDetailed:{ //查询具体成员进度弹窗
        url:"/portal/homeworkAction!getRateDetailed.action"
      },
      updateRated:{ //提交按钮更新进度
        oldRate:"",
        url:"/portal/homeworkAction!updateRate.action",
        data:{
          rate:"", //进度
          type:"1",
          updateUserId:"",
          reason:"" //描述内容
        }
      },
      updateOverTime:{//修改截止时间
        url:"/portal/homeworkAction!updateHomeworkStop.action",
        data:{
          homeworkId:"",
          homeworkStop:"",
          reason:"",
        }
      },
      endHomeworkTesk:{ //结束按钮
        url:"/portal/homeworkAction!updateHomeworkStatus.action",
        data:{}
      }
    }, //end
    //全部作业进度列表
    homeworkRate:{
      show:false,
      menuNav:{ //tab菜单切换
        show:false,
        navNum:0,
        navBar:[
          {name:"i18n.all",num:"",data:{type:"0"},callBack:null},
          {name:"i18n.completed",num:"",data:{type:"1"},callBack:null},
          {name:"i18n.uncompleted",num:"",data:{type:"2"},callBack:null},
        ],
      },
      buttonConfig:{ //操作按钮
        primaryList:[{type:"primary",name:"i18n.remindSubmit", callBack:null}],
        defaultList:[{type:"default",name:"i18n.returnBack", callBack:null}],
        class:"active"//按钮是否置底部 active :底部、"":相对定位
      },
      getRateDetailed:{ //查询具体成员进度弹窗
        url:"/portal/homeworkAction!getRateDetailed.action"
      },
      remindOver:{  //提醒未填写
        url:"/portal/homeworkAction!remindUnOver.action",
        data:{}
      },
      loadMore:{      //加载更多组件
        url:"/portal/homeworkAction!allHomeworkRate.action",     //请求路径
        pageIndexName:"",
        data:{ //ajax入参数据
          isOver:0,
          page:1,
          homeworkId:'',
        },
        padeConfig:{
          currPage:"",
          maxPage:"",
          pageData:[],  //返回的列表数据
          totalRows:"",//数据总条数
        },
        hasRecord:{}
      }
    },//end
  },

  // 草稿编辑/新增页面
  draft: {

    //加载更多组件
    loadMore:{
      url:"/portal/homeworkAction!myHomework.action",     //请求路径
      pageIndexName:"page",
      data:{ //ajax入参数据
        page:1,
        pageSize:10,
        keyWord:'',
        status:0,
        type:1
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
        title:"i18n.noRecord",//若text无内容则title为16px #bbb
        text:"",
      }
    },

    //搜索框
    searchBar:{
      show:false,//搜索框，默认显示
    },

    // 点状弹窗列表操作
    dialogListConfig: {
      show: false,
      title: '',
      btnConfig: []
    },
    // 删除草稿
    deleteFun:{
      url:"/portal/homeworkAction!ajaxBatchDelete.action",
      data:{}
    },
    // 草稿详情
    draftDetail: {
      url: "/portal/homeworkAction!getHomeworkHistoryInfo.action?homeworkId=", // +homeworkId+"&status="+status
      buttonConfig:{ //操作按钮
        primaryList:[{type:"primary",name:'i18n.submit',callBack:null}],
        defaultList:[{type:"default",name:'i18n.saveAsDraft', callBack:null}],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
      commitDraft: { // 更新 方法
        draftFormData: { // 更新 数据格式
          'tbQyHomeworkPO.homeworkId': '',
          'tbQyHomeworkPO.creator': '',
          'oldHomeworkStatus': '',
          'tbQyHomeworkPO.homeworkType': '',
          'tbQyHomeworkPO.title': '',
          'tbQyHomeworkPO.content': '',
          'tbQyHomeworkPO.homeworkStart': '',
          'tbQyHomeworkPO.homeworkStop': '',
          'tbQyHomeworkPO.priority': 0,
          'tbQyHomeworkPO.sendStartRemindMsg': 0,
          'tbQyHomeworkPO.startRemindMsg': 1, // 从该行往下5行为对应的高级设置
          'tbQyHomeworkPO.endRemindMsg': 1,
          'tbQyHomeworkPO.isUseRate': 1,
          'tbQyHomeworkPO.closeSwitch': 1,
          'tbQyHomeworkPO.isChargeEach': 1,
          'tbQyHomeworkPO.homeworkStatus': '',
          'typeId': 1,
          'toUserIds': '',
          'ccUserIds': '',
          'userId': '', // 以下三行为新增数据要用到
          'mediaIds': '',
          'imageUrls': ''
        }
      }
    },
    add: {
      getLastSetting:{ // 新增 获取后台的设置(高级设置)
        url: "/portal/homeworkAction!getLastSetting.action"
      },
      addHomework: { // 新增 接口
        url: '/portal/homeworkAction!ajaxAdd.action'
      },
      draftUpdate: { // 更新
        url: "/portal/homeworkAction!ajaxUpdate.action",
        data: {}
      },
      homeworkTemplate: {
        show: true,
        data: [],
        url: '/portal/homeworkAction!getHomeworkTemplate.action',
      },
      //图片数据
      imgUpload: {
        picList: [],
      },
      //文件数据
      fileUpload: {
        mediaList: [],
        url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
      },
      //高级设置
      advancedSetting: {
        switchControl: [ // 内容
          {content: 'i18n.remindStart', onOff: true},
          {content: 'i18n.remindEnd', onOff: true},
          {content: 'i18n.feedback', onOff: true},
          {content: 'i18n.allowPower', onOff: true},
          {content: 'i18n.imgVisible', onOff: true}
        ],
        levelData: {
          show:true,
          data:[ // 优先级
          {id: 0, level: 'i18n.general'},
          {id: 1, level: 'i18n.ibnu'},
          {id: 2, level: 'i18n.nibu'},
          {id: 3, level: 'i18n.iau'}
         ]
        },
        option:[]
      },
    }
  },

};
export default dataBase;
