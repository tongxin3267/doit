<template>
  <div class="qwui-title_file_add">
    <!-- 上传媒体文件（手机端页面）引入  start -->
    <div class="upload_file_drag" v-if="dragDrop && !isWeChatApp">
	  文件拖到此处上传或者点击选择上传
	  <input type="file" ref="inputFile" accept="application/msexcel"
			 @change="mediaFileUpdate" class="upload_file_drag_input">
	</div>
	<div v-else class="qwui-user_select_addpic" @click="mediaFileUpdateClick">
	  <input v-if="!limitIOS" type="file" ref="inputFile" @change="mediaFileUpdate" class="upload_file_input">
    </div>
	<!-- 上传媒体文件（手机端页面）引入  end -->
  </div>
</template>
<script>
import {deleteFile,updateFile} from '@/utils/updateFiles';
import EventBus from '@/utils/eventBus';
export default {
  name:'QWFileUpdate',
  props: {
	dragDrop: {
	  type: Boolean,
	  default:false
	},
	filesList: Array,
	agent: {
	  type:String,
	  required:true
	}
  },
  data(){
    return {
      newFilesList: this.filesList,
	  limitIOS:false,
	  isWeChatApp:_.isWeChatApp(),
    }
  },
  mounted: function () {
    EventBus.$on("deleteFileList",this.deleteFileList);
    this.limitIOS=_.isIOS() && this.isWeChatApp;
  },
  methods:{
    mediaFileUpdateClick(){
      if(this.limitIOS){
        _.alert('i18n.notice','i18n.updateDeny');
        return;
      }
    },
	mediaFileUpdate: function(even){
	  updateFile(even,this.agent,this.updateListFun);
	},
	updateListFun(data){
	  if(data.mediaInfo){
	    this.newFilesList.push(data.mediaInfo);
	  }
		this.updateFileList()
	},
	deleteFileList (val){
	  if(this.$refs.inputFile){
	    const fileName = this.$refs.inputFile.value;
		  if (fileName.indexOf(val.fileName)!= -1) { //如果清除了刚刚上传的文件，清除缓存则可以重新上传
		    this.$refs.inputFile.value="";
		}
	  }
	  this.updateFileList()
	},
	updateFileList (){
		this.$emit('updateFileList',this.newFilesList)
	}
  }
}
</script>
<style scoped>
  .qwui-title_file_add {
	display: inline-block;
	position: relative;
	background-color: #fff;
  }
  .upload_file_input {
	width: 100%;
	height: 100%;
	opacity: 0;
  }
  .upload_file_drag{
	position: relative;
	height: 100px;
	line-height: 100px;
	text-align: center;
	font-size: 17px;
	font-weight: 600;
	color: #ccc;
	border: 2px dashed #ccc;
	border-radius: 5px;
  }
  .upload_file_drag_input{
	position: absolute;
  top:0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
  }
  .qwui-user_select_addpic {
	display: inline-block;
	position: relative;
	width: 48px;
	height: 48px;
	background: url("../../../assets/images/ic_file_default.png") no-repeat 0 0;
	background-size: 100% 100%;
	cursor: pointer;
  }
</style>
