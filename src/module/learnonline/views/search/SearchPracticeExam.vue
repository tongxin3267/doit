<template>
  <div class="qwui-lean_practice_exam" @click="enterDetal(exam.id)">
    <div class="clearfix">
      <p><span class="exam_state" v-if="exam.inTheExam && examState">{{examState}}</span><span class="exam_name">{{exam.examName}}</span></p>
      <div class="qwui-flexbox">
        <!-- 时间信息 -->
        <div class="qwui-flexItem">
          <p class="exam_time" v-if="coursesTabIndex == 0">{{$t('i18n.cutTime')}}<i class="iconfont icon-peixunxuexi_shijian"></i> {{startTime}} {{$t('i18n.to')}} {{exam.lastStartTime|filterEndTime}}</p>
          <p class="exam_time" v-else><i class="iconfont icon-peixunxuexi_shijian"></i>{{finishTime}}</p>
          <p class="exam_duration">{{$t('i18n.testLength')}}{{filterDuration(exam.duration)}}</p>
        </div>

        <!-- 不通/通过提示 -->
        <div v-if="typeof exam.isPass!='undefined'" class="exam_pass_state" :class="{exam_pass: isPass==$t('i18n.pass')}">
          <div class="exam_pass_container" :class="{exam_pass: isPass==$t('i18n.pass')}">
            <div class="exam_pass_center">

              <!-- 未考 -->
              <div v-if="!exam.finishTime ">
                <div class="exam_pass_desc_big">{{$t('i18n.hasNotTest')}}</div>
              </div>

              <!-- 已考，显示分数状态 -->
              <div v-else-if="exam.isAppraise==2">
                <div v-if="showExamScore" class="exam_score">
                  {{Math.round(exam.score)}}
                </div>
                <div :class="['exam_pass_desc',{exam_pass_desc_middle: !showExamScore}]">{{isPass}}</div>
              </div>

              <!-- 未阅 -->
              <div v-else-if="exam.isAppraise==0">
                <div class="exam_pass_desc_big">{{$t('i18n.hasNotRead')}}</div>
              </div>

              <!-- 阅卷中 -->
              <div v-else>
                <div class="exam_pass_desc_big">{{$t('i18n.readIng')}}</div>
              </div>

            </div>
          </div>
        </div>

      </div>
      <p class="exam_explain">{{exam.examExplain}}</p>
      <div class="exam_img_list clearfix" v-if="exam.picList.length">
        <div class="exam_img_item" v-for="imgItem in exam.picList">
          <img class="exam_img" :src="imgItem.picPath|filterImg"></div>
      </div>

      <!-- 考试/再次考试按钮 -->
      <div
        v-if="buttonExamText"
        class="exam_button"
        :class="buttonClass"
        @click.stop="enterExam"
      >{{buttonExamText}}</div>

      <!-- 查看结果按钮 -->
      <div
        v-if="buttonAnswerText"
        class="exam_button exam_button_answer"
        @click.stop="enterAnswer"
      >{{buttonAnswerText}}</div>




    </div>
  </div>
</template>

<script>
export default {
  name: 'QwSearchPracticeExam',
  components: {
  },
  props: {
    exam: {
      type: Object,
      required: true
    },
    coursesTabIndex: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
    };
  },
  computed:{
    // 按钮的样式
    buttonClass() {
      return {
        exam_button_wait: this.buttonExamText == this.$t('i18n.testNoBegin'),
        exam_button_continue: this.buttonExamText == this.$t('i18n.goonTest')
      };
    },

    // 小标签的文字 如答题中
    examState() {
      let time, // 截至时间- 时长 - 当前时间
          state = '';
      if (this.exam.inTheExam) {
        if (this.exam.duration == "0") {
          state = this.$t('i18n.testing');
        } else {
          if (this.exam.lastStartTime) { // 在考试时间内
            time = new Date(this.exam.lastStartTime.replace(/-/g, "/")).getTime() + this.exam.duration * 60 * 1000 - new Date().getTime();
          } else {
            // 上次考试时间 + 考试时长 > 当前时间 证明在考试时间内
            time = new Date(this.exam.answerTime.replace(/-/g, "/")).getTime() + this.exam.duration * 60 * 1000 - new Date().getTime();
          }
          state = time > 0? this.$t('i18n.testing'): ''; // 后者为考试时间过了, 为再次考试了。

        }
      }
      return state;
    },

    // 考试已完成的时间
    finishTime() {
      let finishTime = this.exam.finishTime;
      return finishTime? ' ' + finishTime.toUpperCase().substr(5, 15) + this.$t('i18n.handOver'): ' ' + this.$t('i18n.hasNotTest');
    },

    // 查看按钮的文字
    buttonAnswerText() {
      return this.exam.answerId? this.$t('i18n.watchResult'): '';
    },

    // 考试按钮的文字
    buttonExamText() {
      let resiterFalg, time, // 与当前时间的比较
          buttonExamText = '';

      if (this.coursesTabIndex) { // 已完成
        //如果已阅卷
        if(this.exam.isAppraise == 2 || this.exam.finishTime == '') {
            resiterFalg = this.checkTime(this.exam.resitStartTime, this.exam.resitEndTime);
            //如果考试还没结束
            if(this.exam.examStatus == 1) {
                //如果可以考试
                if(this.exam.hasNext) {
                    buttonExamText = this.$t('i18n.againTest');
                }
            } else if(this.exam.examStatus == 2) {
                //如果后台在处理中
                if(this.exam.resitGetting != 5) {
                  buttonExamText = this.exam.finishTime? this.$t('i18n.fixTestNoBegin'): this.$t('i18n.backgroundDealing');
                } else {
                    //补考未开始
                    if(resiterFalg == 0 && this.exam.hasNext) {
                        buttonExamText = this.$t('i18n.fixTestNoBegin');
                        //补考进行时
                    } else if(resiterFalg == 1) {
                      buttonExamText = this.exam.hasNext? this.$t('i18n.fixTest'): this.$t('i18n.againTest');
                    }
                }
            }
        }

        // 如果有已完成的考试
        if (this.exam.finishTime) {

        }

      } else { // 待考试
        if (this.exam.inTheExam) {
          if (this.exam.duration == "0") {
            buttonExamText = this.$t('i18n.goonTest');
          } else {

            if (this.exam.lastStartTime) { // 在考试时间内
              time = new Date(this.exam.lastStartTime.replace(/-/g, "/")).getTime() + this.exam.duration * 60 * 1000 - new Date().getTime();
            } else {
              time = new Date(this.exam.answerTime.replace(/-/g, "/")).getTime() + this.exam.duration * 60 * 1000 - new Date().getTime();
            }
            buttonExamText =  time > 0? this.$t('i18n.goonTest'):
                          this.exam.answerId? this.$t('i18n.watchResult'):
                          this.$t('i18n.againTest');

          }

        } else {
          time = new Date(this.exam.startTime.replace(/-/g, "/")).getTime() - new Date().getTime();
          buttonExamText = time > 0? this.$t('i18n.testNoBegin'): this.$t('i18n.test');
        }

      }

      return buttonExamText;
    },

    // 开始时间
    startTime() {
      return this.exam.startTime? this.exam.startTime.toUpperCase().substr(11, 15): this.exam.createTime.toUpperCase().substr(11, 15);
    },

    // 是否显示分数
    showExamScore() {
      return this.exam.isViewScore == "1" ||
      (this.exam.isViewScore=="2"&&this.exam.this.examStatus=="2") ||
      this.exam.isViewScore=="3";
    },

    // 是否通过文本
    isPass () {
      return this.exam.isPass == "1"? this.$t('i18n.pass'): this.$t('i18n.unPass');
    }
  },
  created() {
  },
  methods:{

    // 判断时间是否在区间
    checkTime(start, end) {
        let resiterFalg = -1;
        if (start == "" || end == "") return false;
        let startTime = start.replace(new RegExp("-","gm"),"/");
        let startTimeHaoMiao = (new Date(startTime)).getTime(); //得到毫秒数
        let endTime = end.replace(new RegExp("-","gm"),"/");
        let endTimeHaoMiao = (new Date(endTime)).getTime(); //得到毫秒数
        let nowHaoMiao = (new Date()).getTime(); //得到毫秒数
        if(nowHaoMiao > endTimeHaoMiao) {
            resiterFalg = 2;
        } else if(nowHaoMiao < startTimeHaoMiao) {
            resiterFalg = 0;
        } else if(nowHaoMiao < endTimeHaoMiao && nowHaoMiao > startTimeHaoMiao) {
            resiterFalg = 1;
        }
        return resiterFalg;
    },

    // 进入查看结果
    enterAnswer() {
      window.location.href = _.baseURL + "/jsp/wap/examination/exam_result.jsp?id=" + this.exam.id + '&answerId=' + this.exam.answerId;
    },

    // 进入考试
    enterExam() {
      if (this.coursesTabIndex) { // 已完成
        // 有按钮代表可以点击进入考试
        window.location.href=_.baseURL+"/jsp/wap/examination/single_answer.jsp?id=" + this.exam.id;
      } else { // 待考试
        // if(this.isTimeOut(this.exam.startTime)) {  // 需改
        if (this.buttonExamText == this.$t('i18n.testNoBegin')) return;

        window.location.href=_.baseURL+"/jsp/wap/examination/single_answer.jsp?id=" + this.exam.id;
        // }
      }
    },

    // 进入详情
    enterDetal(examId) {
      window.location.href = _.baseURL + "/jsp/wap/examination/exam_detail.jsp?id=" + examId;
    },

    filterDuration(duration) {
      return duration == "0"? this.$t('i18n.noLimit'): duration + this.$t('i18n.minutes'); // 考试时长
    },
  },

  filters: {
    filterTime(time) { // 考试开始时分
      return time.toUpperCase().substr(11, 15);
    },
    filterEndTime(time) {
      return time? time.toUpperCase().substr(11, 15): '--';// 结束时分
    },
    filterImg(url) {
      return _.filterCompressURL(url)
    }
  }
};

</script>

<style lang="scss" scoped>
.qwui-lean_practice_exam {
  position: relative;
  padding: 10px 15px 14px 0;

  .exam_state {
    display: inline-block;
    width: 45px;
    height: 20px;
    margin-right: 6px;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    vertical-align: center;
    color: #fff;
    background: #f56262;
    border-radius: 2px;
  }
  .exam_name {
    color: #333;
    font-size: 17px;
    line-height: 21px;
    vertical-align: middle;
  }
  .exam_time {
    margin: 6px 0;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }
  .exam_duration {
    margin: 6px 0;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }
  .exam_explain {
    margin-bottom: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .exam_img_list {
    margin-bottom: 5px;
    .exam_img_item {
      float: left;
      margin: 0 10px 5px 0;
      .exam_img {
        width: 74px;
        height: 74px;
      }
    }
  }
  .exam_button {
    float: right;
    display: inline-block;
    height: 28px;
    margin-left: 10px;
    padding: 0 15px;
    font-size: 14px;
    color: #45a8f5;
    line-height: 28px;
    border: 1px #45a8f5 solid;
    border-radius: 4px
  }
  .exam_button_answer {
    color: #666;
    border: 1px #878787 solid;
  }
  .exam_button_wait {
    color: #ccc;
    border: 1px #ccc solid;
  }
  .exam_button_continue {
    color: #E94F4F;
    border:1px #D64949 solid;
  }

  .exam_pass_state {
    position: relative;
    width: 56px;
    height: 56px;
    font-weight: 500;
    text-align: center;
    background: #fff;
    border: 2px solid #999;
    border-radius: 50%;
    transform: rotate(-15deg);
  }
  /* exam_pass_container不包含进去exam_pass_state是为了exam_pass，防止优先级覆盖 */
  .exam_pass_container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border: 1px solid #999;
    border-radius: 50%;
    transform: translate(-50%, -50%);

    .exam_pass_center {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 54px;
      transform: translate(-50%, -50%);

      .exam_score {
        font-size: 20px;
      }
      .exam_pass_desc {
        font-size: 12px;
      }
      .exam_pass_desc_middle {
        font-size: 14px;
      }
      .exam_pass_desc_big {
        font-size: 16px;
      }
    }

  }
  .exam_pass {
    color: #468CEB;
    border-color: #468CEB;
  }
}
</style>
