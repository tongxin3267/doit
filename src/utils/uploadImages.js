import axios from 'axios';
import wx from 'weixin-js-sdk';
import checkApi from '../../src/assets/js/check_api';

let imgFilter=[];
let submitting = false
const imageUploadPathPC=window.location.href.indexOf("/open/")!=-1? '/portal/imageupload/imageUploadAction!doOpenUploadImageBase64.action': "/portal/imageupload/imageUploadAction!doUploadImageBase64.action"; //pc端上传图片接口

export function uploadImages(event){
  event.stopPropagation();
  event.preventDefault();
  // 获取文件列表对象
  let files = event.target.files || event.dataTransfer.files;
  //继续添加文件
  imgFilter = imgFilter.concat(filter(files));

  //选中文件的处理与回调,增加唯一索引值
  for (let i = 0, file; file = imgFilter[i]; i++) {
    file.index = i;
  }
  dealImages(imgFilter);
}

function filter(files){          //选择文件组的过滤方法
  let imgArr = [];
  for (let i = 0, file; file = files[i]; i++) {
    if (file.type=="" || (file.type.indexOf("jpg")==-1  && file.type.indexOf("png")==-1 && file.type.indexOf("jpeg")==-1)) {
      _.alert('图片格式错误提示','图片仅支持JPG/PNG/JPEG格式');
    } else {
      imgArr.push(file);
    }
  }
  return imgArr;
}

function dealImages(files) {
  console.log(files)
  let i=0;
  let loadImages=function () {
    let file = files[i];
    if(file){
      let reader = new FileReader();
      reader.onload = function(event) {
        let base64=event.target.result;
        console.log(base64);
        i++;
        loadImages();
      };
      reader.readAsDataURL(file);
    }
  };
  loadImages();
}


export function wx_chooseImage(agent,callBack,count,type){		//微信端图片上传公用方法
  if(!type){
    type=['album', 'camera'];
  }
  if(!count){
    count=9;
  }
  let localId= [];
  let serverId= [];
  wx.chooseImage({
    count: count, //限制上传一张图片
    sizeType: ['original', 'compressed'],                     // 可以指定是原图还是压缩图，默认二者都有
    sourceType: type, 										// 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      //选择图片成功后
      localId = res.localIds;
      if (localId.length == 0) {
        _.alert("",'请选择图片');
        return;
      }
      _.showLoading("正在准备上传"+localId.length+"张图片",true);
      let i = 0, length = localId.length;
      function uploadFormult(){
        wx.uploadImage({
          localId: localId[i],
          isShowProgressTips:0,
          success: function (res) {
            _.showLoading("正在上传第"+(i+1)+"张图片",true);
            i++;
            serverId.push(res.serverId);
            if (i < length) {
              setTimeout(uploadFormult,500);
            }
            if(serverId.length==localId.length){
              newimageupload(serverId,agent,callBack);
            }
          },
          fail: function (res) {
            _.hideLoading();
            _.alert("","图片上传失败"+res.errMsg+"，"+"请重新上传");
          }
        });
      }
      setTimeout(uploadFormult,500);
    },
    error : function(){
      _.alert("","图片上传失败");
    }
  });
}

function newimageupload(serverId,agent,callBack){
    let serverIds="";
    for(let i=0;i<serverId.length;i++){
      serverIds+=serverId[i]+",";
    }
    axios.post(_.baseURL+"/portal/newimageupload/newimageUploadAction!newimageUpload.action",{
      serverIds: serverIds,
      isOpen: false,
      isUsePublic: checkApi.wxqyh_isUsePublic,
      drawString: "",
      agent:agent
    }).then(function (result) {
      _.hideLoading();
      if(result.code==='0'){
        let urlList=result.data.urlList;
        if(urlList.length>0){
          callBack(urlList);
        }
      }else {
        _.alert('提示',result.desc)
      }
    })
}


export function qw_uploadImages(event,agent,callBack,orderId){	           //PC端图片上传公用方法
  const obj=event.target;
  const imagePath = obj.value;
  if(submitting){return}

  if(imagePath.lastIndexOf('.')>-1){
    const type = imagePath.substring(imagePath.lastIndexOf('.') + 1, imagePath.length).toLowerCase();
    if (type != undefined && type != "" && type != 'jpg' && type != 'png' && type != 'jpeg') {
      _.alert('图片格式错误提示','图片仅支持JPG/PNG/JPEG格式');
      return false;
    }
  }
  if (obj.files && obj.files[0]) {
    const file = obj.files[0];
    const URL = window.URL || window.webkitURL;
	submitting = true
	_.showLoading("准备上传",true);
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      let that = this;
      let quality=1;
      let maxWidth=2560;
      let w = that.width, h = that.height, scale = w / maxWidth; 		 //生成比例
      if(w> maxWidth){ 													//如果图片大于最大宽度
        quality = 0.8;											   	   //压缩图片质量0-1，值越大质量越好
        w = maxWidth;
        h = h / scale;
      }
      //生成canvas
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(that, 0, 0, w, h);
      let base64 = canvas.toDataURL('image/jpeg', quality );
      images_upload(base64,agent,callBack,orderId);
    };
  }
};

export function images_upload(url,agent,callBack,orderId){                                //上传图片接口
	axios.post(_.baseURL + imageUploadPathPC, {
		imgFileBase: url,
		agent:agent,
		orderId:orderId
	}).then(function (result) {
		_.hideLoading()
		submitting = false
		if (result.code=="0"){
			callBack(result.data)
		} else{
			_.alert("提示",result.desc)
		}
	})
}

export function previewImages(currentUrl,urls){                             //PC预览图片\微信JDK预览图片方法
	if(_.isWeChatApp()){
		wx.previewImage({
			current: _.filterCompressURL(currentUrl),                            // 当前显示的图片链接
			urls: urls                                                          // 需要预览的图片链接列表
		});
	}
}
