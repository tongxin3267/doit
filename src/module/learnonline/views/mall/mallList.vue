<template lang="html">
  <div class="qwui-mallList">
    <template v-for="mallSection in mallListData">
      <section
        class="list_section"
        v-if="mallSection.subjectList.length > 0"
        :key="mallSection.id"
      >
        <h1>{{mallSection.name}}</h1>
        <ul class="list">
          <router-link
            class="mall_item"
            v-for="mallItem in mallSection.subjectList"
            :key="mallItem.subjectId"
            :to="{ name: 'mall_detail', query: {id: mallItem.subjectId} }"
            tag="li"
          >
            <div class="mall_cover">
              <div class="cover_wrap">
                <img
                  v-picfix
                  class="cover"
                  v-if="getCoverUrl(mallItem.subjectCover)"
                  :src="getCoverUrl(mallItem.subjectCover)"
                  @error="errorClearCover(mallItem)"
                >
              </div>
            </div>
            <div class="item_content">
              <h2 class="item_title tworows_ellipsis">{{mallItem.subjectName}}</h2>
              <div class="item_info clearfix">
                <p class="learn_num">
                  <i class="iconfont icon-peixunxuexi_renshu"></i>
                  {{mallItem.studyTime + $t('i18n.hasStudy')}}
                </p>
                <span v-if="mallItem.priceStr != 0" key="cost" class="item_cost item_unfree">￥{{mallItem.priceStr | parsePrice}}/{{$t('i18n.personPerYear')}}</span>
                <span v-else key="free" class="item_cost item_free">{{$t('i18n.free')}}</span>
              </div>
            </div>
          </router-link>
        </ul>
      </section>
    </template>

    <!--没有数据-->
    <no-record
      :setTop=false
      :hasrecord="hasRecord"
    >
    </no-record>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import noRecord from '@/components/base/no_record' // 暂无数据组件

export default {
  name: 'MallList',
  components: {
    noRecord
  },
  filters: {
    parsePrice(value) { // 价格处理，非0元则处理返回，否则返回免费
      return value.includes('.00') ? value.replace('.00', '') : value;
    }
  },
  data() {
    return {
      hasRecord: dataBase.mallList.hasRecord,
    }
  },
  computed: {
    ...mapState([
      'mallListData'
    ])
  },
  created() {
    this.getMallList().then((data) => {
      // 检查是否无数据
      for(let i in this.mallListData) {
        if(this.mallListData[i].subjectList && this.mallListData[i].subjectList.length > 0) {
          return false;
        }
      }
      // 显示无数据提示
      this.hasRecord.show = true;
    });
  },
  methods: {
    ...mapActions([
      'getMallList'
    ]),
    getCoverUrl(url) {
      return url ? _.compressURL + url : url;
    },

    // 优化 在网络获取不到图片时也设置空，避免边框出现
    errorClearCover(mallItem) {
      mallItem.subjectCover = '';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-mallList {
  font-weight: 400;
  .list_section {
    padding: 0 15px 25px 15px;
    background: #fff;

    &:last-of-type  {
      padding-bottom: 15px;
    }

    h1 {
      height: 48px;
      line-height: 60px;
      font-size: 20px;
      font-weight: 600;
      color: #333
    }
    .list {
      .mall_item {
        padding: 12px 0;
        .mall_cover {
          @include cover-wrap('../../../../assets/images/default_bg.png');
          border-radius: 5px;
          .cover_wrap {
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .item_content {
          .item_title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }
          .item_info {
            font-size: 13px;
            color: #999;
            .learn_num {
              .iconfont {
                font-size: 12px;
              }
            }
            .item_cost {
              font-size: 14px;
            }
            .item_unfree {
              color: rgba(250, 144, 37, 1);
            }
            .item_free {
              color: rgba(69, 168, 245, 1);
            }
          }
        }
        /* 列表第一个项 */
        &:nth-child(1) {
          display: block;
          .mall_cover {
            margin-bottom: 6px;
          }
          .item_content {
            .item_title {
              margin-bottom: 2px;
            }
            .item_info {
              .learn_num {
                float: left;
                .iconfont {
                  font-size: 14px;
                }
              }
              .item_cost {
                float: right;
              }
            }
          }
        }
        /* 列表除第一个之外的项 */
        &:not(:nth-child(1)) {
          display: flex;
          justify-content: space-between;
          .mall_cover {
            flex: 0 0 160px;
            height: 89px;
            padding-top: 0;
            margin-right: 10px;
            .cover_wrap {
              position: relative;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
          }
          .item_content {
            flex: 1 1 auto;
            .item_title {
              position: relative;
              height: 40px;
              padding-top: 6px;
              line-height: 20px;
              overflow: hidden;
            }
            .item_info {
              .learn_num {
                margin-bottom: 2px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
