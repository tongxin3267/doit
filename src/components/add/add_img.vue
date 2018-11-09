<template>
    <div class="qwui-title_detaildata">
      <div class="clearfix" >
        <div class="qwui-f_add_image_list" >
          <ul class="impression">
            <li v-for="(item, index) in list">
              <a class="qwui-remove_icon" @click="doDelLi(index);" ></a>
              <p class="img">
                <img class="previewer-demo-img"  @click="preview(index)" :src="item.src">
              </p>
            </li>
            <div v-transfer-dom>
              <previewer :list="list" ref="previewer" :options="options"></previewer>
            </div>
          </ul>
          <ul class="impression">
            <li class="f_image_add">
              <input v-if="isMobile" @click.prevent="upDataImageFile($event)" accept="image/jpeg,image/jpg,image/png,image/gif" type="file" class="imageFileInput"/>
              <input v-else @change='qw_uploadImages' class="imageFileInput" type=file accept="image/jpeg,image/jpg,image/png,image/gif"/>
              <!--图片上传-->
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
import previewer from 'vux/src/components/previewer';
import transferDom from 'vux/src/directives/transfer-dom';
import wx from 'weixin-js-sdk';
import checkApi from '../../assets/js/check_api';

export default {
  directives: {
    transferDom
  },
  components: {
    previewer
  },
  props: ["dataDetailMsg"],
  data(){
    return {
      dataBase:dataBase,
      isMobile:false,
      showDel: false,
      list: [], //图片列表
      options: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index];
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail.getBoundingClientRect();
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
      },
      imgurl: [], //返回父组件的数据，
      imgCache:"",
      $event:"",//图片对象
      imageUploadPathPC: "/portal/imageupload/imageUploadAction!doUploadImageBase64.action", //pc端上传图片接口
      imageUploadPathPhone:"/portal/newimageupload/newimageUploadAction!newimageUpload.action", //手机端上传图片接口
    }
  },
  created(){
    if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp()){
      this.isMobile=true;
    }
  },
  watch: {
    'dataDetailMsg.clearCache': function () { //用来提交完成后清空图片显示列表
      this.list = [];
      this.imgurl=[];
      this.$event.value="";
    },
    'dataDetailMsg.picList': function () {
      var self = this;
      this.dataDetailMsg.picList.forEach(function (e) {
        self.imgurl.push(e.picPath);
        if ( (/^http:\/\/.*$/.test(e.picPath)) || (/^https:\/\/.*$/.test(e.picPath)) ) {
        } else {
          e.picPath = _.compressURL + e.picPath
        }
        self.list.push({src: e.picPath});
      });
    },
    imgurl:function (val) {
      this.$emit("listenToChild", val)
    }
  },
  methods:{
    //手机端图片上传
    upDataImageFile(event){
      if(checkApi.checkJsApi_image && _.isWeChatApp()){
        var localId= [];
        var serverId= [];
        var self=this;
        wx.chooseImage({
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            //选择图片成功后
            localId = res.localIds;
            if (localId.length == 0) {
              _.alert("",'i18n.plzChoosePic');
              return;
            }
            _.showLoading(self.$t('i18n.readyToUpload')+localId.length+self.$t('i18n.pictureMounts'),true);
            var i = 0, length = localId.length;
            setTimeout(uploadFormult,500);

            function uploadFormult() {
              wx.uploadImage({
                localId: localId[i],
                isShowProgressTips:0,
                success: function (res) {
                  _.showLoading(self.$t('i18n.uploadingPic')+(i+1)+self.$t('i18n.pictureMounts'),true);
                  i++;
                  serverId.push(res.serverId);
                  if (i < length) {
                    setTimeout(uploadFormult,500);
                  }
                  if(serverId.length==localId.length){
                    self.newimageupload(serverId);
                  }
                },
                fail: function (res) {
                  _.hideLoading();
                  _.alert("",this.$t("i18n.uploadFail")+res.errMsg+"，"+this.$t("i18n.reupload"));
                }
              });
            }
          },
          error : function(e){
            _.alert("",'i18n.uploadFail');
          }
        });
      }
    },
    newimageupload(serverId){
      var serverIds="";
      for(var i=0;i<serverId.length;i++){
        serverIds+=serverId[i]+",";
      }
      var self=this;
      _.ajax({
        url:_.baseURL+self.imageUploadPathPhone,
        type:"POST",
        data: {
          serverIds: serverIds,
          isOpen: false,
          isUsePublic: checkApi.wxqyh_isUsePublic,
          drawString: "",
          agent:self.dataBase.wxqyh_uploadfile.agent
        },
        dataType:"json",
        success:function(result){
          _.hideLoading();
          if(result.code=="0"){
            var urlList=result.data.urlList;
            if(urlList.length>0){
              for(var i=0;i<urlList.length;i++){
                self.list.push({src: _.compressURL+urlList[i]});
                self.imgurl.push(urlList[i]);
              }
            }
          }else{
            _.alert('i18n.notice', result.desc);
          }
        }
      });
    },
    //pc端图片上传

    qw_uploadImages(even){
      this.imgCache=even;
      var obj=even.target;
      this.$event=obj;
      var imagePath = obj.value;
      //如果上传图片的后缀为空，不过滤，直接上传
      if(_.chooseImageTypes&&_.chooseImageTypes.length==1&&_.chooseImageTypes[0]=='camera'){
        _.alert('i18n.notice','i18n.uploadByPhone');
        return false;
      }
      if(imagePath.lastIndexOf('.')>-1){
        var type = imagePath.substring(imagePath.lastIndexOf('.') + 1, imagePath.length).toLowerCase();
        if (type != undefined && type != "" && type != 'jpg' && type != 'png' && type != 'jpeg') {
          _.alert('i18n.imgError','i18n.imgErrorMsg');
          return false;
        }
      }
      if (obj.files && obj.files[0]) {
        var file = obj.files[0];
        var URL = window.URL || window.webkitURL;
        _.showLoading(this.$t('i18n.imgUploading'),true);
        var img = new Image();
        img.src = URL.createObjectURL(file);
        var self=this;
        img.onload = function () {
          var that = this;
          var quality=1;
          var maxWidth=2560;
          var base64 = "";
          var w = that.width, h = that.height, scale = w / maxWidth; //生成比例
          if(w> maxWidth){ //如果图片大于最大宽度
            quality = 0.8;//压缩图片质量0-1，值越大质量越好
            w = maxWidth;
            h = h / scale;
          }
          //生成canvas
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(that, 0, 0, w, h);
          base64 = canvas.toDataURL('image/jpeg', quality );
          _.ajax({
            url: _.baseURL + self.imageUploadPathPC,
            type: 'post',
            data: {
              imgFileBase: base64,
              agent:self.dataBase.wxqyh_uploadfile.agent
            },
            success: function (result) {
              _.hideLoading();
              if(result.code === "0"){
                self.list.push({src: img.src});
                self.imgurl.push(result.data.imgurl);
              } else {
                _.alert('i18n.notice',result.desc);
              }
            },
          })
        };
      }
    },
    preview (index) {
      this.$refs.previewer.show(index);
    },
    doDelLi (index) {
      if (index == this.list.length-1 && this.imgCache) { //如果清除了刚刚上传的图片，清除缓存则可以重新上传
        this.imgCache.target.value="";
      }
      this.list.splice(index, 1);
      this.imgurl.splice(index,1);
    },
  }
}
</script>
<style>
  .qwui-title_detaildata{position: relative;padding-left:15px;background-color:#fff;}
  .impression li,.column1List .impression li:last-child {
    position: relative;
    float: left;
    width: 45px;
    margin: 10px 15px 10px 0;
    border-radius: 2px;
    color: #666;
  }
  .qwui-f_add_image_list{
    margin: 0;
    position:relative;
  }
  .imageFileInput {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    overflow: hidden;
    width: 45px;
    height: 45px;
    opacity: 0;
  }
  .qwui-f_add_image_list li .img img{
    width: 45px;
    height: 45px;
  }
  .qwui-f_add_image_list .f_image_add {
    display: inline-block;
    width: 45px;
    height: 45px;
    vertical-align: middle;
    background: url("../../assets/images/add_remove_img.png") no-repeat 0 0;
    background-size: 97px;
  }
</style>
