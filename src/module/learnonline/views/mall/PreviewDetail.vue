<template>
  <div class="qwui-lean_detail"
    :class=" fileType === 4 ? '' : 'wrap'"
  >
    <div class="wrap_inner" :style="{height: docViewHeight + 'px'}">
      <iframe name="topFrame" class="inner_iframe"
              :src="iframeSrc"
              ref = "iframe"
              v-if = "iframeFlag"
      ></iframe>
      <div class="img_doc qwjs-img_doc"
           ref="imgDoc"
           v-html="content"
           v-else
      ></div>
    </div>
  </div>
</template>

<script>

  import { getArticleContent, recordLearnTime } from '../../api/getData';
  export default {
    data() {
        return {
          //当文件类型为图文时，不需要iframe标签
          iframeFlag: true,
          //iframe的src属性值
          iframeSrc: '',
          content : '',
          timer : undefined,
        }
    },
    computed: {
      docViewHeight () {
        let docObj = document.documentElement || document.body;
        return docObj.clientHeight;
      },
      fileUrl () {
        return decodeURIComponent(this.$route.query.fileUrl);
      },
      fileName () {
        return this.$route.query.fileName;
      },
      fileType () {
        return parseInt(this.$route.query.fileType);
      },
      fileId () {
        return this.$route.query.fileId;
      },
      isFree () {
        return this.$route.query.isFree;
      },
      subjectId () {
        return this.$route.query.subjectId;
      }
    },
    methods: {
      //处理iframe的src
      handleSrc (fileUrl,fileName,fileType) {
        let method = [];
        let self = this;
        //文档类型
        method[4] = () => {
          document.querySelector('body').style.width = '100%';
          //pdf类型
          if(fileUrl.toLowerCase().includes('.pdf')){
            this.iframeSrc = _.baseURL+'/jsp/wap/learnonline/generic/web/viewer.html?url='+
              encodeURIComponent(_.fileDownURL+_.downFileURL+encodeURIComponent(fileUrl)+
                '&fileFileName='+encodeURIComponent(fileName));
          }else {
            this.iframeSrc = _.yongzhong_url+_.fileDownURL+_.downFileURL+encodeURIComponent(fileUrl)+
              '&fileFileName='+encodeURIComponent(fileName);
          }
        };
        //外部链接
        method[6] = () => {
          if(fileUrl.includes('mck.baidu.com') && _.isIOS()){
            let iframeDom = this.$refs.iframe;
            iframeDom.style.width = top.innerWidth + 'px';
            iframeDom.scrolling = "no";
          }
          this.iframeSrc = this.handleVideoUrl(fileUrl).replace('http:','').replace('https:','');
        };
        //图文类型
        method[5] = () => {
          //iframe隐藏
          this.iframeFlag = false;
          this.$nextTick(() => {
            //所有iframe视频src
            let iframeDom = document.querySelectorAll('.qwjs-img_doc p iframe');
            iframeDom.forEach(function (value) {
              let eachUrl = value.src;
              //处理优酷的视频链接
              if(eachUrl.includes('player.youku.com/')){
                eachUrl = eachUrl.replace('http://', 'https://');
                value.src = eachUrl;
              }else {//处理腾讯的视频链接
                value.src = self.handleVideoUrl(eachUrl);
              }
            });
            //特定腾讯PC视频
            let embedSrcAll = document.querySelectorAll('.qwjs-img_doc embed.edui-faked-video');
            embedSrcAll.forEach(function (value) {
              let eachUrl = value.src;
              let iframeDom = document.createElement('iframe');
              iframeDom.src = self.handleVideoUrl(eachUrl);
              iframeDom.width = '100%';
              iframeDom.frameBorder = '0';
              value.parentNode.appendChild(iframeDom);
              if(value.parentNode.tagName === 'P'){
                value.parentNode.removeChild(value.parentNode.firstElementChild);
              }
            });
          });
        };
        return method[fileType]();
      },
      //处理腾讯视频的链接
      handleVideoUrl (url) {
        let flag = url.includes('https://v.qq.com') || url.includes('https://m.v.qq.com');
        let vidFlag = url.includes('vid=');
        let playUrl = 'https://v.qq.com/iframe/player.html?tiny=0&auto=0&vid=';
        if(flag && vidFlag && !url.includes('iframe')){
          let num = url.indexOf("vid=");
          let nextNum = url.indexOf("&");
          if(nextNum === -1){
            let videoId = url.substr(num + 4);
            url = playUrl + videoId;
          }else {
            let videoId = url.substring(num + 4, nextNum);
            url = playUrl + videoId;
          }
        }else if(flag && !vidFlag){
          let videoId = url.substr(0, url.lastIndexOf('.'));
          let newVideoId = videoId.substr(videoId.lastIndexOf('/') + 1, videoId.length);
          url = playUrl + newVideoId;
        }
        return url;
      },
      //记录学习时长
      recordTime () {
        let indexReadTime = 0;//本次总的学习时长
        let tenForme = 0;//满一分钟重置为0
        this.timer = setInterval(() => {
          indexReadTime++;
          tenForme++;
          if((tenForme*6)>=60){
            tenForme=0;
            //满1分钟上传一次参数
            recordLearnTime({
              subjectId: this.subjectId, //课件id
              enclosureId: this.fileId, // 课程id
              expend: 1, // 看了多少分钟（目前固定1分钟请求一次）
              lastRate: 0, // 该课件已经看了多少比例（0-1）
            }, () => {})
          }
        },6000)
      },
    },
    mounted () {
       _.hideLoading('');
      document.title = this.$t('i18n.learning') + '：' + this.fileName;
      if(this.fileType === 4){
        this.handleSrc(this.fileUrl,this.fileName,this.fileType);
      }else if(this.fileType === 6){
        this.handleSrc(this.fileUrl,'',this.fileType);
      }else {
        getArticleContent({
          id : this.fileId
        }, data => {
          this.content = data.enclosurePO.content;
          this.$nextTick(this.handleSrc('','',this.fileType));
        });
      }
      if(this.isFree){
        this.recordTime();
      }
    },
    //页面离开时清除定时器
    beforeRouteLeave(to, from, next) {
      // 组件离开前清除定时器
      clearInterval(this.timer);
      next();
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-lean_detail {
    .wrap_inner {
      overflow-x: auto;
      .inner_iframe {
        width: 100%;
        height: 100%;
        border: 0;
        overflow: auto;
        z-index:9
      }
      .img_doc {
        width: 100%;
        height: 100%;
        background: #fff;
        overflow: auto;
        p {
          padding: 10px;
          color:#333;
        }
        img {
          display: block;
          width: 100%;
        }
        iframe {
          display: block;
          width: 100%;
          height: 210px;
        }
      }
    }
  }
</style>

