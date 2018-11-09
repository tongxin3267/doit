var addUpdate = {
  // 获取详情、更新
  draftDetail: {
    url: "/portal/diaryAction!getDiaryHistoryInfo.action?diaryId=",
    buttonConfig:{ //操作按钮
      primaryList:[{type:"primary",name:'立即提交',callBack:null}],
      defaultList:[{type:"default",name:'保存为草稿', callBack:null}],
      style:{class:""}//按钮是否置底部 active :底部、"":相对定位
    },
    commitDraft: { // 更新 方法
      draftFormData: { // 更新 数据格式
        'tbQyDiaryPO.currentDay':'',
        'tbQyDiaryPO.diaryType': '',
        'tbQyDiaryPO.title': '',
        'tbQyDiaryPO.content': '',
        'toSelectId':0,
        'ccSelectId':0,
        'incharges':'',
        'relatives':'',
        'tbQyDiaryPO.diaryStatus': '',
        'mediaIds': '',
        'imageUrls': '',
        'tbQyDiaryPO.isUEditor':'',
        //以下是更新用到参数
        'tbQyDiaryPO.diaryId':'',
        'tbQyDiaryPO.creator':'',
      }
    }
  },
  add: {
    addDiary: { // 新增 接口
      url: '/portal/diaryAction!ajaxAdd.action'
    },
    draftUpdate: { // 更新
      url: "/portal/diaryAction!ajaxUpdate.action",
      data: {}
    },
    getLastPick:{ //加载上次选人 参数type：1表示相关人，0表示负责人
      url:"/portal/diaryAction!getOldGivenList.action",
    },
    diaryTemplate: {
      show: true,
      data: [],
      url: '/portal/diaryAction!getDiaryTemplate.action',
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
  },
  unCommitted:{
    getToPersonUrl:"/portal/contactAction!ajaxGetUserInfoByUserId.action",
    data:[],
    loadMore:{
      url:"/portal/diaryAction!getAllUnSubmitByPerson.action",     //请求路径
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
  }
}
export default addUpdate;
