
import defaultHeadPic from '@/assets/images/touxiang02.png';

//过滤文本内容的图片和网页链接方法
export function filterOutText(str) {
  if(str.indexOf('/upload/img/')==-1){
    return str.indexOf('http')!=-1? _.checkURL(str,true):String(str);
  }else{
    var pat=/\/upload\/img(.*).(jpg|png|jpeg)/g;
    var r=pat.exec(str);
    if(r==null){
      return str;
    }else{
      str= str.replace(r[0],'');
     return str;
    }
  }
}
//判断文本是否存在图片路径的方法
export function filterImageURL(str){
  var pat=/\/upload\/img(.*).(jpg|png|jpeg)/g;
  var r=pat.exec(str);
  if(r==null){
    return str;
  }else{
    str =_.filterCompressURL(r[0]);
    return str;
  }
}
//补全图片前缀的方法
export function checkIsImages(str){
  return str.indexOf('/upload/img/')!=-1? filterImageURL(str):"";
}
//过滤默认头像的方法
export  function defaultListHeadPic(src) {
  return src && src!='0'? src: defaultHeadPic
}

//默认图标显示方法
export function defaultListIcon(status){
  let icon = {
    '2': "qwui-meeting_icon icon_icon7",
    '3': "qwui-meeting_icon icon_icon6"
  }
  return icon[status]? icon[status] : ''
}

//默认显示删除按钮的方法
export function deleteBtnFun(item) {
  const status=item.status||item.commentStatus;
  const time=item.time;
  if(item.creator == _.userId &&
    (time=="刚刚"|| (time.indexOf("分钟前")!=-1 && parseInt(time.split("分钟前")[0])<30))){
    return  status=="9"||status==0;
  }else{
    return false;
  }
}
