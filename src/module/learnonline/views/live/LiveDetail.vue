<template lang="html">
  <div class="wrap qwui-liveDetail">
    <div class="wrap_inner" :style="{ height: winHeight }">

      <!-- 顶部直播信息 -->
      <div class="liveInfo_wrap">
        <div class="liveCover_wrap">
          <div class="cover_wrap">
            <img
              v-picfix
              v-if="getCoverUrl(liveDetailData.liveCover) != ''"
              :src="getCoverUrl(liveDetailData.liveCover)"
            />
          </div>
        </div>
        <div class="title_wrap">
          <h1 class="title one_word_wrap">{{liveDetailData.liveName}}</h1>
          <p class="time" v-if="!startTime.includes('NaN')">{{startTime}} {{$t('i18n.to')}} {{endTime}}</p>
        </div>
      </div>

      <!-- 直播简介和讲师简介 -->
      <div class="liveabout_wrap">
        <div class="course_wrap">
          <h2 class="about_introduce">{{$t('i18n.liveIntroduce')}}</h2>
          <div class="live_content one_word_wrap" v-html="liveDetailData.description">
          </div>
        </div>
        <div class="teacher_wrap">
          <h2 class="about_introduce">{{$t('i18n.teacherIntroduce')}}</h2>
          <teacher-info
            :headPic="teacher.headPic"
            :userName="teacher.userName"
            :position="teacher.position"
            :content="teacher.content"
          />
        </div>
      </div>

      <!-- 占位 -->
      <div class="btn_height"></div>

    </div>

    <!-- 底部按钮 -->
    <div class="join_btn" v-if="liveDetailData.state != -1 && isAbleJoin == 0">
      {{$t('i18n.fromLiveStart')}}：{{liveText}}
    </div>
    <div class="join_btn" v-if="liveDetailData.state != -1 && isAbleJoin == 1" @click="toLivePlay">
      {{$t('i18n.intoLive')}}
    </div>
    <div class="join_btn" v-if="liveDetailData.state == -1" @click="toReplay">
      {{$t('i18n.watchReplay')}}
    </div>

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatDate, newDateObj } from '../../../../assets/js/time-util';
import teacherInfo from '../../components/TeacherInfo';

export default {
  name: 'LiveDetail',
  components: {
    teacherInfo
  },
  data() {
    return {
      isAbleJoin: 0,
      liveText: '',
    }
  },
  computed: {
    ...mapState([
      'liveDetailData'
    ]),
    teacher() {
      return this.liveDetailData.teacherPO || {};
    },
    startTime() {
      let date = newDateObj(this.liveDetailData.startTime)
      return formatDate(date, 'yyyy年M月d日 hh:mm');
    },
    endTime() {
      let date = newDateObj(this.liveDetailData.endTime)
      return formatDate(date, 'yyyy年M月d日 hh:mm');
    },
    winHeight() {
      return window.innerHeight + 'px';
    },
  },
  created() {
    this.getLiveDetail(this.$route.query.id).then(() => {
      if (this.liveDetailData.state != -1) {
        let startTime = new Date(this.liveDetailData.startTime.replace(/\-/g, "/"));
        // 第一步：渲染一次时间
        this.reciprocalTime(startTime);
        let now = new Date();
        let computeTime = parseInt( (startTime.getTime() - now.getTime()) / 1000);       //以秒为单位
        // 计算还有多少秒就整一分钟
        let nextTime = computeTime % 60 + 1;
        // 第二步：等到刚好距离 整数分钟 的时候再渲染一次时间，并设置60秒定时器，每60秒渲染一次，减少性能消耗
        setTimeout(() => {
          this.reciprocalTime(startTime);
          let timer = setInterval(() => {
            //当满足距离10分钟内时清除定时器
            if (this.reciprocalTime(startTime)) {
              clearInterval(timer);
            }
          }, 60000);
        }, nextTime * 1000);
      }
    });
  },
  beforeDestroy() {
    // 组件销毁时将vuex中的数据清除，防止出现闪烁问题
    this.CLEAR_LIVE_DETAIL();
  },
  methods: {
    ...mapActions([
      // 获取详情数据
      'getLiveDetail'
    ]),
    ...mapMutations([
      'CLEAR_LIVE_DETAIL'
    ]),
    // 得到正确的封面图URL
    getCoverUrl(url) {
      return url ? _.compressURL + url : url;
    },
    // 进入直播页
    toLivePlay() {
      this.$router.push({name: 'live_play', query: {id: this.$route.query.id}});
    },
    // 进入回放页
    toReplay() {
      this.$router.push({name: 'live_replay', query: {id: this.$route.query.id}});
    },
    // 计算倒数时间
    reciprocalTime(startTime) {
      const ONE_HOUR =  60 * 60;
      const ONE_DAY =  ONE_HOUR * 24;
      let now = new Date();
      let computeTime = parseInt((startTime.getTime() - now.getTime()) / 1000);       //以秒为单位
      //如果距离直播还有10分钟(599秒)以上, 则不能进入直播
      if (computeTime > 599) {
        let day = Math.floor(computeTime / ONE_DAY);
        let hour = Math.floor((computeTime - ONE_DAY * day) / ONE_HOUR);
        let minute = Math.floor((computeTime - ONE_DAY * day - ONE_HOUR * hour) / 60);
        if (day == 0) {
          this.liveText = hour + this.$t('i18n.hour') + minute + this.$t('i18n.minute');
        } else {
          this.liveText = day + this.$t('i18n.day') + hour + this.$t('i18n.hour') + minute + this.$t('i18n.minute');
        }
      } else {
        this.isAbleJoin = 1;
        return true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-liveDetail {
  position: relative;
  height: 100%;
  overflow: hidden;
  .wrap_inner {
    position: relative;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .liveInfo_wrap {
    padding-bottom: 20px;
    margin-bottom: 10px;
    background-color: #fff;
    .liveCover_wrap {
      margin-bottom: 20px;
      @include cover-wrap('../../../../assets/images/ic-bg.png');
    }
    .title_wrap {
      padding: 0 15px;
      .title {
        margin-bottom: 10px;
        font-size: 19px;
        color: #333;
      }
      .time {
        font-size: 13px;
        color: #999;
      }
    }
  }
  .liveabout_wrap {
    padding: 15px;
    background: #fff;
    .about_introduce {
      font-size: 16px;
      color: #333;
      margin-bottom: 15px;
    }
    .course_wrap {
      padding-bottom: 15px;
      margin-bottom: 10px;
      @include border-b-1px(#ddd);
    }
  }
  .btn_height {
    width: 100%;
    height: 50px;
  }
  .join_btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 17px;
    text-align: center;
    color: #fff;
    background: rgba(47, 125, 205, 1);
    cursor: pointer;
  }
}
</style>
