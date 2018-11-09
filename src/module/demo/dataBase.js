var dataBase={
  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:true,
  loading:{
    show: false,
    text: "",
    icon: "",
  },//加载、提交成功、删除成功
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"diary",
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
        },
        "isOptional":true,
        "loadLast":{
          "show":true,
          "name":"加载上次"
        }
      },
      "ccPersonList": {
        "title":"道一",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "isOptional":true,
        "callBack": {
          "confirm": null
        },
        "loadLast":{
          "show":true,
          "name":"加载上次"
        }
      },
      "users": {
        "title":"",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "callBack": {
          "confirm": null
        }
      },
      "depts": {
        "title":"",
        "selectType": "dept",
        "userSelected": [],
        "deptSelected": [],
        "isonly":false,
        "callBack": {
          "confirm": null
        }
      }
    }
  },
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:{//中间自定义内容
      rateType:{ //进度
        rateList:[
          {
            text:"",
            time:"",
            rateValue:""
          }
        ],
      },
      updateRateType:{
        rateValue:"",
        limit:10
      },
      radioType:{ //单选框
        title:"结束类型",
        list:[
          {
            text:"作业完成",
            value:"0",
          },
          {
            text:"作业终止",
            value:"1",
          },
          {
            text:"作业取消",
            value:"2",
          },
        ],
      },
      scoreType:{//评分
        title:"",//小标题
        length:10,//星级10个
      },
      dateTime:{
        title:"",//头部标题
        timeValue:""//值
      },
      comment:{//评语
        maxLength:'',//限制字数长度
        placeholder:"",//描述提示
        value:"",//评语值
      },
    },
    tips:"",//提示语内容
    errorTip:{//弹窗操作失误提示
      canCloseDialog:"",//是否由弹窗组件关闭窗口，true:可自行关闭
      text:""//错误提示内容
    },
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"", callBack:null}, //次操作按钮
    }
  },
  /*必配-end*/
  home_head:{
    show:true,
    nav:[
      {
        class:"ic_add",
        text:"新建作业",
        url:""
      },
      {
        class:"ic_draft",
        text:"草稿",
        url:"draft",
        num:""
      }
    ],
    searchBar:{
      show:true,
    },
  },
  home_footer:{
    nav_on:0,
    nav:[
      {
        class:"ic_tabar1",
        text:"我发起的",
        data:{
          page:1,
          pageSize:10,
          keyWord:'',
          status:1,
          type:1
        },
        url:"",
        callBack:null
      },
      {
        class:"ic_tabar2",
        text:"待我处理",
        data:{
          page:1,
          pageSize:10,
          keyWord:'',
          status:0,
          type:2
        },
        url:"",
        num:"3",
        callBack:null
      },
      {
        class:"ic_tabar3",
        text:"我相关的",
        data:{
          page:1,
          pageSize:10,
          keyWord:'',
          status:3,
          type:2
        },
        url:"",
        callBack:null
      }
    ]
  },
  selectData: {
    index:0,
    scroll:true,//是否开启滚动置顶功能
    bottomLength: '90px',//底部横线的宽度
    nav:[
      {
        content: '未阅',
        data:{ //点击切换传递的数据
          page:1,
          pageSize:10,
          keyWord:'',
          status:3,
          type:2
        },
      },
      {
        content: '逾期',
        data:{ //点击切换传递的数据
          page:1,
          pageSize:10,
          keyWord:'',
          status:5,
          type:2
        },
      },
      {
        content: '已关闭',
        data:{ //点击切换传递的数据
          page:1,
          pageSize:10,
          keyWord:'',
          status:2,
          type:2
        },
      }
    ]
  },
  menuData:{ //tab菜单切换
    show:false,
    navNum:0,
    navBar:[
      {name:"全部",num:"2",data:{type:"0"},callBack:null},
      {name:"已完成",num:"3",data:{type:"1"},callBack:null},
      {name:"未完成",num:"4",data:{type:"2"},callBack:null},
    ],
  },
  buttonConfig:{ //操作按钮
    primaryList:[
      {type:"primary",name:'立即提交',callBack:null}
    ],
    defaultList:[
      {type:"default",name:'保存', callBack:null},
      {type:"default",name:'草稿', callBack:null}
    ],
    style:{class:""}//按钮是否置底部 active :底部、"":相对定位
  },
  listComment:{ //评论
    get:{  //获取
      url:"",
      pageIndex:1,//当前页面
      data:{
        id:"",
        size:10,
        commentStatus:"1",//1只看评论，2显示全部
        page:1,
      },
    },
    send:{ //发送
      url:"",
      contentObject:'tbQyHomeworkCommentPO.content',//传送的内容字符串
      data:{}
    },
    delete:{ //删除
      url:"",
      commentId:"commentId",//需要传的id字段
      data:{
      }
    },
    comments:[//评论数据列表
      {commentId:"cac355f0-8457-4892-b94d-5248a47acc36",
        commentStatus:"2",
        content:"已阅",
        creator:"7bcac4fb11874f1187dd68af28820098",
        creatorTime:'',
        headPic:"http://shp.qpic.cn/bizmp/ck4hSGq23Ria1f6HbTeHsZIjrDTSuYJcRGOUF7bVPCziaOb4ialoNqyqA/100",
        homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
        personName:"林粤",
        tableNames:'',
        time:"47分钟前",
        type:"",
        userId:""}
     ]
  },
  advancedSetting: {
    switchControl: [ // 内容
      {content: '开始前30分钟提醒', onOff: true},
      {content: '截止前30分钟提醒', onOff: true},
      {content: '启用进度反馈', onOff: true},
      {content: '允许负责人结束作业', onOff: true},
      {content: '负责人信息相互可见', onOff: true}
    ],
    levelData: {
      show:true,
      data:[ // 优先级
        {id: 0, level: '普通'},
        {id: 1, level: '!不紧急但重要'},
        {id: 2, level: '!!紧急但不重要'},
        {id: 3, level: '!!!紧急且重要'}
      ]
    },
    option:[]
  },
  statusFormat:[{name:"进行中", class:"status_blue", active:false},
    {name:"已关闭", class:"status_gray", active:false},
    {name:"已完成", class:"status_green", active:false},
    {name:"有问题", class:"status_red", active:true},
    {name:"等待中", class:"status_orange", active:true}],
  dialogBottomConfig: { // 底部弹框操作
    show: false,
    title: 'tryThis',
    btnConfig: [
      {title: "结束作业", callBack:null},
      {title: "编辑并重新提交", callBack:null},
      {title: "删除", callBack:null, primary:true},
      {title: "取消", callBack:null}
    ]
  },
  dialogTwoBtn:[
    {title:"进度列表", value:1},
    {title:"拖动进度", value:2},
    {title:"单选", value:3},
    {title:"评分", value:4},
    {title:"时间", value:5},
    {title:"评语", value:6},
    {title:"选人", value:7}
  ],
  searchBar:{ //头部搜索框
    show:true,
    keyWord:"",
    setTopMask:false,//置顶遮罩
    inputFocus:false,//input聚焦状态
    closeLabel:true,
    rightSpan:{
      show:true,
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
  footerButton: {
    text: "录入快递",
    callBack: null
  },
  add:{
    add_nav:{ //数据详情头部信息
      nav: '作业类型', //头部标题
      titlePlaceholder: '请输入作业标题',
      contentPlaceholder: '请输入作业内容',
      homeworkTemplate: {
        show: true,
        data: [],
        url: '/portal/homeworkAction!getHomeworkTemplate.action',
      },
      detailData: [], // 编辑/复制等存在的原数据,0:option，1:标题，2:内容
    },
    //图片数据
    imgUpload: {
      picList: [],
      clearCache: false,
      url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action'
    },
    //文件数据
    fileUpload: {
      mediaList: [],
      url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
    },
  },
  detail:{ //详情内容
    openPrint:true,
    creator:"",
    personName:"道一",
    createTime:"2018-02-23 16:21:48",
    describes:[{content:'语文', text:'类型'},{content:'2018-03-02 09:00',text:'开始时间'},{content:'2018-03-04 09:00',text:'截止时间'}],
    content:"这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
    configCopy:{},//复制页面信息到新建页面
    picList:[],//上传的图片列表
    mediaList:[],//上传的附件列表
    userListConfig:{ //负责人、相关人
      toPersonList:{
        show:false,
        title: "相关人(可查看、评论)",
        num:5,
        userSelected: [{
          createPerson:"723d4c750991a3070694ff42fb515a05",
          createTime:'',
          departmentId:"",
          departmentName:"没有负责人的部门",
          headPic:"0",
          homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
          isRead:"0",
          mobile:"13612381828",
          orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
          personName:"101010",
          recId:"342b7cd5f8453df23674a2fe6a91d842",
          recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
          recipientType:"1",
          userId:"342b7cd5f8453df23674a2fe6a91d842",
          userStatus:"0",
          wxUserId:"101010",
        },
          {
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          },
          {
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          },{
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          },{
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          }],
        callBack: null
      },
      ccPersonList:{
        show:false,
        title: "负责人(家长)",
        num:"5",
        userSelected: [{
          createPerson:"723d4c750991a3070694ff42fb515a05",
          createTime:'',
          departmentId:"",
          departmentName:"没有负责人的部门",
          headPic:"0",
          homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
          isRead:"0",
          mobile:"13612381828",
          orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
          personName:"101010",
          recId:"342b7cd5f8453df23674a2fe6a91d842",
          recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
          recipientType:"1",
          userId:"342b7cd5f8453df23674a2fe6a91d842",
          userStatus:"0",
          wxUserId:"101010",
        },
          {
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          },
          {
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          },{
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          },{
            createPerson:"723d4c750991a3070694ff42fb515a05",
            createTime:'',
            departmentId:"",
            departmentName:"没有负责人的部门",
            headPic:"0",
            homeworkId:"0689412f-f9ac-411f-b5ef-8a2f0cade06c",
            isRead:"0",
            mobile:"13612381828",
            orgId:"b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            personName:"101010",
            recId:"342b7cd5f8453df23674a2fe6a91d842",
            recipientId:"71906fa0-ff50-4e58-bfcd-d075ce6d2754",
            recipientType:"1",
            userId:"342b7cd5f8453df23674a2fe6a91d842",
            userStatus:"0",
            wxUserId:"101010",
          }],
        callBack: null
      }
    },
    isUseRate:"1",
    priority:"1",
    status:{active:'true',class:'status_gray', name:'已过期'},
    title:'员村一横路'
  },
  loadMore:{//加载更多组件
    url:"/portal/expressAction!ajaxSearch.action",     //请求路径
    pageIndexName:"page",//不同应用不同分页参数
    data:{ //ajax入参数据
      keyWord:'',
      page:1,
      status:0,
      toptypes:''
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
};
export default dataBase;
