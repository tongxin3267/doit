<template>
  <div class="field-content">
	<add-img-list :agent="agent"
				  :imageList="imgUpload.picList"
				  :disabled="field.disabled||field.readonly">
	</add-img-list>
    <add-img v-show="!(field.disabled ||field.readonly)" :agent="agent" :orderId="orderId" :camera="chooseImageTypes"
			 :imageList="imgUpload.picList" @updateImageList="setValue">
	</add-img>
  </div>
</template>
<script>
  import AddImg from '@/components/add/upload/add_img';
  import AddImgList from '@/components/add/upload/imgList';
  import wx from 'weixin-js-sdk';
  import checkApi from '@/assets/js/check_api';
  export default {
    components:{
	  AddImgList,
	  AddImg
    },
    props: {
		field:{
			type:Object,
			default: function () {
				return {}
			}
		}
	},
	data(){
		 return{
			 agent: 'form',
			 orderId: '',
			 imgList: [], //图片列表
			 imgUpload: {
			 	picList: [], // 编辑/复制等存在的原数据
			 },
			 chooseImageTypes: []  //手机端上传图片设置
		  }
	  },
    created(){
			if(this.$store.state.detail.detailData.isImgWatermark){
				this.orderId = this.$store.state.detail.detailData.detailsPO.definitionVersionsId;
			}
			if(this.$store.state.detail.detailData.controlPO.formPhotoSet && "0"==this.$store.state.detail.detailData.controlPO.formPhotoSet){//是否允许选择图片
				this.chooseImageTypes=['album','camera'];
			}else{
				this.chooseImageTypes=['camera'];
			}
			if(this.field.value){
				var arry = [];
				if(typeof this.field.value == 'string'){
					var imgs = this.field.value.split(',');
					imgs.forEach(img => {
						arry.push({src:img});
					})
				}else{
					this.field.value.forEach(function(item){
						arry.push({src:item});
					});
				}
				this.imgUpload.picList  = arry;
			}else{
				this.imgUpload.picList  = [];
			}
      this.imgUpload.disabled = this.field.disabled||false;
		},
	  methods:{
		  setValue(data){
			  var key = this.field._id;
			  var value = [];
			  data.forEach(function(item){
			  	value.push(item.src);
			  });
			  this.$emit('change',{key,value})
		  },
	  }
  }
</script>
