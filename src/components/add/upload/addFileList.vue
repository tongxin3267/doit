<template>
	<div class="qwui-title_file" :class="customClass">
		<!-- 上传媒体文件（手机端页面）引入  start -->
		<slot name="title"></slot>
		<div class="qwui-setting_item" v-for="(item, index) in filesList" :key="index">
			<div class="qwui-fujian">
				<span class="qwui-detail_mediaList_images_new" :class="item.fileExt" @click="openPreviewFile(item)"></span>
				<div class="qwui-fujian_text">
					<p class="name" @click="openPreviewFile(item)">{{item.fileName}}</p>
					<p class="qwui-fujian_size">{{item.fileSizeStr}}</p>
					<p class="iconp">
						<i class="iocnType icon_download" v-if="downLoad" @click="downloadFileClick(item,index)"></i>
						<i class="iocnType icon_delete" v-if="deleteFile" @click="doDelFile(item,index)"></i>
					</p>
				</div>
			</div>
		</div>
		<slot name="append"></slot>
	</div>
</template>
<script>
	import EventBus from '@/utils/eventBus';
	import {deleteFile} from '@/utils/updateFiles';
	export default {
		name:"QWFilesImagesList",
		props: {
			customClass:String,
			agent:String,
			downLoad:{
				type: Boolean,
				default:false
			},
			deleteFile:{
				type: Boolean,
				default:true
			},
			filesList: Array,
		},
		data() {
			return {
				newFilesList: this.filesList
			}
		},
		methods: {
			openPreviewFile(item){  //预览附件
				_.wxqyh_previewFile(item.id,item.url,item.fileName,item.fileExt);
			},
			downloadFileClick(item){ //下载附件
				_.wxqyh_downloadFile(item.id,item.url,item.fileName);
			},
			doDelFile(item,index) { //删除附件
				this.newFilesList.splice(index, 1);
				deleteFile(item.id,this.agent,'');
				EventBus.$emit("deleteFileList",item);
			}
		}
	}
</script>
<style scoped>
	.qwui-title_file{
		position: relative;
		background-color: #fff;
	}
	.qwui-fujian {
		display: flex;
		line-height: 1.3;
		margin-bottom: 15px;
	}
	.file_title{
		padding-bottom: 10px;
		font-size: 15px;
		color: #333;
	}
	.file_list_len{
		padding: 5px 15px;
		background-color: #fff;
	}
	/* 文件的图标*/
	.qwui-detail_mediaList_images_new{
		display: inline-block;
		width: 34px;
		height: 34px;
		border-radius: 4px;
		background: url(../../../assets/images/icon_file_type.png) center no-repeat;
		background-size: cover;
	}
	.qwui-detail_mediaList_images_new.XML,.qwui-detail_mediaList_images_new.FILE{
		background-position: 0 0;
	}
	.qwui-detail_mediaList_images_new.XLS,.qwui-detail_mediaList_images_new.XLSX{
		background-position: -34px 0;
	}
	.qwui-detail_mediaList_images_new.TXT{
		background-position: -68px 0;
	}
	.qwui-detail_mediaList_images_new.DOCX,.qwui-detail_mediaList_images_new.DOC{
		background-position: -102px 0;
	}
	.qwui-detail_mediaList_images_new.PPT,.qwui-detail_mediaList_images_new.PPTX{
		background-position: -136px 0;
	}
	.qwui-detail_mediaList_images_new.PDF{
		background-position: -170px 0;
	}
	.qwui-detail_mediaList_images_new.MP3,.qwui-detail_mediaList_images_new.WMA,.qwui-detail_mediaList_images_new.AMR{
		background-position: -204px 0;
	}
	.qwui-detail_mediaList_images_new.MP4{
		background-position: -238px 0;
	}
	.qwui-detail_mediaList_images_new.RAR,.qwui-detail_mediaList_images_new.ZIP{
		background-position: -272px 0;
	}
	.qwui-fujian_text{
		flex: 1;
		position: relative;
		padding-left: 6px;
		padding-right: 100px;
	}
	.qwui-fujian_size{
		color: #999;
		font-size: 12px;
	}
	.qwui-fujian .name {
		display: -webkit-box;
		font-size: 15px;
		color: #333;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		cursor: pointer;
	}
	.qwui-fujian >p{
		height: 40px;
		margin-right: 10px;
		width: 40px;
		background: url('../../../assets/images/file.png') no-repeat;
		background-size: 100%;
		-webkit-background-size: 100%;
	}
	.qwui-fujian .iconp{
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		line-height: 34px;
	}
	.iocnType{
		display: inline-block;
		margin-left: 10px;
		width: 22px;
		height: 22px;
	}
	.icon_download{
		background: url('../../../assets/images/ic_file_download.png') no-repeat;
	}
	.icon_delete{
		background: url('../../../assets/images/ic_file_delete.png') no-repeat;
	}
</style>
