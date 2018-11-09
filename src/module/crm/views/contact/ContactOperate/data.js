var clientOperateData = {

   // 客户新增、编辑页面
   client: {
    clientDetail: {
      buttonConfig:{ //操作按钮
        primaryList:[{type:"primary",name:'保存',callBack:null}],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
      // 图片数据
      imgUpload: {
        picList: [],
      },
      //文件数据
      fileUpload: {
        mediaList: [],
        url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
      },
      nav: [
        // 有字数限制的输入框 type: 7
        {
          id: 1, 
          type: 'input', 
          optionName: '联系人姓名', 
          placeholder: '请输入', 
          isMust: 1, 
          maxLength: '100', 
          value:'', 
          status: true, 
          key:'tbCrmContactsInfoPO.contactsName', 
          editName: 'contactsName',
          // showNumTip: true,
          isSlot: true
        },

        // 箭头跳转 type: 5
        {
          id: 2, 
          type: 'input', 
          optionName: '所属客户', 
          placeholder: '请选择', 
          isMust: 1, 
          maxLength: '', 
          value:'', 
          status: true, 
          key:'tbCrmContactsInfoPO.clientName', 
          editName: 'clientName',
          showMask: true,
          showArrow: true,
        },
      ],
      centerNav: [
        {
          type: 'input', 
          optionName: '职位', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '20', 
          value:'', 
          name: 'position',
          status: true, 
          editName: 'position',
          key:'tbCrmContactsInfoPO.position', 
        },
        {
          type: 'input', 
          optionName: '手机', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '20', 
          value:'', 
          name: 'tel',
          status: true, 
          key:'tbCrmContactsInfoPO.mobile', 
          errorMsg: '联系电话已存在',
          editName: 'mobile'
        },
        {
          type: 'input', 
          optionName: '邮箱', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '50', 
          value:'', 
          name: 'mail', 
          status: true , 
          key: 'tbCrmContactsInfoPO.email', 
          editName: 'email'
        },
      ],
      communicationNav: [
        // 没有字数限制的输入框 type: 1
        {
          type: 'dateTime', 
          optionName: '生日', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '20', 
          value:'', 
          name: 'tel',
          editName: 'birthday',
          status: true, 
          key:'tbCrmContactsInfoPO.birthday',
          format:'YYYY-MM-DD' 
        },

        // 没有字数限制的输入框 type: 1
        {
          type: 'input', 
          optionName: '毕业院校', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '50', 
          value:'', 
          name: 'mail', 
          status: true , 
          key: 'tbCrmContactsInfoPO.schoolName', 
          editName: 'schoolName'
        },

        // 没有字数限制的输入框 type: 1
        {
          type: 'input', 
          optionName: '兴趣爱好', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '200', 
          value:'', 
          status: true, 
          key: 'tbCrmContactsInfoPO.hobby', 
          editName: 'hobby'
        },

        // textarea多行显示,有字数限制 type:4
        {
          type: 'textarea', 
          optionName: '备注', 
          isMust: 0, 
          maxLength: '2000', 
          placeholder: '请输入', 
          value:'', 
          status: true, 
          key: 'tbCrmContactsInfoPO.remark', 
          editName: 'remark'
        },        
      ],

    },
   }
  };
  export default clientOperateData;
  