import axios from 'axios'

//  参数：groupId：组织Id,mediaId:附件id,agent
export function deleteFile(mediaId,agent,groupId) {
	axios.post(_.baseURL + '/portal/imageupload/imageUploadAction!doDelFile.action', {
		groupId:groupId,
		mediaId:mediaId,
		agent:agent
	}).then(function (result) {
		if (result.code=="0"){

		} else{
			_.alert("提示",result.desc);
		}
	})
}
//  上传附件公用方法
export function updateFile(even,agent,callBack) {
	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf('android') > -1 || ua.indexOf('linux') > -1; //android终端或者uc浏览器
	if (!_.isWeChatApp() ||isAndroid){
		var mediaFile=even.target;
		if (mediaFile){
			var pathValue=mediaFile.value;
			var isExt=pathValue.lastIndexOf(".");
			if (isExt>=0){
				var fileExt = pathValue.substr(isExt).toLowerCase();//获得文件后缀名
				if (fileExt=="" || ".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip.".indexOf(fileExt+".")<0){
					_.alert('i18n.notice','i18n.compressFile');
					return;
				}
				if (mediaFile.files[0].size > 10*1024*1024){//10485760
					_.alert('i18n.notice','i18n.noMoreThanTenM');
					return;
				}
				if (mediaFile.files[0].size <= 0){//0
					_.alert('i18n.notice','i18n.fileEmptyDeny');
					return;
				}
				_.showLoading('i18n.fileUploading',true);
				var fileObj=mediaFile.files[0];
				var fileUpdataUrl=_.baseURL+ '/portal/imageupload/imageUploadAction!doUploadFile.action'+"?agent="+agent;
				try{
					// FormData 对象
					var form = new FormData();
					form.append("author", "hooyes");                        // 可以增加表单数据
					form.append("file", fileObj);														// 文件对象
					if(window.location.href.indexOf("/open/")!=-1){
						form.append("isOpen", true);
					}
					var xhr = new XMLHttpRequest();
					try{
						xhr.open("post", fileUpdataUrl, true);
					}catch(e){
						_.hideLoading();
						_.alert('i18n.notice','i18n.updateDeny');
						return;
					}
					xhr.onload = function () {
						var result = eval("(" +xhr.responseText + ")");
						_.hideLoading();
						if ('0'==result.code){
							callBack(result.data)
						}else{
							_.alert('i18n.notice',result.desc);
						}
					};
					xhr.send(form);
				} catch (e) {
					_.hideLoading();
					_.alert('i18n.notice','i18n.unableToUpload');
				}
			}else{
				_.alert('i18n.notice','i18n.noFormattingSuffix');
			}
		}else{
			_.alert('i18n.notice','i18n.fileEmptyDeny');
		}
	}else{
		_.alert('i18n.notice','i18n.updateDeny');
	}
}
export function setFiles(list) {
    var files = [];
    if(list){
		list.forEach(function (item,index) {
			var data = item.split(':');
			var obj = {};
			obj.id  = data[0];
			obj.url = data[1];
			obj.fileExt = data[3];
			obj.fileName = data[2];
			obj.fileSizeStr = data[4];
			files.push(obj);
		})
	}
    return files;
}

