<template>
  <div class="qwui-lean_task">
    <!-- 必学课 -->
    <section class="course_list_wrap" v-if="compulsoryCourse.length">
      <div class="course_list_head qwui-flexbox">
        <span class="qwui-flexItem">{{$t('i18n.mustLearn')}}</span>
        <span class="arrow_icon" @click="toCourseMore(1)">
          <i class="qwui-icon_arrow_fr icon_gray"></i>
        </span>
      </div>
      <ul class="list_content">
        <learn-item
          :itemCover="learnItem.subjectCover"
          :itemName="learnItem.subjectName"
          coverClass="courselist_type"
          :toRoute="{ name: 'course_detail', params: {}, query: {id: learnItem.id} }"
          v-for="learnItem of compulsoryCourse"
          :key="learnItem.id"
        >
          <div class="cover_info" slot="cover_info">
            <p class="info_wrap stopTime_wrap">
              {{learnItem.endTime | dateFormat}}&nbsp;{{$t('i18n.asOf')}}&nbsp;&nbsp;&nbsp;{{initTimeDesc(learnItem.endTime)}}
            </p>
          </div>
          <div class="item_state" slot="item_status">
            <circular-progress
              :targetId="learnItem.id"
              :proGress="isLearnEnd(learnItem.endTime) ? 0 : learnItem.rate"
              :size="14"
              :borderSize="2"
            >
            </circular-progress>
            <span :class="['status', isLearnEnd(learnItem.endTime) ? 'learn_end': 'learn_unend']">
              {{getStatus(learnItem)}}
            </span>
          </div>
        </learn-item>
      </ul>
    </section>

    <!-- 选学课 -->
    <section class="course_list_wrap" v-if="electiveCourse.length">
      <div class="course_list_head qwui-flexbox">
        <span class="qwui-flexItem">{{$t('i18n.choseLearn')}}</span>
        <span class="arrow_icon" @click="toCourseMore(0)">
          <i class="qwui-icon_arrow_fr icon_gray"></i>
        </span>
      </div>
      <ul class="list_content">
        <learn-item
          :itemCover="learnItem.subjectCover"
          :itemName="learnItem.subjectName"
          coverClass="courselist_type"
          :toRoute="{ name: 'course_detail', params: {}, query: {id: learnItem.id} }"
          v-for="learnItem of electiveCourse"
          :key="learnItem.id"
        >
          <div class="item_state" slot="item_status">
            <circular-progress
              :targetId="learnItem.id"
              :proGress="isLearnEnd(learnItem.endTime) ? 0 : learnItem.rate"
              :size="14"
              :borderSize="2"
            >
            </circular-progress>
            <span :class="['status', isLearnEnd(learnItem.endTime) ? 'learn_end': 'learn_unend']">
              {{getStatus(learnItem)}}
            </span>
          </div>
        </learn-item>
      </ul>
    </section>

    <!--没有数据-->
    <no-record
      :hasrecord="hasRecord"
    >
    </no-record>
    <!--登陆后台提示会话框-->
    <dialog-group
      class="dialog"
      :show="dialogShow"
      @confirm="dialogConfirm"
      :title="$t('i18n.backstageTitle')"
      :confirmText="$t('i18n.iKnow')"
    >
      <p class="dialog-content">{{$t('i18n.taskPhoneTips')}}</p>
      <p class="dialog-content">{{$t('i18n.loginBackground')}}<br>https://work.weixin.qq.com/login</p>
    </dialog-group>
  </div>
</template>

<script>
import NoRecord from '@/components/base/no_record' // 暂无数据组件
import DialogGroup from '@/components/base/dialog/dialog-group'; // 弹窗组件
import LearnItem from '../../components/LearnItem';
import CircularProgress from '../../components/CircularProgress';
import { portalCourseInit, getCoursesData, getIsRemind, closeGuideDialog} from "../../api/getData";
import { formatDate, newDateObj } from '../../../../assets/js/time-util';

export default {
  name: 'learningTasks',
  components: {
    NoRecord,
    DialogGroup,
    LearnItem,
    CircularProgress
  },
  filters: {
    dateFormat(val) {
      return val ? val.substr(0, 10) : '';
    },
  },
  data() {
    return {
      /*database配置数据*/
      hasRecord: dataBase.learningTasks.hasRecord,
      moreCourseUrl: dataBase.learningTasks.moreCourseUrl,
      /*该组件使用数据*/
      compulsoryCourse: [], // 必学课课程
      electiveCourse: [], // 选学课课程
      dialogShow: false, // 前往后台会话框显示标志
      firstGetLearnTasks: true // 第一次请求数据标志 用来判断是否需要显示前往后台会话框
    };
  },
  mounted() {
    //初始化开课信息 ,初始化完, 无论结果(按原版写的)直接请求课程
    portalCourseInit({}, this._getCoursesData);
  },
  methods:{
    /**
      * 获悉学习任务的课程
      * @return {Promise}           promise对象
      */
    _getCoursesData() {
      getCoursesData({}, data => {
        // 尽量避免用 length和重新赋值对象可能不会触发视图更新
        let compulsoryCourse = this.compulsoryCourse,
            electiveCourse = this.electiveCourse;

        compulsoryCourse.push.apply(compulsoryCourse, data.mustCourse);
        electiveCourse.push.apply(electiveCourse, data.mustNotCourse);

        // 第一次获取课程后 需要判断是否显示【前往后台弹窗提示】
        if (this.firstGetLearnTasks) {
          this.firstGetLearnTasks = false;
          this._getIsRemind(electiveCourse.length);
        }

        // 完全没有课程，显示无课程
        if (compulsoryCourse.length === 0 && electiveCourse.length === 0) {
          this.hasRecord.show = true;
        } else {
          this.hasRecord.show = false;
        }
      });
    },

    /**
     * 获取标志, 判断是否显示【前往后台弹窗提示】
     * @return {Promise}           promise对象
     */
    _getIsRemind(courseLength) {
      return new Promise((resolve, reject) => {
        getIsRemind({agentCode: dataBase.wxqyh_uploadfile.agent}, data => {
            if (data.isRemind) {
              if(courseLength < 5){
                this.dialogShow = true;
              } else {
                closeGuideDialog({agentCode: dataBase.wxqyh_uploadfile.agent});
              }
            }
            resolve();
        });
      });
    },

    /**
    * 将前往后台的提示回话隐藏
    */
    dialogConfirm() {
      this.dialogShow = !this.dialogShow;
      closeGuideDialog({agentCode: dataBase.wxqyh_uploadfile.agent}); // 【前往后台的提示回话】关闭反馈给服务器。
    },

    /**
     * 更多课程跳转
     * @param {String} index 0:必学课 1:选学课
     */
    toCourseMore(index) {
      this.$router.push({ name: 'task_list', params: { isMust : index } });
    },

    /**
     * 判断课程是否已经结束
     * @param  {String}  endTimeStr 结束时间
     * @return {Boolean}            结束了返回true，否则false
     */
    isLearnEnd(endTimeStr) {
      if (endTimeStr !== '') {
        let time = newDateObj(endTimeStr.substr(0, 19)),
            now = new Date();
        return time.getTime() + (24*60*60 - 1) * 1000 - now.getTime() < 0; //加上23小时59分59秒 服务器返回的是今天时间 0时0分
      } else {
        return false;
      }
    },

    /**
     * 获取课程状态文字
     * @param  {Object} item 课程
     * @return {String}      课程状态描述文字
     */
    getStatus(item) {
      return  this.isLearnEnd(item.endTime)? this.$t('i18n.ended'):
              item.learnState === 5? this.$t('i18n.completed'): this.$t('i18n.taskStudied') + `${item.rate}%`;
    },

    /**
     * 必学剩余天数描述赋值
     * @param  {String} endTimeStr  结束时间文本
     * @return {String}             结束时间描述
     */
    initTimeDesc(timeStr) {
      let endTimeStr = timeStr.substr(0, 19),
          time = newDateObj(endTimeStr),
          now = new Date(),
          intervalDate = time.getTime() - now.getTime(),
          intervalDays = Math.floor(intervalDate / (24 * 3600 * 1000)) + 1;
      return intervalDays > 0 ? this.$t('i18n.remain') + intervalDays + this.$t('i18n.day'): '';
    },
  }
};

</script>

<style lang="scss" scoped>

  .qwui-lean_task {
    margin-top: 43px; // 外部搜索框的高度
    
    .course_list_wrap {
      padding: 0 15px 20px 15px;
      background: #fff;
      &:last-of-type {
        padding-bottom: 10px;
      }

      .course_list_head {
        padding-top: 12px;
        font-size: 20px;
        font-weight: 600;
        line-height: 38px;
        color: #333;

        .arrow_icon {
          padding: 19px 0 0 50px;
        }
      }
      .list_content{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        & /deep/ {
          .cover_info{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 35px;
            background: linear-gradient(to top, rgba(1,1,1,.12), rgba(1,1,1,0))
          }
          .info_wrap {
            position: absolute;
            bottom: 2px;
            font-size: 12px;
            color: #fff;
          }
          .stopTime_wrap {
            left: 8px;
          }
          .watchNum_wrap {
            right: 8px;
          }
          .learn_unend{
            color: #45A8F5;
          }
          .learn_end{
            color: #999;
          }
          .status {
            margin-left: 4px;
            vertical-align: top;
            line-height: 14px;
          }
        }
      }
    }
    .dialog {
      .dialog-content {
        margin: 15px 0;
        font-size: 14px;
        color: #9b9b9b;
        line-height: 24px;
        text-align: left;
      }
    }
  }
</style>
