<template lang="html">
  <div class="main livePlay_list">
    <!-- 正在直播 -->
    <section class="list_wrap" v-if="liveListData.livingList && liveListData.livingList.length != 0">
        <div class="list_bar">
          <h1 class="list_type">{{$t('i18n.living')}}</h1>
        </div>
        <ul class="list_content">
          <learn-item
            :itemCover="liveItem.liveCover"
            :itemName="liveItem.liveName"
            :toRoute="{ name: 'live_detail', params: {}, query: {id: liveItem.id} }"
            v-for="liveItem of liveListData.livingList"
            :key="liveItem.id"
          >
            <div class="cover_info" slot="cover_info">
              <div class="watchNum_wrap info_wrap">
                <i class="iconfont icon-peixunxuexi_renshu"></i>
                <span class="watch_num">{{liveItem.online}}</span>
              </div>
            </div>
            <div class="list_living" slot="item_status">
              <i class="iconfont icon-peixunxuexi_zhibozhong"></i>
              <span>{{$t('i18n.liveplaying')}}</span>
            </div>
          </learn-item>
        </ul>
    </section>

    <!-- 即将开始 -->
    <section class="list_wrap" v-if="liveListData.willLiveList && liveListData.willLiveList.length != 0">
      <div class="list_bar">
        <h1 class="list_type">{{$t('i18n.willbegin')}}</h1>
      </div>
      <ul class="list_content">
        <learn-item
          :itemCover="liveItem.liveCover"
          :itemName="liveItem.liveName"
          :toRoute="{ name: 'live_detail', params: {}, query: {id: liveItem.id} }"
          v-for="liveItem of liveListData.willLiveList"
          :key="liveItem.id"
        >
          <div class="list_will" slot="item_status">
            <span class="iconfont icon-peixunxuexi_shijian"></span>
            <span class="list_time">{{liveItem.startTime}}</span>
          </div>
        </learn-item>
      </ul>
    </section>

    <!-- 精彩回放 -->
    <section class="list_wrap" v-if="liveListData.endLiveList && liveListData.endLiveList.length != 0">
      <div class="list_bar">
        <h1 class="list_type">{{$t('i18n.replay')}}</h1>
      </div>
      <ul class="list_content">
        <learn-item
          :itemCover="liveItem.liveCover"
          :itemName="liveItem.liveName"
          :toRoute="{ name: 'live_detail', params: {}, query: {id: liveItem.id} }"
          v-for="liveItem of liveListData.endLiveList"
          :key="liveItem.id"
        >
          <div class="list_replay" slot="item_status">
            <span class="iconfont icon-peixunxuexi_shijian"></span>
            <span class="list_time">{{liveItem.startTime}}</span>
          </div>
        </learn-item>
      </ul>
    </section>

    <!-- 无数据处理 -->
    <div class="noCourse"
      v-if="liveListData.endLiveList
      && liveListData.endLiveList.length == 0
      && liveListData.livingList.length == 0
      && liveListData.willLiveList.length == 0"
    >
      <span class="readImg"></span>
      <div class="noCourse-title">{{$t('i18n.noliveNow')}}</div>
      <p class="noCourse-described">{{$t('i18n.noCourseTips')}}</p>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import learnItem from '../../components/LearnItem';

export default {
  name: 'LiveList',
  components: {
    learnItem
  },
  data() {
    return {
      coverWidth: 0,
      coverHeight: 0
    }
  },
  computed: {
    ...mapState([
      'liveListData'
    ]),
  },
  created() {
    this.getLiveList();
  },
  methods: {
    ...mapActions([
      'getLiveList'
    ]),
  }
}
</script>

<style lang="scss" scoped>
.livePlay_list {
  .list_wrap {
    padding: 0 15px 10px 15px;
    background-color: #fff;
    &:last-of-type  {
      padding-bottom: 0;
    }

    .list_bar {
      width: 100%;
      height: 46px;
      line-height: 60px;
      .list_type {
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
    }
    .list_content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .info_wrap {
        position: absolute;
        bottom: 2px;
        font-size: 12px;
        color: #fff;
      }
      .watchNum_wrap {
        right: 8px;
      }
      & /deep/ {
        .cover_info{
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 35px;
          background: linear-gradient(to top, rgba(1,1,1,.12), rgba(1,1,1,0))
        }
        .stopTime_wrap {
          left: 8px;
        }
      }
    }
  }
}

// 正在直播的
.list_living>* {
  font-size: 12px;
  color: rgba(69, 168, 245, 1)
}

// 即将开始的
.list_will {
  .list_time {
    font-size: 12px;
    color: #999;
  }
  .iconfont {
    font-size: 14px;
    color: rgba(69, 168, 245, 1);
  }
}

// 精彩回放的
.list_replay {
  line-height: 14px;
  .list_time {
    font-size: 12px;
    color: #999;
  }
  .iconfont {
    font-size: 14px;
    color: rgba(217, 217, 217, 1);
  }
}

.noCourse {
  margin-top: 150px;
  text-align: center;
  .readImg {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url(../../../../assets/images/noCourse.png) no-repeat;
    background-size: 100% 100%;
  }
  .noCourse-title {
    margin-top: 10px;
    font-size: 20px;
    color: #666;
  }
  .noCourse-described {
    padding-top: 10px;
    font-size: 14px;
    color: #bbb;
  }
}

</style>
