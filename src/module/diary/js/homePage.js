var homePage={
  	//首页
  home:{
    //头部，包括搜索框
  		headData:{
        show:true,
  			nav:[
  				{class:"ic_add", text:"新建日志", url:"add"},
  				{class:"ic_draft", text:"草稿", url:"draft", num:""}
  				],
        searchBar:{
          show:true,//搜索框，默认显示
          keyWord:'',
          moreFunction:{
            show:true,
            option:[
              {name:'标题', callback:null, placeholder:'搜索标题'},
              {name:'填写时间', callback:null, placeholder:'搜索填写时间', value:2}
            ]
          }
        },
        searchOption:[
          {name:'标题', callback:null, placeholder:'搜索标题'},
          {name:'填写时间', callback:null, placeholder:'搜索填写时间', value:2}
        ],
        searchOptionMore:[
          {name:'全部', callback:null, placeholder:'搜索'},
          {name:'日志标题', callback:null, placeholder:'搜索标题'},
          {name:'填写时间', callback:null, placeholder:'搜索填写时间',value:2},
          {name:'创建人', callback:null, placeholder:'搜索创建人',value:1},
          {name:'部门', callback:null, placeholder:'搜索部门',value:3},
        ]
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

    // 相关页面菜单切换
      selectData: {
        index:0,
        nav:[
          {
            content: '我负责的',
            data:{ //点击切换传递的数据
              status:3,
              typeId:'',
              type:2,
              keyWord:'',
              page:1,
              historyYear:'',
              pageSize:20
            },
          },
          {
            content: '我相关的',
            data:{ //点击切换传递的数据
              status:4,
              typeId:'',
              type:2,
              keyWord:'',
              page:1,
              historyYear:'',
              pageSize:20
            },
          }
        ]
      },

    //主体列表
      homeContentList:{
        dialogListConfig: { // 点状弹窗列表操作
          show: false,
          title: '',//头部标题
          btnConfig: []
        },
        delete:{ // 删除列表
          url:"/portal/diaryAction!ajaxBatchDelete.action",
          checkUrl: "/portal/diaryAction!ajaxBatchCheck.action",
          data:{}
        },
        indexCount:{ // 首页草稿、待阅的数量
          url: "/portal/diaryAction!ajaxDiaryNum.action",
          data:{}
        }
      },

  },

};
export default homePage;
