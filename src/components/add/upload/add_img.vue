<template>
    <div class="qwui-add_image_box" v-if="disabled">
		<div class="image_addIcon">
			<input v-if="isMobile" @click.prevent="handleClick($event)" ref="input" accept="image/jpeg,image/jpg,image/png,image/gif" type="file" class="imageFileInput"/>
			<input v-else @change='handleChange' class="imageFileInput" ref="input" type=file accept="image/jpeg,image/jpg,image/png,image/gif"/>
		</div>
    </div>
</template>
<script>
	import {wx_chooseImage,qw_uploadImages} from '@/utils/uploadImages';
	import EventBus from '@/utils/eventBus';
	export default {
	  name: 'QWUpdateImage',
	  props: {
		listType: {            //picture-card 行内块级 || picture 独占一行
			type: String,
			default: 'picture'
		},
		camera: {											//手机端使用拍照上传['camera'],默认：['album', 'camera']
			type: Array,
			default (){
				return ['album', 'camera']
			}
		},
		limit: Number,                                       //限制上传最大张数
		imageList: {									    //图片列表
		  type: Array,
		  default (){
			  return [];
		  }
		},
			agent: {
				type: String,
				required: true
			},
			orderId: {
				type: String,
				default: ''
			}
	  },
	  data(){
		return {
		  fileList: this.imageList,
		  isMobile: false,	                           	 //是移动端
		}
	  },
	  computed:{
	  	disabled(){
	  		if(this.listType === 'picture-card'){
	  			return this.limit && this.fileList.length>=this.limit ? false : true
			}else{
				return true
			}
		}
	  },
	  mounted (){
		  this.isMobile = _.isWeChatApp();
		  EventBus.$on("handleDeleteImage",this.handleDeleteImage);
	  },
	  methods:{
		  handleClick(event){									     	    //手机端图片上传
			  wx_chooseImage(this.agent,this.wxUpdateImage,this.limit,this.camera)
		  },
		  handleChange(event){										    	//pc端图片上传
			  const files = event.target.files;
			  if (!files) return;
			  if (this.limit && this.fileList.length + files.length > this.limit) {
				  return;
			  }
			  qw_uploadImages(event,this.agent,this.pcUpdateImage,this.orderId)
		  },
		  wxUpdateImage (urls){
		  	urls.forEach((item)=>{
				this.fileList.push({src:item});
			})
			  this.updateImageList()
		  },
		  pcUpdateImage (urls){
		  	if (urls.imgurl){
				this.fileList.push({src:urls.imgurl});
			}
			this.updateImageList()
		  },
		  handleDeleteImage (index){
			  if(index === this.fileList.length-1 && this.$refs.input){
				  this.$refs.input.value = ''
			  }
			  this.fileList.splice(index, 1);
			  this.updateImageList()
		  },
		  updateImageList (){
			this.$emit('updateImageList',this.fileList)
		  }
	  }
	}
</script>
<style scoped>
  .qwui-add_image_box {
	  display: inline-block;
	  position: relative;
	  background-color:#fff;
  }
  .imageFileInput {
	  width: 100%;
	  height: 100%;
	  opacity: 0;
  }
  .image_addIcon{
	  display: inline-block;
	  width: 48px;
	  height: 48px;
	  background: url("../../../assets/images/qwui-icon_addImage.png");
	  background-size: 100% 100%;
	  vertical-align: middle;
  }

</style>
