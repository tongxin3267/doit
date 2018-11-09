<template>
  <div class="wrap qwui-scheme_wrap">
    <section>
      <div class="qwui-scheme_container">
        <div class="qwui-scheme_title">
          95%的同行选择了这些应用
        </div>
        <div class="qwui-scheme_content">
          <div class="qwui-scheme_content_item" v-for="item in schemeList">
            <img :src=item.url class="qwui-scheme_content_icon" alt="">
            <span class="qwui-scheme_content_explain">{{item.text}}</span>
          </div>
        </div>
      </div>
      <div class="qwui-scheme_container width">
        <div class="qwui-scheme_title height">
          <p class="qwui-scheme_title_center">长按下方二维码</p>
          <p class="qwui-scheme_title_center">马上安装应用到企业微信</p>
        </div>
        <div class="qwui-scheme_content_pic">
          <img :src="codeImg" class="qwui-scheme_content_img" alt="">
        </div>
      </div>
    </section>
  </div>
</template>

<script>
    export default {
        data() {
            return {
              schemeList: [
                {
                  url: require('../../../../assets/images/qwui-others_work.png'),
                  text: "企微云办公"
                },
                {
                  url: require('../../../../assets/images/qwui-others_task.png'),
                  text: "任务分派",
                },
                {
                  url: require('../../../../assets/images/qwui-others_news.png'),
                  text: "新闻公告"
                },
                {
                  url: require('../../../../assets/images/qwui-others_hunman.png'),
                  text: "人事考核"
                },
                {
                  url: require('../../../../assets/images/qwui-others_form.png'),
                  text: "表单流程"
                },
                {
                  url: require('../../../../assets/images/qwui-others_study.png'),
                  text: "培训学习"
                },
                {
                  url: require('../../../../assets/images/qwui-others_attend.png'),
                  text: "考勤打卡"
                },
                {
                  url: require('../../../../assets/images/qwui-others_account.png'),
                  text: "费控报销"
                },
              ],
              codeImg: require("../../../../assets/images/qwui-others_code.png"),//二维码背景图片
            }
        }
    }
</script>

<style>
  .qwui-scheme_wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../../../../assets/images/qwui-others_background.png");
    background-size: cover;
  }
  @media screen and (min-width: 1024px) {
    .qwui-scheme_wrap {
      width: 740px;
    }
  }
  .qwui-scheme_container {
    width:333px;
    height:209px;
    margin: 28px auto;
    background:#fff;
    border-radius: 14px ;
    overflow: hidden;
  }
  .qwui-scheme_container.width {
    height: 240px;
  }
  .qwui-scheme_title {
    width:201px;
    height:22px;
    margin: 12px 0 0 66px;
    font-weight: 700;
    font-size:16px;
    font-family:PingFangSC-Medium;
    color:rgba(51,51,51,1);
    line-height:22px;
  }
  .qwui-scheme_title.height {
    height: 44px;
  }
  .qwui-scheme_content {
    margin: 19px 16px 0 16px;
  }
  .qwui-scheme_content_item {
    float: left;
    width: 60px;
    height: 63px;
    margin: 0 20px 16px 0;
  }
  .qwui-scheme_content_item:nth-child(4n){
    margin-right: 0;
  }
  .qwui-scheme_content_icon {
    width: 40px;
    height: 40px;
    display: block;
    margin: 0 auto;
  }
  .qwui-scheme_content_explain {
    display: block;
    margin-top: 6px;
    font-size: 12px;
    font-family:PingFangSC-Regular;
    color: #666;
    text-align: center;
  }
  .qwui-scheme_title_center {
    text-align: center;
  }
  .qwui-scheme_content_pic {
    width: 272px;
    height: 144px;
    margin: 18px auto 0;
  }
  .qwui-scheme_content_img {
    width: 100%;
  }
</style>

