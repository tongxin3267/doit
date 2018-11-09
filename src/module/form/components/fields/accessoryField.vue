<template>
  <div class="field-content">
	<add-file-list :agent="agent"
				   :filesList="fileUpload.mediaList"
				   :deleteFile="!(field.disabled||field.readonly)"
				   :downLoad="field.disabled">
	</add-file-list>
    <add_file v-if="!(field.disabled||field.readonly)"
			  :filesList="fileUpload.mediaList"
			  :agent="agent" @updateFileList="showMsgFromFileDetail">
	</add_file>
  </div>
</template>
<script>
  import add_file from '@/components/add/upload/add_file';
  import addFileList from '@/components/add/upload/addFileList';
  import {fileSendata} from '../../js/validation'
  import {setFiles,deleteFile} from '../../../../utils/updateFiles';
  export default {
    components:{
      add_file,addFileList
    },
    props:{
      field: {
			type: Object,
			default: function () {
				return {}
			}
	  }
	},
    created(){
      this.fileUpload.mediaList = setFiles(this.field.value)||[];
	  	this.showMsgFromFileDetail(this.fileUpload.mediaList);
      this.fileUpload.isEdit = !this.field.disabled||false;
    },
    data(){
      return{
      	agent: 'form',
        fileUpload: {
          mediaList: [], // 编辑/复制等存在的原数据
		  		isEdit: true
        },
      }
    },
    methods:{
			showMsgFromFileDetail (val){
				var key = this.field._id;
				var value = [];
				value = fileSendata(val)
				this.$emit('change',{key,value})
			}
    }
  }
</script>
