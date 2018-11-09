<template>
  <div class="qwui-lean_search_live">
    <!-- 正在直播 -->
    <section class="list_wrap" v-if="contentData.livingList && contentData.livingList.length != 0">
        <div class="list_bar">
          <h1 class="list_type">{{$t('i18n.living')}}</h1>
        </div>
        <ul class="list_content">
          <learn-item
            :itemCover="liveItem.liveCover"
            :itemName="liveItem.liveName"
            :toRoute="{ name: 'live_detail', params: {}, query: {id: liveItem.id} }"
            v-for="liveItem of contentData.livingList"
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
    <section class="list_wrap" v-if="contentData.willLiveList && contentData.willLiveList.length != 0">
      <div class="list_bar">
        <h1 class="list_type">{{$t('i18n.willbegin')}}</h1>
      </div>
      <ul class="list_content">
        <learn-item
          :itemCover="liveItem.liveCover"
          :itemName="liveItem.liveName"
          :toRoute="{ name: 'live_detail', params: {}, query: {id: liveItem.id} }"
          v-for="liveItem of contentData.willLiveList"
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
    <section class="list_wrap" v-if="contentData.endLiveList && contentData.endLiveList.length != 0">
      <div class="list_bar">
        <h1 class="list_type">{{$t('i18n.replay')}}</h1>
      </div>
      <ul class="list_content">
        <learn-item
          :itemCover="liveItem.liveCover"
          :itemName="liveItem.liveName"
          :toRoute="{ name: 'live_detail', params: {}, query: {id: liveItem.id} }"
          v-for="liveItem of contentData.endLiveList"
          :key="liveItem.id"
        >
          <div class="list_replay" slot="item_status">
            <span class="iconfont icon-peixunxuexi_shijian"></span>
            <span class="list_time">{{liveItem.startTime}}</span>
          </div>
        </learn-item>
      </ul>
    </section>
  </div>
</template>

<script>
import learnItem from '../../components/LearnItem';

export default {
  name: 'SearchLive',
  components: {
    learnItem
  },
  props: {
    contentData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      coverWidth: 0,
      coverHeight: 0
    };
  },
  methods: {
    // 更改無數據顯示標志
    changeHasRecord() {
      let showHasRecord = this.contentData.endLiveList.length == 0 &&
                          this.contentData.livingList.length == 0 &&
                          this.contentData.willLiveList.length == 0? true: false;
      this.$emit('listenToSearchContent', showHasRecord);
    }
  }
}
</script>

<style lang="scss" scoped>
  .qwui-lean_search_live {
    background: #fff; // 产品说不要间隙出现透明，全改白色好，所以和蓝湖不太一样。
    overflow-y: scroll;
    .list_wrap {
      padding: 0 15px;
      margin-bottom: 10px;
      background-color: #fff;

      &:last-of-type {
        margin-bottom: 0;
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
    .list_time {
      font-size: 12px;
      color: #999;
    }
    .iconfont {
      font-size: 14px;
      color: rgba(217, 217, 217, 1);
    }
  }
</style>
