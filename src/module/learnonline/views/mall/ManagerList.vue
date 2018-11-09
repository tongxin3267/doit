<template lang="html">
  <div class="qwui-manager_list">
    <div class="buy_wrap">
      <div class="buy_bar">
        {{$t('i18n.chatToManage')}}
      </div>
      <ul class="manager_list">
        <li
          class="manager flex_box"
          v-for="manage in loadMore.padeConfig.pageData"
          :key="manage.userId"
          @click="sendMsgShow(manage.wxUserId)"
        >
          <div class="manage_info flex_item">
            <div class="face_wrap fl">
              <img
                class="manager_face"
                v-if="getPicUrl(manage.headPic)"
                :src="getPicUrl(manage.headPic)"
              >
            </div>
            <p class="manager_name fl ellipsis">{{manage.qyUserName}}</p>
          </div>
          <div class="chat_btn" >
            <i class="iconfont icon-peixunxuexi_tuijian"></i>
          </div>
        </li>
        <load-more :loadmore="loadMore" ref="loadMoreFun"></load-more>
      </ul>
    </div>

    <dialog-group
      :title="msgBoxData.title"
      :show="this.isShowMsgBox"
      :cancelText="msgBoxData.cancelText"
      :confirmText="msgBoxData.confirmText"
      @confirm="confirm"
      @cancel="cancel"
    >
      <div class="msgBox_wrap">
        <div class="course_cover_wrap">
          <div class="cover_wrap">
            <img
              class="course_cover"
              :src="getPicUrl(subjectCover)"
              v-picfix
            >
          </div>
        </div>
        <h1 class="course_name">{{subjectName}}</h1>
        <div class="input_area">
          <textarea
            class="msg_content"
            name="reason"
            :placeholder="$t('i18n.inputReason')"
            v-model="msgContent"
          >
          </textarea>
        </div>
      </div>
    </dialog-group>
  </div>
</template>

<script>
import { getManager, sendBuyAsk } from '../../api/getData';
import loadMore from '../../../../components/base/load_more';
import dialogGroup from '../../../../components/base/dialog/dialog-group';

export default {
  name: 'ManagerList',
  components: {
    loadMore,
    dialogGroup
  },
  data() {
    return {
      // manageData: {}, // 管理员
      loadMore:{//加载更多组件
        url:"/portal/managesetting!getUserList.action",     //请求路径
        pageIndexName:"page",//不同应用不同分页参数
        data:{ //ajax入参数据
          keyWord:'',
          page:1,
          status:0,
          toptypes:'',
          needNotNull: 1
        },
        padeConfig:{
          currPage:"",
          maxPage:"",
          pageData:[],  //返回的列表数据
          totalRows:""//数据总条数
        },
        hasRecord:{
          show:false,
          setTop:false,//是否置顶?覆盖整个页面
          icon:"qwui-icon_box",
          title:"",//若text无内容则title为16px #bbb，有则为18px #666
          text:""//标题下面的提示
        },
      },
      isShowMsgBox: false, // 是否显示发送信息弹框
      msgBoxData: {
        title: this.$t('i18n.adviceBuyCourse'),
        confirmText: this.$t('i18n.sendTo'),
        cancelText: this.$t('i18n.cancel')
      },
      msgContent: '', // 推荐内容
      subjectCover: '', // 封面图
      subjectName: '', // 课程名称
      subjectId: '',
      wxUserId: '',// 管理员的登录id
    }
  },
  created() {
    this.subjectCover = this.$route.query.cover;
    this.subjectName = this.$route.query.name;
    this.subjectId = this.$route.query.id;
  },
  methods: {
    // 得到正确的图片URL
    getPicUrl(url) {
      return url ? (url.includes('http') ? url : _.compressURL + url) : url;
    },
    sendMsgShow(toWxUserId) {
      this.wxUserId = toWxUserId;
      this.isShowMsgBox = true;
    },
    // 点击确定
    confirm() {
      sendBuyAsk({
        subjectName: this.subjectName,
        toWxUserId: this.wxUserId,
        reason: this.msgContent,
        pic: this.getPicUrl(this.subjectCover),
        agentCode: 'learnonline',
        subjectId: this.subjectId
      }, (data) => {
        _.tooltips_succeed("i18n.sendSuccess");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500);

      });
      this.isShowMsgBox = false;
    },
    // 点击取消
    cancel() {
      this.isShowMsgBox = false;
    },
    // 得到正确的图片URL
    getPicUrl(url) {
      return url ? url.includes('http') ? url : _.compressURL +  url : url;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';
.qwui-manager_list {
  .buy_wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    .buy_bar {
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #999;
      background:rgba(245,245,245,1);
    }
    .manager_list {
      padding-left: 15px;
      .manager {
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 13px 0 12px;

        @include border-b-1px(#e6e6e6);

        .manage_info {
          .face_wrap {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 2px;
            overflow: hidden;
            .manager_face {
              width: 100%;
              height: 100%;
              margin-top: -3px;
            }
          }
          .manager_name {
            max-width: 220px;
            font-size: 16px;
            color: #333;
          }
        }
        .chat_btn {
          flex: 0 0 24px;
          padding: 0 15px;
          .iconfont {
            font-size: 24px;
            color: #45a8f5;
          }
        }
      }
    }
  }
  /* 发送消息弹框 */
  .msgBox_wrap {
    .cover_wrap {
      height: 156px;
      margin: 10px 0;
      border-radius: 5px;
      background: url('../../../../assets/images/default_bg.png');
      background-size: cover;
      overflow: hidden;
    }
    .course_name {
      margin-bottom: 16px;
      font-size: 15px;
      color: #333;
      text-align: left;
    }
    .input_area{
      text-align: left;
      width: 100%;
      .msg_content {
        box-sizing: border-box;
        width: 100%;
        height: 58px;
        padding: 10px;
        margin-bottom: 16px;
        border: 1px solid #d9d9d9;
      }
    }
  }
}
</style>
