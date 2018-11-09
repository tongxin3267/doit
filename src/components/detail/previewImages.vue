
<!--PC、微信APP图片预览功能组件-->
<template>
  <div v-transfer-dom>
    <previewer :list="previewUrls" ref="previewer" :options="options"></previewer>
  </div>
</template>
<script>
  import previewer from 'vux/src/components/previewer';
  import transferDom from 'vux/src/directives/transfer-dom';
  import EventBus from '@/utils/eventBus';
  import {previewImages} from '@/utils/uploadImages';
  export default {
    name: "previewImages",
    props:{
      urls:{
        type:Array,
        default:function () {
          return []
        }
      },
      //兼容微信端培训学习预览图片打不开
      useWxPreview:{
        type:Boolean,
        default: true
      }
    },
    data() {
      return{
        previewUrls:this.urls,
        wxImagesUrls:[],
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.previewImages')[index];
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            let rect = thumbnail.getBoundingClientRect();
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
          }
        },
      }
    },
    mounted(){
      EventBus.$on("previewImages",this.previewImagesClick);                       //监听点击预览
    },
    watch:{
      "urls"(val){
        this.previewUrls=val;
        this.wxImagesUrls=[];
        this.previewUrls.forEach((item,index)=>{                                    //处理图片src
          this.previewUrls[index].src=_.filterCompressURL(item.picPath);
          this.wxImagesUrls.push(_.filterCompressURL(item.picPath));
        });
      }
    },
    methods:{
      previewImagesClick(currentUrl){                                               //图片预览功能
        if(_.isWeChatApp() && this.useWxPreview){
          previewImages(currentUrl,this.wxImagesUrls);
        }else{
          this.previewUrls.forEach((val,index)=>{
            if(val.src.indexOf(currentUrl)!=-1){
              this.$refs.previewer.show(index);
            }
          });
        }
      }
    },
    directives: {
      transferDom
    },
    components:{
      previewer
    }
  }
</script>
