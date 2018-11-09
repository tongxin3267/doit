<template lang="html">
  <div class="qwui-detail" v-if="detail">
    <qw-tweet class="qwui-tweet"
      :header="header"
      :content="content"
      :footer="footer"
      :tweetCheck="tweetCheck"
      :detail="detail"
      :isOpen="isOpen"
      ref="tweet"
    ></qw-tweet>

      <!-- 回复评论 -->
    <list-comment :listcomment="listComment"
      :isShowOnlyCommentBtn="false"
      @showThisPersonUtil="getCreatorDetail"
      :isIgnore="true"
      v-if="!isOpen || info.shareComment === '1'"
    ></list-comment>


    <div class="qwui-tweet_comment" v-if="!isOpen">
      <!--评论输入框组件-->
      <chat-comment :listcomment="listComment"
        @addComment="_addComment"
      ></chat-comment>

      <!--选择人组件-->
      <user-select :selectconfig="dataBase.selectConfig"
        v-if="dataBase.selectConfig.show"
      ></user-select>
    </div>

    <!--个人信息-->
    <user-info ref="loadPersonalMsg"></user-info>

    <qw-share class="qwui-share"
      :period="5"
      v-if="isShowShare"
    ></qw-share>

    <qw-third-part class="qwui-third_part"
      :link="info.thirdPartUrl"
      :text="info.thirdPartTips"
      v-if="info.msgType === 1"
    ></qw-third-part>

    <div class="qwui-secret"
      ref="secret"
      v-if="info.isSecret === '1'"
    ></div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import commentDetail from '../../js/detail';
import QwTweet from '@/components/tweet'
import listComment from '@/components/detail/list_comment';
import chatComment from '@/components/detail/chat_comment';
import userSelect from '@/components/base/user_or_dept_select';
import QwShare from '../../components/PartyDetail/share';
import QwThirdPart from '../../components/PartyDetail/thirdPart';
import eventBus from '@/utils/eventBus';
import userInfo from '@/components/detail/user_info_card';//个人信息

// 全局变量引入
const _ = window._;
const dataBase = window.dataBase;

// 请求地址
const url = {
  dynamicinfoDetail: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!dynamicinfoDetail.action',
  updateEnable: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!updateEnable.action',
  setPraise: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!setPraise.action',
  getNextDynamic: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!getNextDynamic.action',
  listMoreComment: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!listMoreComment.action',
  deleteComment: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!deleteComment.action',
  addDynamicInfoComment: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!addDynamicInfoComment.action',
  auditDynamic: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!auditDynamic.action'
};

const openURL = {
  dynamicinfoDetail: _.baseURL + '/open/dynamicinfo/dynamicinfoAction!dynamicinfoDetail.action'
}

// 配置项
const SIZE = 10; // 每页评论数量
const TIMEOUT = 200; // 请求等待时间（超过显示loading）

// 封装Ajax
Vue.use({
  install (vue, options) {
    let ajax = async (description, settings) => {
      let timer = setTimeout(() => {
        _.showLoading('正在' + description);
      }, TIMEOUT);

      let res = await axios(settings);

      clearTimeout(timer);

      _.hideLoading();

      if (res.code === '0') {
        return Promise.resolve(res);
      } else {
        _.alert('提示', res.desc);
        console.error(res.desc);
      }
    };

    ajax.get = async (description, url, settings) => {
      return await ajax(description, {
          url,
          method: 'get',
          ...settings
        });
    };

    ajax.post = async (description, url, data, settings) => {
      return await ajax(description, {
          url,
          data,
          method: 'post',
          ...settings
        });
    };

    vue.prototype.$ajax = ajax;
  }
});

export default {
  components: {
    QwTweet,
    listComment,
    chatComment,
    userSelect,
    QwShare,
    QwThirdPart,
    userInfo
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    belongAgent: {
      type: String,
      default: 'dynamic'
    }
  },
  data () {
    return {
      detail: undefined, // 详情数据,
      dataBase,
      page: 1, // 评论页数
      test: Math.random(),
      tempData: commentDetail.listComment,
      isShowShare: false,
      previewImageUrl: []
    };
  },
  computed: {
    params () {
      return this.$route.query;
    },
    info () {
      return this.detail.tbXyhDynamicinfoPO;
    },
    // 推文ID
    id () {
      return this.info.dynamicInfoId;
    },
    // 发布日期
    datetime () {
      let datetime = this.info.publishTime;
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(datetime)) {
        return datetime;
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(datetime)) {
        return datetime + ':00';
      } else {
        throw Error(datetime);
      }
    },

    // 数据整理
    // 头部信息
    header () {
      let header = {
        title: this.info.title,
        datetime: this.datetime,
        author: this.info.publisher,
        review: this.info.isEnable === 1,
        isAuthor: this.detail.operationPerson === this.info.personName
      };

      return header;
    },

    // 主体内容
    content () {
      let localport = 'https://tqy.do1.net.cn/fileweb';
      let content = {
        content: this.info.content
                  .replace(/http:\/\/qy\.do1\.com\.cn\:6090\/fileweb/g, localport)
                  .replace(/@fileweb@/g, localport)
      };

      // 封面信息
      if (this.info.coverImage && this.info.isDisplayCoverImage === '0') {
        content.cover = {
          src: _.compressURL + this.info.coverImage,
          alt: this.info.title
        }
      }

      // 音频信息
      if (this.detail.videoPO) {
        content.music = {
          src: _.compressURL + this.detail.videoPO.url,
          filename: this.detail.videoPO.fileName
        }
      }

      return content;
    },

    // 底部内容
    footer () {
      let footer = {
        label: this.info.dynamicType,
        viewCount: this.info.viewCount,
        subscribe: { },
        isOpen: this.info.isOpen
      };

      let praisePager = this.detail.praisePager;

      if (praisePager) {
        footer.subscribe = {
          hasSubscribe: this.detail.hasPraise,
          total: praisePager.totalRows,
          list: praisePager.pageData.map(value => {
              return value.personName;
            })
        }
      }

      if (this.detail.mediaList) {
        footer.fileList = this.detail.mediaList.map(file => {
          let src = url.downloadBaseUrl + file.url + '&fileFileName=' + file.fileName;
          return {
            filename: file.fileName,
            preview: url.previewBaseUrl + src,
            size: file.fileSizeStr,
            ext: file.fileExt,
            src,
            id: file.id,
            url: file.url
          };
        });
      }

      return footer;
    },

    // 评论
    comment () {
      let comment = {
        commentCheck: {
          show: this.detail.isCommentReviewer === 1
        },
        hasMore: this.detail.hasMore
      };

      comment.comments = this.detail.comments.map(_comment => {
        let checkStatus = 0;

        // 审核状态
        if (comment.commentCheck.show) {
          if (_comment.isPassReview) {
            checkStatus = parseInt(_comment.isPassReview);
          }
        }

        return {
          avator: _comment.headPic,
          author: _comment.personName,
          created: _comment.time,
          content: _comment.content,
          isAuthor: _comment.userId === _.userId,
          checkStatus
        };
      });

      return comment;
    },

    // 动态审核
    tweetCheck () {
      if (this.isOpen) {
        return {
          show: false,
          status: 0,
          auditPerson: ''
        };
      }

      let tweetCheck = {
        show: this.detail.isDynamicReviewer === 1,
        status: this.info.isPassReview ? parseInt(this.info.isPassReview) : 0,
        auditPerson: this.info.auditPerson || ''
      };

      return tweetCheck;
    },

    // 评论数据
    listComment () {
      let comments = commentDetail.listComment;
      comments.get.data.id = this.info.dynamicInfoId;
      comments.get.hasMore = this.detail.hasMore;
      comments.totalPages = this.info.commentCount;
      comments.send.contentObject = 'comment.content';
      comments.send.data = {
        type: 1,
        'comment.content': '',
        'comment.dynamicinfoId': this.info.dynamicInfoId
      };
      comments.getMore.data = {
        pageSize: 10,
        dynamicId: this.info.dynamicInfoId,
        isCommentReviewer: this.detail.isCommentReviewer
      };
      comments.comments = this.detail.comments || [];
      return commentDetail.listComment;
    }
  },
  methods: {
    // 添加水印
    addMark () {
      let canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext("2d");

      canvas.width = 160;
      canvas.height = 100;

      ctx.fillStyle = 'rgba(220, 220, 220, 0.4)';
      ctx.font = '16px Microsoft YaHei lighter';
      ctx.rotate(-15 * Math.PI / 180);
      ctx.fillText(_.personName, 20, 40);

      let img = canvas.toDataURL();

      if(this.$refs.secret){
        this.$refs.secret.style.backgroundImage = `url(${img})`;
      }
    },

    //分享链接，配文字图片
    shareLink: function () {
      _.checkApi.setDataForWeixinValue(
        this.header.title,
        _.compressURL + this.info.coverImage,
        this.info.summary,
        window.location.href
      );
    },

    //获取创建人详情
    getCreatorDetail:function (creator) {
      if(creator){
        this.$refs.loadPersonalMsg.showUserMessage(creator);
      }
    },

    _addComment ({ value, type, id }) {
      // this.$router.go(0);
    },

    /**
     *
     * 页面跳转
     * 1. 复制详情
     * 2. 编辑详情
     * 3. 预览文件
     * 4. 下载文件
     *
     **/

     // 1. 复制详情
     copyLink () {
       _.alert('提示', '复制功能尚未开发');
     },

     // 2. 编辑详情
     editeLink () {
       _.alert('提示', '编辑功能尚未开发');
     },

     // 3. 预览文件
     previewLink (file) {
       _.alert('提示', '预览功能尚未开发');
     },

     // 4. 下载文件
     downloadLink (file) {
       _.alert('提示', '下载功能尚未开发');
     },

    /**
     *
     * 异步请求
     * 1. 请求详情
     * 2. 修改查阅状态
     * 3. 修改点赞状态
     * 4. 获取邻近文章的ID
     * 5. 获取更多评论
     * 6. 删除评论
     * 7. 添加评论
     * 8. 添加图片评论
     * 9. 上传图片
     * 10. 提交审核结果
     *
     **/

    // 1. 请求详情
    // load (id: String)
    // @param id: 详情ID
    async load (id) {
      let res = await this.$ajax.post(
          '加载详情',
          (this.isOpen ? openURL : url).dynamicinfoDetail, {
            id: id || this.params.id,
            size: SIZE,
            belongAgent: this.belongAgent
          }
        );

      this.detail = Object.assign({}, res.data);
      return this.detail;
    },

    // 2. 修改查阅状态
    // toggleCheckoutStatus (status: Number)
    // @param status: 查阅状态，0 关闭， 1 开启
    async toggleCheckoutStatus (status) {
      let res = await this.$ajax.post(
          '修改查阅状态',
          url.updateEnable, {
            dynamicId: this.id,
            isEnable: status,
            belongAgent: this.belongAgent
          }
        );

      return this.info.isEnable = status;
    },

    // 3. 修改点赞状态
    // toggleSubscribeStatus
    async toggleSubscribeStatus () {
      let res = await this.$ajax.post(
          '修改点赞状态',
          url.setPraise, {
            id: this.id,
            belongAgent: this.belongAgent
          }
        );

      this.detail.praisePager = res.data.praisePager;
      return this.detail.hasPraise = res.data.hasPraise;
    },

    // 4. 获取邻近文章的ID
    // pageChange (type: String)
    // @param type: 类型，pre 上一篇， next 下一篇
    async pageChange (type) {
      let page = parseInt(this.params.page || 1),
        schType = this.params.schType,
        typeId = this.params.typeId,
        title = this.params.title,
        isPassReview = this.params.isPassReview,
        word;

      if (schType === '' && typeId === '') {
        schType = '8';
        page = 1;
      }

      if (type === 'pre') {
        word = '上';
        if (--page <= 0) {
          _.alert('提示', '已经是第一篇了');
          return;
        }
      } else if (type === 'next') {
        word = '下';
        if (schType === 'other') {
          if (++page > 5) {
            _.alert('提示', '已经是最后一篇了');
            return;
          }
        } else if (schType !== '8') {
          page++;
        }
      }

      let res = await this.$ajax.post(
          `寻找${word}一篇`,
          url.getNextDynamic, {
            id: this.id,
            schType,
            typeId,
            page,
            type,
            title,
            isPassReview,
            belongAgent: this.belongAgent
          }
        );

      this.$router.push({
        query: {
          id: res.data.dynamicInfoId,
          schType,
          typeId,
          page,
          title,
          isPassReview
        }
      });
      location.reload();//重新加载
      return this.id;
    },

    // 5. 获取更多评论
    // getMoreComment ()
    async getMoreComment () {
      let res = await this.$ajax.post(
          '获取更多评论',
          url.listMoreComment, {
            dynamicId: this.id,
            pageSize: SIZE,
            page: ++this.page,
            isCommentReviewer: this.detail.isCommentReviewers,
            belongAgent: this.belongAgent
          }
        );

      this.detail.comments.concat(res.data.comments);
      this.detail.hasMore = res.data.hasMore;
      return this.detail.comments;
    },

    // 6. 删除评论
    // deleteComment (id: String)
    // @param id: 评论ID
    async deleteComment (id) {
      let res = await this.$ajax.post(
          '删除评论',
          url.deleteComment, {
            commentId: id,
            belongAgent: this.belongAgent
          }
        );

      this.load();
      return id;
    },

    // 7. 添加评论
    // addComment (comment: String)
    // @param comment: 评论内容
    async addComment (comment) {
      let res = await this.$ajax.post(
          '添加评论',
          url.addDynamicInfoComment, {
            'comment.content': comment,
            'comment.dynamicinfoId': this.id,
            type: 1,
            userId: this.params.userId,
            belongAgent: this.belongAgent
          }
        );

      this.load();
      return this.detail.comments[0];
    },

    // 8. 添加图片评论
    async addPictureComment (...args) {
      let src = await this.uploadPicture(...args);

      let res = await this.$ajax.post(
          '添加图片评论',
          url.addDynamicInfoComment, {
            'comment.content': src,
            'comment.dynamicinfoId': this.id,
            type: 2,
            userId: this.params.userId,
            belongAgent: this.belongAgent
          }
        );

      this.load();
      return this.detail.comments[0];
    },

    // 9. 上传图片
    async uploadPicture () {

    },

    // 10. 提交审核结果
    async checkResult (status) {
      let res = await this.$ajax.post(
        '提交审核结果',
        url.auditDynamic, {
          isPassReview: status,
          ids: this.info.dynamicInfoId,
          belongAgent: this.belongAgent
        }
      );

      this.load();
    }
  },
  async created () {
    eventBus.$off();

    // 绑定事件
    eventBus.$on('tweet-copy', () => {
      this.copyLink();
    });

    eventBus.$on('tweet-edite', () => {
      this.editeLink();
    });

    eventBus.$on('tweet-review', () => {
      let status = 0;

      if (this.info.isEnable !== 1) {
        status = 1;
      }

      this.toggleCheckoutStatus(status);
    });

    eventBus.$on('tweet-view-list', () => {
      if (!this.isOpen) {
        this.$router.push({
          path: '/viewList',
          name: 'view-list',
          query: {
            id: this.id
          }
        });
        this.$router.go(0);
      }
    });

    eventBus.$on('tweet-subscribe', () => {
      this.toggleSubscribeStatus();
    });

    eventBus.$on('tweet-previous', () => {
      this.pageChange('pre');
    });

    eventBus.$on('tweet-next', () => {
      this.pageChange('next');
    });

    eventBus.$on('tweet-check-pass', () => {
      _.alert('提示', '动态通过后，用户可看到动态内容，确定通过？', {
        defaultBtn: {
          name: '取消',
          callBack: null
        },
        primaryBtn: {
          name: '确定',
          callBack: () => {
            this.checkResult(0);
          }
        }
      });
    });

    eventBus.$on('tweet-check-not-pass', () => {
      _.alert('提示', '不通过该动态，用户将无法看到动态内容，确定不通过？', {
        defaultBtn: {
          name: '取消',
          callBack: null
        },
        primaryBtn: {
          name: '确定',
          callBack: () => {
            this.checkResult(2);
          }
        }
      });
    });

    eventBus.$on('tweet-share', () => {
      this.isShowShare = true;
    });

    // 加载数据
    await this.load();
    document.title = this.info.title;

    this.addMark();

    // 手机端的分享链接
    if (_.isAndroid() || _.isIOS()) {
      this.shareLink();
    }

  }
}
</script>

<style lang="scss" scoped>
.qwui-detail {
  position: relative;
  overflow: hidden;

  .qwui-secret {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 500%;
    height: 500%;
    z-index: 5;
    transform: rotate(-7deg) translate(-10%, -10%);
    -ms-transform: rotate(-7deg) translate(-10%, -10%); 	/* IE 9 */
    -moz-transform: rotate(-7deg) translate(-10%, -10%); 	/* Firefox */
    -webkit-transform: rotate(-7deg) translate(-10%, -10%); /* Safari 和 Chrome */
    -o-transform: rotate(-7deg) translate(-10%, -10%); 	/* Opera */
    pointer-events: none;
  }

}
</style>
