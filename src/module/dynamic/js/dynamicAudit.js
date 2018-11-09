var dynamicAudit = {
  nav:{
    index:0,
    nav:[
      {
        content: '待审核',
        num: '(0)'
      },
      {
        content: '已通过',
        num: '(1)'
      },
      {
        content: '未通过',
        num: '(2)'
      }
    ],
  },
  //底部操作按钮
  buttonConfig:{
    show:false,
    primaryList:[{type:"primary",name:'通过', value:0, callBack:null}],
    defaultList:[{type:"default",name:'返回', callBack:null},{type:"default",name:'不通过', value:2, callBack:null}],
    class:"active"//按钮是否置底部 active :底部、"":相对定位
  },
};
export default dynamicAudit;
