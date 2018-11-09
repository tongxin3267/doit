/**
 * Created by linyue on 2017/10/20.
 */
import baseURL from './baseURL_config'
import checkApi from './check_api'
var config={};
//axios兼容ie以及低版本的安卓或ios
import promise from 'es6-promise';
promise.polyfill();
import axios from 'axios';
//axios兼容参数转字符
import Qs from 'qs';
import {initWxqyhConfig} from './init-vip'
// 请求前的参数处理
axios.defaults.transformRequest=[function (data) {
  data = Qs.stringify(data);
  return data;
}];
// 响应拦截
axios.interceptors.response.use(function (response) {
  // 处理响应数据
  try{
    if(typeof JSON.parse(response.request.response) !='object'){
      //登录超时,页面已过期
      window.location.href ='../module/error.html#/?msg=500TypeError';
    }
    return response.data;
  }catch(e){ //捕捉异常500
    //服务器崩溃
    window.location.href ='../module/error.html#/?msg=500CatchError';
  }
},function(response){
  if(response.request.status==0){ //接口状态为0
    //请求超时
    window.location.href ='../module/error.html#/?msg=500StatusZero';
  }else{
    var _qwy_ = new qwy()
    _qwy_.alert("提示","网络错误");
  }
});
//axios兼容参数转formData
axios.defaults.headers={'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'};

//获取URL参数
function getRequest(arr) {
  var url = decodeURIComponent(window.location.search); //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      var pd = true;
      for(var j = 0;j<arr.length;j++){
        if(strs[i].split("=")[0]==arr[j]){
          pd = false;
          break
        }
      }
      if(pd){
        theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
      }

    }
  }
  return theRequest;
}

var systemApp={
  /**
   * 是否ios终端
   */
  isIOS:function () {
    var u = navigator.userAgent.toLowerCase();
    return /iphone|ipod|ipad/i.test(u);
  },
  /**
   * 是否android终端
   */
  isAndroid(){
    var u = navigator.userAgent.toLowerCase();
    return u.indexOf('android') > -1;
  },
  /**
   * 判断是否企业微信客户端或者PC端打开
   * @returns {Boolean}
   */
  isQiyeweixin:function(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf("wxwork")>0){
      return true;
    }
    return false;
  },
  /**
   * 判断是否企业微信客户端,包括Android和ios
   * @returns {Boolean}
   */
  isQiyeweixinApp:function(){
    if (this.isQiyeweixin()) {

      if(this.isIOS() || this.isAndroid()){
        return true;
      }
    }
    return false;
  },
  /**
   * 是否飞信终端
   */
  isHefeixin:function(){
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("hefeixin") > -1? true:false;
  },
  /**
   * 是否微信PC终端
   */
  isWeChat:function(){
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i)=="micromessenger"? true:false;
  },
  /**
   * 是否微信APP终端
   */
  isWeChatApp:function () { //判断是否微信打开,true:是
    var ua = navigator.userAgent.toLowerCase();
    if((ua.match(/MicroMessenger/i)=="micromessenger") && ua.indexOf("windowswechat")==-1) {
      return  true;
    }else{
      return false;
    }
  },
};

/**
 * 保持session心跳
 * @param linkTime 单位：毫秒，重新请求间隔，默认300000（5分钟）
 * @param maxSessionCounts 最大请求次数，默认60次
 */
function continueSession(linkTime, maxSessionCounts){
  if(!linkTime){
    linkTime = 300000; //默认5分钟请求一次
  }
  if(!maxSessionCounts){
    maxSessionCounts = 60 ;
  }
  var continueSessionCounts = 0,myContinueSession;
  myContinueSession = setInterval(function(){
    if(continueSessionCounts>maxSessionCounts){
      clearInterval(myContinueSession);
    }else{
      axios({
        method: 'post',
        url: baseURL+"/portal/cooperationOpen/cooperationOpenAction!continueSession.action",
      })
        .then(function (response) {
          if (response.code == "0") {
            continueSessionCounts = continueSessionCounts + 1;
          }
        })
    }
  },linkTime); //每5分钟执行一次
}

//判断登录成功还是未登录
function getLoginMessage(resolve){
  var allUrlParam = getRequest([]);
  var corp_id=allUrlParam.corp_id;
  var agentCode=allUrlParam.agentCode;
  corp_id=corp_id? corp_id:"";
  agentCode=agentCode? agentCode:"";
  if(!corp_id && (systemApp.isWeChatApp()||systemApp.isQiyeweixinApp())){ //没有corp_id
    window.location.href ='../module/error.html#/?msg=500WithoutCorpId';
    return;
  }else if(window.location.href.indexOf("/open/")!=-1){//外部页面判断处理
    axios({
      method: 'post',
      url: baseURL + '/open/vipOpenCtl/wxqyhConfigNew.do?outputCommonInfo=1'
    })
      .then(function (response) {
        if (response.code == "0") {
          config = response.data;
          for(var v in config){
            qwy.prototype[v]=config[v];
          }
          var _qwy = new qwy();
          window._qwy = _qwy;
          window._ = _qwy;
          dataBase.config = config;
          checkApi.init("open");
          qwy.prototype.checkApi =checkApi;
          resolve('初始配置完成');
        } else { //基础配置访问不到
          window.location.href = '../module/error.html#/?msg=500ResponseError';
        }
      })
  }else {
    axios({
      method: 'post',
      url: baseURL + '/portal/wxqyhLoginCtrl/getUserInfo.do?corp_id=' + corp_id + '&agentCode=' + agentCode
    })
      .then(function (response) {
        if (response.code == "0") {
          if (response.data.isLogin == false) {
            window.location.href = baseURL + "/portal/wxqyhLoginCtrl/weixinLogin.do?corp_id=" + corp_id + '&agentCode=' + agentCode + '&pre=' + encodeURIComponent(window.location.hash);
          } else {
            window.location.href.indexOf("%")!=-1? history.replaceState(null,"",decodeURIComponent(window.location.href)):"";
            wxqyhConfig(response, resolve);
          }
        } else { //登录接口访问不到
          window.location.href = '../module/error.html#/?msg=500NoResponse';
        }
      })
  }
}

window.getLoginMessagePromise = function(){
  var p = new Promise(function(resolve, reject){
    getLoginMessage(resolve)
  });
  return p
}

//登陆成功
function wxqyhConfig(response,resolve) {
        initWxqyhConfig();
        continueSession();
        if(response){
          config = response.data;
          config.logo={
            copyright : ""+new Date().getFullYear()
          }
          for(var v in config){
            qwy.prototype[v]=config[v];
          }
          var _qwy = new qwy();
          window._qwy = _qwy;
          window._ = _qwy;
          dataBase.config = config;
          checkApi.init();
          qwy.prototype.checkApi =checkApi;
          axios({method: 'post',url:baseURL+'/portal/vipPortalAction!multilingualPerssion.action'})
            .then(function (response) {
              if(!response.data.is_white){
                _qwy.lang = "zh-CN"
              }
              resolve('初始配置完成');
            })
        }
}
