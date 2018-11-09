<!-- 直播间 -->
<template lang="html">
  <div class="wrap qwui-livePlay">
    <div class="wrap_inner" :style="{ height: winHeight }">

      <!-- 播放区域 -->
      <div class="livePlay_wrap">
        <div id="id_video_container" class="liveView_area"></div>
        <div class="playInfo clearfix">
          <div class="face_wrap fl">
            <img class="userFace" :src="headPic" alt="">
          </div>
          <div class="info_wrap fl">
            <p class="name ellipsis">{{this.livePlayData.teacher && this.livePlayData.teacher.userName}}</p>
            <p class="online">{{onlineNum + $t('i18n.online')}}</p>
          </div>
        </div>
      </div>

      <!-- 互动区域 -->
      <div class="comment_wrap">
        <div class="comment_bar">
          <span class="comment_title">{{$t('i18n.interactiveArea')}}</span>
        </div>
        <div class="comment_area" :style="{ height: commentHeight }" ref="commentArea">
          <!-- 评论列表 -->
          <ul class="comments_list" ref="commentList">
            <template v-for="comment in chatList" >
              <!-- 讲师文字评论 -->
              <li
                v-if="comment.isTeacher === 1 && comment.type === 1"
                class="teacherComment clearfix"
                :key="comment.id"
              >
                <div class="fr breakWorld">
                  <div class="userFace_wrap fr">
                    <img :src="getPicUrl(comment.headPic)" class="userFace">
                  </div>
                  <div class="teacherContent fr one_word_wrap">{{comment.content}}</div>
                </div>
              </li>
              <!-- 讲师图片评论 -->
              <li
                v-else-if="comment.isTeacher === 1 && comment.type === 2"
                class="teacherComment clearfix"
                :key="comment.id"
              >
                <div class="fr breakWorld">
                  <div class="clearfix mb10">
                    <div class="userFace_wrap fr ">
                      <img :src="getPicUrl(comment.headPic)" alt="" class="userFace">
                    </div>
                  </div>
                  <div class="comment_img_wrap">
                    <img
                      class="previewImages"
                      :src="getPicUrl(comment.content)"
                      @click="comPreviewImg"
                      v-picfix
                    >
                  </div>
                </div>
              </li>
              <!-- 观众文字评论 -->
              <li
                v-else-if="comment.isTeacher === 0 && comment.type === 1"
                class="userComment clearfix"
                :key="comment.id"
              >
                <div><span class="userName">{{comment.creator}}</span></div>
                <div class="breakWorld">
                  <div class="userInfo fl clearfix">
                    <div class="userFace_wrap fl">
                      <img
                        class="userFace"
                        :src="getPicUrl(comment.headPic)"
                        v-picfix
                      >
                    </div>
                  </div>
                  <div class="userContent fl one_word_wrap">{{comment.content}}</div>
                </div>
              </li>
              <!-- 观众图片评论 -->
              <li
                v-else-if="comment.isTeacher === 0 && comment.type === 2"
                class="userComment clearfix"
                :key="comment.id"
              >
                  <div><span class="userName">{{comment.creator}}</span></div>
                  <div class="breakWorld">
                    <div class="clearfix mb10">
                      <div class="userFace_wrap fl">
                        <img :src="getPicUrl(comment.headPic)" alt="" class="userFace">
                      </div>
                    </div>
                    <div class="comment_img_wrap">
                      <img
                        class="previewImages"
                        :src="getPicUrl(comment.content)"
                        @click="comPreviewImg"
                        v-picfix
                      >
                    </div>
                  </div>
                </li>
              <!-- 评论时间 -->
              <li v-else class="comTime" :key="comment.id">{{comment.time}}</li>

            </template>
          </ul>
        </div>
        <div class="comment_height"></div>
      </div>
    </div>

    <!-- 底部评论框 -->
    <div class="foot_wrap">
      <div class="comment_wrap flex_box">
        <input
          v-model="chatInputData.value"
          class="comment_content flex_item"
          type="text"
          @focus="showChat"
          @click="showChat"
        >
        <span class="send_btn" @click="buttonClick">{{$t('i18n.sendComment')}}</span>
      </div>
    </div>

    <!-- 评论弹框 -->
    <chat-input
      v-bind="chatInputData"
      :autofocus.sync="autofocus"
      ref="chatInput"
      @closeChat="hideChat"
      @updateContent="updateContent"
    >
    </chat-input>

    <!-- 图片预览 -->
    <preview-images :urls="previewURL"></preview-images>

  </div>
</template>

<script>
// 直播播放器js
// import '../../js/plugin/live_connect.js';
import '@/assets/js/emojify.min.js';
import { mapState, mapActions } from 'vuex';
import { formatDate, newDateObj } from '../../../../assets/js/time-util';
import { sendComment } from '../../api/getData';
import { smile_array, codeToWord, imgToCode } from '@/utils/emoji';
import chatInput from '@/components/detail/chatInput';
import previewImages from '@/components/detail/previewImages';
import EventBus from '@/utils/eventBus';

export default {
  name: 'LivePlay',
  components: {
    chatInput,
    previewImages
  },
	data() {
		return {
      liveId: '',
			minuteTimer: null, // 学习时长定时器
			commentONoff: false, // 加载评论标志，当正在加载评论时为true
			startTime: '', // 获取的最后一条评论的时间,第一次进入时直接获取当前时间
			commentTime: '', // 评论时间，每5分钟有新评论时更新为新评论的时间
      onlineNum: 0,     // 在线人数
      chatList: [],    // 评论列表
      chatInputData: { // 评论组件数据
        dataBase: dataBase,
        show: false,
        agent: 'agent',
        value: '',
        placeholder: '',
        showAt: false,
        showBiaoQing: true,
        showTuPian: true,
      },
      previewURL: [],
      autofocus: false, //评论框是否聚焦
		}
	},
	computed: {
		...mapState([
			'livePlayData',
		]),
		winHeight() {
			return window.innerHeight + 'px';
		},
		commentHeight() {
			return window.innerHeight - 303 + 'px';
		},
		headPic() {
			if (this.livePlayData.teacher) {
				let headPic = this.livePlayData.teacher.headPic;
				return headPic.includes('http') ? headPic : _.compressURL + headPic;
			}
		},
		getNowTime() {
			let currentTime = new Date();
			let endTime = formatDate(currentTime, 'yyyy-MM-dd hh:mm:ss');
			return endTime;
		}
	},
	created() {
		this.startTime = this.getNowTime;
    this.liveId = this.$route.query.id;
		this.getLivePlay(this.liveId).then(() => {
			//创建播放器对象
			const player = new qcVideo.Player("id_video_container", {
				"live_url": `http://${this.livePlayData.bizid}.liveplay.myqcloud.com/live/${this.livePlayData.liveId}.m3u8`,
				"width": 480,
				"height": 320,
				"x5_type": "h5",
				"x5_fullscreen": false
			});

      // 设置在线人数
      this.onlineNum = this.livePlayData.online;

      //评论数据
      this.startTime = this.getNowTime;

      //第一次获取评论时候加个参数1，获取前十条评论
      this.loadComment(1);
      setInterval(() => {
          this.loadComment();
      }, 30000);

			// 学习时长统计
			if (this.livePlayData.isTarget) {
				this.countLearnTime();
			}

		});
	},
  // 离开页面前清除定时器
	beforeRouteLeave(to, from, next) {
		clearInterval(this.minuteTimer);
		next();
	},
	methods: {
		...mapActions([
			'getLivePlay',
      'recordLive',
      'getLiveComment',
      'sendLiveComment'
		]),
    // 得到正确的图片URL
    getPicUrl(url) {
      return typeof url === 'string' ? url.includes('http') ? url : _.compressURL + url : url;
    },
		// 统计学习时长
		countLearnTime() {
			this.minuteTimer = setInterval(() => {
        this.recordLive(this.liveId).then((data) => {
          // 如果已经完成则清除定时器
          data.isFinish && clearInterval(this.minuteTimer);
        })
			}, 60000);
		},
		// 加载评论
		loadComment(first = '') {
			if (!this.commentONoff) {
				this.commentONoff = true;
        // 获取评论
        this.getLiveComment({
          liveId: this.liveId,
					'searchValue.beginTime': this.startTime,
					'isFirst': first
        }).then(data => {
          let commentList = data.pageData;
          if (commentList && commentList.length > 0) {
            //获取最新评论中第一条的时间
            let lastComTime = commentList[0].createTime;

            // 如果是第一条评论，或者则跟上次评论的时间间隔是否超过5分钟
            if (this.commentTime == '' || this.compareTime(this.commentTime, lastComTime)) {
              this.chatList.push({
                isTeacher: -1,
                time: lastComTime
              });
              this.commentTime = lastComTime;
            }
            this.chatList.push(...commentList);
            // 如果有图片，则插入预览数组
            for (let i in commentList) {
              if(commentList[i].type === 2) {
                this.previewURL.push({
                  picPath: this.getPicUrl(commentList[i].content)
                });
              }
            }

            this.$nextTick(() => {
              // 获取后滚动到底部
              this.$refs.commentArea.scrollTop = this.$refs.commentArea.scrollHeight;
            })

            //返回最后一条评论的时间
            this.startTime = commentList[commentList.length - 1].createTime;
          }
          this.dealEmojify();
          this.commentONoff = false;
        });

			}
		},
    // 计算secondTime 是否大于 firstTime5分钟之后
    compareTime(firstTime, secondTime) {
      let timeA = newDateObj(firstTime);
      let timeB = newDateObj(secondTime);
      const DIVIDE_TIME = 5 * 60 * 1000;
      return timeB.getTime() > (timeA.getTime() + DIVIDE_TIME) ? true : false;
    },
    // 显示评论弹框
    showChat() {
      this.chatInputData.show = true;
      this.autofocus = true;
    },
    // 隐藏评论弹框
    hideChat(val) {
      this.autofocus = false;
      this.chatInputData.show = false;

      // 底部评论赋值
      this.chatInputData.value = val;
    },
    // 底部发表评论
    buttonClick() {
      this.$refs.chatInput.buttonClick();
    },
    // 发送评论
    updateContent(data) {
      this.sendLiveComment({
        'liveComment.liveId': this.liveId,
        'liveComment.content': data.content,
        'liveComment.type': data.type
      }).then(() => {
        this.chatInputData.value = '';
        this.loadComment();
      });
    },
    // 处理emoji表情
    dealEmojify() {
      this.$nextTick(() => {
        emojify.run(this.$refs.commentList);
      });
    },
    // 预览图片
    comPreviewImg(event) {
      EventBus.$emit('previewImages', event.target.currentSrc);
    }
	},
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-livePlay {
    .livePlay_wrap {
        position: relative;
        width: 100%;
        height: 210px;
        background: #555;
        overflow: hidden;
        .liveView_area {
            width: 100%;
            height: 210px;
        }
        .playInfo {
            position: absolute;
            top: 14px;
            right: 15px;
            max-width: 150px;
            height: 31px;
            padding: 0 23px 2px 3px;
            line-height: 31px;
            border-radius: 16px;
            background: rgba(0,0,0,.4);
            overflow: hidden;
            z-index: 2;
            .face_wrap {
                width: 30px;
                height: 30px;
                margin-right: 5px;
                border-radius: 50%;
                overflow: hidden;
                .userFace {
                    width: 29px;
                    height: 29px;
                    border-radius: 50%;
                }
            }
            .info_wrap {
                .name {
                    max-width: 112px;
                    color: #fff;
                    font-size: 13px;
                    line-height: 18px;
                    overflow: hidden;
                }
                .online {
                    font-size: 11px;
                    line-height: 12px;
                    color: #fff;
                }
            }
        }
    }
    .comment_wrap {
        .comment_bar {
            height: 46px;
            padding-left: 15px;
            line-height: 46px;
            background: #fff;
            .comment_title {
                font-size: 16px;
                color: #333;
            }
        }
        .comment_area {
            height: 297px;
            padding: 0 12px 3px;
            background: #fff;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            .comments_list {
                .comTime {
                    margin-bottom: 15px;
                    padding-top: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                }
                .teacherComment {
                    margin-bottom: 20px;
                    .breakWorld {
                        flex-direction: row-reverse;
                    }
                    .teacherContent {
                      flex: 1;
                      padding: 5px 12px;
                      background: #45a8f5;
                      line-height: 20px;
                      border-radius: 15px;
                      color: #fff;
                      word-break: break-word;
                    }
                    .userFace_wrap {
                        margin-left: 5px;
                    }
                }
                .userComment {
                    margin-bottom: 20px;
                    .userName {
                        margin-left: 50px;
                        color: #999;
                    }
                    .userContent {
                        padding: 5px 12px;
                        background: #f5f5f5;
                        line-height: 20px;
                        border-radius: 15px;
                        color: #333;
                    }
                    .userFace_wrap {
                        margin-right: 5px;
                    }
                }
                .emoji {
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  margin-top: -4px;
                }
                .breakWorld {
                    display: -webkit-flex;
                    word-wrap: break-word;
                }
                .userFace_wrap {
                    flex: 0 1 30px;
                    width: 30px;
                    overflow: hidden;
                    .userFace {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                    }
                }
                .comment_img_wrap {
                    width: 90px;
                    height: 120px;
                    overflow: hidden;
                    border-radius: 4px;
                }
            }
        }
        .comment_height {
            width: 100%;
            height: 51px;
            background: #f5f5f5;
        }
    }
    .foot_wrap {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 50px;
        width: 100%;
        background: #fff;
        z-index: 1;
        border-top: 1px solid rgba(215, 215, 217, 1);
        // @include border-t-1px(RGBA(215, 215, 217, 1));
        .comment_wrap {
          padding: 7px 10px;
          .comment_content {
            height:34px;
            padding-left: 10px;
            margin-right: 10px;
            line-height: 34px;
            background:rgba(252,252,252,1);
            border: 1px solid RGBA(221, 221, 221, 1);
            border-radius:4px;
          }
          .send_btn {
            flex: 0 0 53px;
            width:53px;
            height:34px;
            line-height: 34px;
            background:rgba(251,250,252,1);
            border: 1px solid rgba(214, 213, 214, 1);
            border-radius:4px;
            text-align: center;
          }
        }
    }
}
</style>
