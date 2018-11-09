var dataBase={

	/*必配-start*/
	mask: false,//遮罩层控制
  isShow: false,
  config: '',//公共配置信息
  wxqyh_uploadfile: { //当前应用名称
    agent: "goal",
  },
  /*必配-end*/
  loading: { //加载、提交成功、删除成功
    show: false,
    text: "",
    icon: "",
  },

  dialogConfig: {    //弹窗对话框
    show: false,
    title: "",//标题
    type: "",
    content: [],
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig: {
      primaryBtn: {name:"", callBack:null}, //主操作按钮
      defaultBtn: {name:"", callBack:null}, //次操作按钮
    }
  },

};
export default dataBase;
