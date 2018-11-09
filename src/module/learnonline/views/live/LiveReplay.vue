<!-- 回放间 -->
<template lang="html">
  <div class="wrap qwui-livePlay">
    <div class="wrap_inner" :style="{ height: winHeight }">

      <!-- 播放区域 -->
      <div class="livePlay_wrap">
        <div
          id="id_video_container"
          class="liveView_area"
          ref="liveView_area"
        ></div>
        <div class="playInfo clearfix">
          <div class="face_wrap fl">
            <img class="userFace" :src="headPic" alt="" >
          </div>
          <div class="info_wrap fl">
            <p class="name ellipsis">{{this.replayData.teacher && this.replayData.teacher.userName}}</p>
          </div>
        </div>
      </div>

      <!-- 选集区域 -->
      <div class="chose_wrap" v-if="liveLength >= 2">
            <div class="chose_title clearfix">
                <span class="fl title_tip">{{$t('i18n.choseEpisode')}}</span>
                <span class="fr blockSum">{{$t('i18n.total') + liveLength + $t('i18n.episode')}}</span>
            </div>
            <div class="choseBlock clearfix">
              <div class="lineBlock" :style="{width: lineBlockWidth}">
                <a
                  :class="['block', {'active': index === currentIndex - 1}]"
                  @click="choseVideo(index)"
                  v-for="(video, index) in replayData.video"
                  :key="video.id"
                >
                  {{index + 1}}
                </a>
              </div>
            </div>
            <div class="divide_line"></div>
        </div>

      <!-- 互动区域 -->
      <div class="comment_wrap">
        <div class="comment_bar">
          <span class="comment_title">{{$t('i18n.interactiveArea')}}</span>
        </div>
        <div class="comment_area" :style="{ height: commentHeight }" ref="commentArea">
          <!-- 评论列表 -->
          <ul class="comments_list" ref="commentList">
            <template v-for="comment in chatList">
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
// 腾讯点播播放器js
import '@/assets/js/emojify.min.js';
import { mapState, mapActions } from 'vuex';
import { formatDate, newDateObj } from '../../../../assets/js/time-util';
import { recordReplayFlow, recordLiveTime } from '../../api/getData';
import { smile_array, codeToWord, imgToCode } from '@/utils/emoji';
import chatInput from '@/components/detail/chatInput';
import previewImages from '@/components/detail/previewImages';
import EventBus from '@/utils/eventBus';

export default {
  name: 'replayRoom',
  components: {
    chatInput,
    previewImages
  },
	data() {
		return {
      player: null, // 播放器对象
      liveId: '',
      liveLength: 0, // 共多少集
      totalFlow: 0, // 总流量
      currentIndex: -1, // 当前选中第几集 (1-无穷)
			minuteTimer: null, // 学习时长定时器
      flowTimer: null, // 记录流量定时器
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
      previewURL: [], // 预览图片的url数组
      autofocus: false, //评论框是否聚焦
      flowId: '', // 流量id
      isFinish: false, // 课程是否已完成
		}
	},
	computed: {
		...mapState([
			'replayData',
		]),
		winHeight() {
			return window.innerHeight + 'px';
		},
		commentHeight() {                           // 需要判断有无选集
      return this.liveLength >= 2 ? window.innerHeight - 414 + 'px' : window.innerHeight - 309 + 'px';
		},
    lineBlockWidth() { // 选集div宽度
       return 65 * this.liveLength + 'px'
    },
		headPic() {
			if (this.replayData.teacher) {
				let headPic = this.replayData.teacher.headPic;
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
		this.initData('created');
	},
  // 离开页面前清除定时器
	beforeRouteLeave(to, from, next) {
    clearInterval(this.minuteTimer);
		clearInterval(this.flowTimer);
		next();
	},
  beforeRouteUpdate(to, from, next) {
    this.initData();
    next();
  },
	methods: {
		...mapActions([
			'getReplay',
      'recordLive',
      'getLiveComment',
      'sendLiveComment'
		]),
    // 初始化
    initData(status) {
      // 如果是换集则销毁上一个播放器
      this.player && this.player.destroy();
      // 数据初始化
      let self = this;
      this.liveId = this.$route.query.id;
  		this.getReplay(this.liveId).then((pageData) => {
  			//选集相关
        this.currentIndex = this.$route.query.num || 1;
        let liveNum = this.currentIndex;
  			//视频总大小,和url
  			let url;
  			if (liveNum >= 0) {
  				url = pageData.video[liveNum - 1].url;
  				this.totalFlow = pageData.video[liveNum - 1].totalFlow;
  			} else {
  				url = pageData.video[0].url;
  				this.totalFlow = pageData.video[0].totalFlow;
  			}
        // 总共多少集
  			this.liveLength = pageData.video.length;

        this.player = new TcPlayer('id_video_container', {
          "m3u8": url, //请替换成实际可用的播放地址
          "flash": false,
          "live": false, // 点播
          "autoplay": true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
          "width": '100%', //视频的显示宽度，请尽量使用视频分辨率宽度
          "height": '210', //视频的显示高度，请尽量使用视频分辨率高度
          "controls": "system",
          listener: function(msg) {
  					//暂停或者结束
  					if (msg.type == 'ended' || msg.type == 'pause') {
  						clearInterval(self.minuteTimeer);
  						clearInterval(self.flowTimer);
  						//播放中
  					} else if (msg.type == 'play') {
  						//扣除流量请求
  						self.flowTimer = setInterval(() => {
                recordReplayFlow({
                  liveId: self.liveId,
                  id: self.flowId,
                  fromTime: self.startTime,
                  flow: 60 / this.duration() * self.totalFlow,
                }, data => {
                  this.flowId = data.id;
                })
  						}, 60000);

  						//学习时长统计
  						if (!self.isFinish && self.replayData.isTarget) {
                self.countLearnTime();
  						}
  					}
          }
        });

        // 评论数据
        // 如果不是点击选集的初始化
        if (status === 'created') {
          this.startTime = this.getNowTime;
          this.loadComment(1);
        }

        //第一次获取评论时候加个参数1，获取前十条评论
        setInterval(() => {
            this.loadComment();
        }, 30000);

  		}).catch((err) => {
        if(err && err.code == '290012') {
          this.$router.back();
        } else {
          throw(err);
        }
      });
    },
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
    },
    // 点击选集
    choseVideo(index) {
      if (index !== this.currentIndex - 1) {
        this.$router.replace({
          name: 'live_replay',
          query: {
            num: index + 1,
            id: this.liveId
          }
        });
      }
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
    .chose_wrap {
      background-color: #fff;
      .chose_title {
        padding: 15px;
        .title_tip {
          font-size: 16px;
        }
        .blockSum {
          font-size: 13px;
          color: #999;
        }
      }
      .choseBlock {
        width: 100%;
        overflow-x: auto;
        .lineBlock {
          padding: 0 15px 15px;
          .block {
            display: inline-block;
            width: 53px;
            height: 34px;
            margin-right: 10px;
            line-height: 34px;
            border: 1px solid #d6d5d6;
            border-radius: 6px;
            color: #000;
            font-size: 18px;
            background: #fbfafc;
            text-align: center;
            cursor: pointer;
          }
          .active {
            color: #45a8f5;
          }
        }
      }
      .divide_line {
        margin: 0 15px;
        @include border-b-1px(#ddd);
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
                    .teacherContent{
                      flex: 1;
                      padding: 5px 12px;
                      background: #45a8f5;
                      line-height: 20px;
                      border-radius: 15px;
                      color: #fff;
                      word-break: break-word;
                    }
                    .userFace_wrap{
                        margin-left: 5px;
                    }
                }
                .userComment {
                    margin-bottom: 20px;
                    .userName {
                        margin-left: 47px;
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
                    word-wrap: break-word
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
            width:290px;
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
