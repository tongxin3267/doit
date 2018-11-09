<template>
    <div class="wrap qwui-learn_scoreDetail">
      <header>
        <div class="total_score">
          <div class="title">
            {{$t('i18n.totalScore')}}
          </div>
          <div class="score">
            {{studentCredit.totalCredit}}
          </div>
          <div class="score_detail qwui-flexbox">
            <div class="detail_item qwui-flexItem">
              <div class="item_score"
                   :class=" studentCredit.creditOrder < 0 ? 'item_score_init' : ''"
              >
                {{studentCredit.creditOrder < 0 ? $t('i18n.initing') : studentCredit.creditOrder}}
              </div>
              <div class="item_text">{{$t('i18n.rank')}}</div>
            </div>
            <div class="detail_item qwui-flexItem">
              <div class="item_score">{{studentCredit.learnCredit}}</div>
              <div class="item_text">{{$t('i18n.learnCredit')}}</div>
            </div>
            <div class="detail_item qwui-flexItem">
              <div class="item_score">{{studentCredit.examCredit}}</div>
              <div class="item_text">{{$t('i18n.examCredit')}}</div>
            </div>
          </div>
        </div>
      </header>
      <section>
        <!--明细列表-->
        <div class="detail_list"
             ref="listSection"
             :style="{height: (docViewHeight-150)+'px'}"
             v-scroll="scrollFun"
        >
          <div class="list_item"
               v-for="item in listData"
               :key="item.objId"
          >
            <div class="item_icon"
                 :class="item.isExam ? 'exam_icon' : 'course_icon'"
            ></div>
            <div class="item_score"
                 :class="item.isClean ? 'item_score_clean' : ''"
            >
              {{item.isClean ? $t('i18n.creditClean') : '+'+item.credit}}
            </div>
            <div class="item_detail">
              <div class="detail_title ellipsis">{{item.objName}}</div>
              <div class="detail_date">{{item.gainTime.substring(0,10)}}&nbsp;&nbsp;{{item.gainTime.substring(11)}}</div>
            </div>
          </div>
          <!--加载更多-->
          <load-more v-show="maxPage>0"
                     :loading="loading"
                     :currPage="page"
                     :maxPage="maxPage"
                     @loadMoreClick="loadMore">
            <span>{{ $t('i18n.nomore') }}</span>
          </load-more>
        </div>
      </section>
    </div>
</template>

<script>
import { scoreDetail } from '../../api/getData'
import loadMore from '@/components/list/load_more';
export default {
  name: 'scoreDetail',
  components: {
    loadMore
  },
  data() {
    return {
      //列表数据
      listData: [],
      //学生学分
      studentCredit: {
        totalCredit: '',
        creditOrder: '',
        examCredit: '',
        learnCredit: '',
      },
      lock_roll: false,
      page: 1,
      loading: false,
      maxPage: 0,
      totalCourses: 0
    }
  },
  computed: {
    docViewHeight () {
      return window.innerHeight;
    },
  },
  created () {
    this._getScoreDetail();
  },
  methods: {
    //请求列表数据
    _getScoreDetail () {
      return scoreDetail({
        page : this.page,
      }, data => {
        let listData = this.listData;
        if(this.page === 1){
          this.maxPage = data.maxPage;
          this.studentCredit.totalCredit = data.studentCreditVO.totalCredit;
          this.studentCredit.creditOrder = data.studentCreditVO.creditOrder;
          this.studentCredit.examCredit = data.studentCreditVO.examCredit;
          this.studentCredit.learnCredit = data.studentCreditVO.learnCredit;
        }
        if(data.maxPage === data.currPage){
          this.totalCourses = data.totalRows;
        }
        this.lock_roll = false;
        this.loading = false;
        listData.push.apply(listData, data.pageData);
      });
    },
    scrollFun () {
      let listSection = this.$refs.listSection;
      let height = listSection.offsetHeight;
      let scrollTop = listSection.scrollTop;
      let docHeight = listSection.scrollHeight;
      if(scrollTop + height >= docHeight){
        if(!this.lock_roll && this.page<this.maxPage){
          this.lock_roll = true;
          this.loadMore();
        }
      }
    },
    loadMore () {
      this.page++;
      this.loading = true;
      this._getScoreDetail();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';
.qwui-learn_scoreDetail {
  overflow-y: hidden;
  font-weight: 500;
  background-color: #fff;
  .total_score {
    position: relative;
    width: 100%;
    height: 150px;
    background: linear-gradient(#5077AA,#3D7ED2);
    padding-top: 20px;
    box-sizing: border-box;
    .title {
      font-size: 13px;
      line-height: 13px;
      color: #fff;
      text-align: center;
    }
    .score {
      font-size: 40px;
      line-height: 40px;
      color: #fff;
      text-align: center;
      margin-top: 15px;
    }
    .score_detail {
      position: absolute;
      top: 110px;
      left: 15px;
      z-index: 3;
      width: 92%;
      height: 80px;
      padding-top: 22px;
      border-radius:5px;
      box-sizing: border-box;
      box-shadow: 2px 0px 10px rgba(76,78,81,0.11);
      background-color: #fff;
      .detail_item {
        text-align: center;
        &:not(:last-of-type) {
         @include border-r-1px(#EBEBEB);
         &::after {
             top: 7px;
             height: 30px;
           }
        }
         .item_score {
           font-size: 20px;
           line-height: 20px;
           color: #333;
           &.item_score_init {
              font-size: 14px;
              padding-left: 13px;
            }
         }
         .item_text {
           font-size: 13px;
           line-height: 13px;
           color: #999;
           margin-top: 12px;
         }
      }
    }
  }
  .detail_list {
    padding: 59px 0 0 15px;
    overflow-y: auto;
    box-sizing: border-box;
    .list_item {
      width: 100%;
      height: 65px;
      padding-top: 15px;
      box-sizing: border-box;
      @include border-b-1px(#E5E5E5);
      .item_icon {
        float: left;
        width: 34px;
        height: 34px;
        &.exam_icon {
           background: url("../../../../assets/images/exam_score.png") no-repeat;
           background-size: contain;
        }
        &.course_icon {
           background: url("../../../../assets/images/course_score.png") no-repeat;
           background-size: contain;
        }
      }
      .item_score {
        float: right;
        font-size: 20px;
        line-height: 20px;
        color: #333;
        margin: 7px 16px 0 0;
      }
      .item_score_clean {
        font-size: 14px;
        color: #999;
      }
      .item_detail {
        margin-left: 46px;
        .detail_title {
          max-width: 235px;
          font-size: 16px;
          line-height: 16px;
          color: #333;
          font-weight: 400;
        }
        .detail_date {
          font-size: 12px;
          line-height: 12px;
          color: #999;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
