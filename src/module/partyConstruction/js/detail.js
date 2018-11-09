var draft = {
  //详情页数据
  detailData:{
    diaryDetail:{
      url:"/portal/diaryAction!getDiaryDetail.action",
      data:{ //ajax入参数据
        diaryId:'',
        userId:'',
        status:'0',
        size:"10",
      },
      detail:{ //详情内容
        openPrint:true,
        creator:{
          id:"",
          callBack:null
        },
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
      listComment:{ //评论
        get:{  //获取
          url:"/portal/diaryAction!listComment.action",
          pageIndexName:"page",//当前分页参数名称
          hasMore:false,
          data:{
            id:"",
            size:10,
            commentStatus:"1",//1显示全部，2只看评论
            page:1,
          },
        },
        getMore:{ //获取更多评论
          url:"/portal/dynamicinfo/dynamicinfoAction!listMoreComment.action",
          type: 'partyConstruction',
          hasMore:false,
          data:{},
        },
        send:{ //发送
          url:"/portal/dynamicinfo/dynamicinfoAction!addDynamicInfoComment.action",
          contentObject: 'comment.content',//传送的内容字符串
          data: {}
        },
        delete:{ //删除
          url:"/portal/dynamicinfo/dynamicinfoAction!deleteComment.action",
          commentId:"commentId",//需要传的id字段
          data:{}
        },
        comments:[], //评论数据列表
        totalPages:""
      },
    }, //end
  },

  //上一篇，下一篇
  nextUrl:"/portal/diaryAction!getNextDiary.action",
  //评分
  scoreUrl:"/portal/diaryAction!updateScore.action"
};
export default draft;
