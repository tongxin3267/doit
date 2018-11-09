/**
 * Created by 3 on 2017/10/25.
 */
var baseURL = window.document.location.pathname;
baseURL = baseURL.substring(0,baseURL.substr(1).indexOf('/')+1)//获取带"/"的项目名，如：/uimcardprj
if(baseURL=="/vp"){
  baseURL = "/wxqyh"
}
export default baseURL
