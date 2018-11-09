<template>
  <div class="wrap qwui-lean_task_list">
    <header>
      <div class="head">
        <div class="head_fl" @click="cateShowChange">
          <span class="fl_all">
            <span>{{cateType}}</span>
            <i :class="{fl_icon_close : !cateShow , fl_icon_open : cateShow}"></i>
          </span>
        </div>
        <div class="head_fr">
          <span class="fr_item"
                v-for = "(item, index) in orderItems"
                :class = "{active : index === (orderItem-1)}"
                @click = "orderChange(index)"
                :key="item.id"
          >
            {{$t(item.text)}}
          </span>
        </div>
        <div class="head_catalog"
             v-if="cateShow"
        >
          <div class="cata_content clearfix">
            <ul class="content_fl"
                :style="{maxHeight: (docViewHeight-105)+'px'}"
                ref = "categoryLeft"
            >
              <li class="fl_item"
                  :class="{active : index === cateIndex}"
                  v-for="(item , index) in courseCateCategory"
                  @click="categoryChange(index)"
                  :key="item.id"
              >
                {{item.category}}
              </li>
            </ul>
            <ul class="content_fr" :style="{maxHeight: (docViewHeight-105)+'px'}">
              <li class="fr_type">
                <ul>
                  <li class="type_item"
                      @click="cateTagChange()"
                      :class="{active : cateTag === undefined}"
                  >
                    <div class="item_text ellipsis">{{$t('i18n.all')}}</div>
                  </li>
                  <li class="type_item"
                      v-for="(item, index) in courseCateCategory[cateIndex].categoryVOList"
                      @click="cateTagChange(index)"
                      :class="{active : cateTag === index}"
                      :key="item.id"
                  >
                    <div class="item_text ellipsis">{{item.category}}</div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="qwui-flexbox cata_foot">
            <span class="qwui-flexItem foot_btn">
              <span class="btn btn_reset" @click="resetCategory">
                {{$t('i18n.reset')}}
              </span>
            </span>
            <span class="qwui-flexItem foot_btn">
              <span class="btn btn_summit" @click="chooseCategory">
                {{$t('i18n.confirm')}}
              </span>
            </span>
          </div>
        </div>
        <div class="head_mask"
             :style ="{height: (docViewHeight-45)+'px'}"
             v-if="cateShow"
        ></div>
      </div>
    </header>
    <section>
      <div class="wrap_inner"
           :style="{height: docViewHeight+'px'}"
           v-scroll="scrollFun"
           ref="wrapInner"
      >
        <div v-if="!hasRecord.show">
          <div class="head_height"></div>
          <div class="content">
            <ul class="content_list">
              <learn-item
                :itemCover="learnItem.subjectCover"
                :itemName="learnItem.subjectName"
                coverClass="courselist_type"
                :toRoute="{ name: 'course_detail', params: {}, query: {id: learnItem.id} }"
                v-for="learnItem of compulsoryCourse"
                :key="learnItem.id"
              >
                <div class="cover_info"
                     slot="cover_info"
                     v-if="isMust"
                >
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
          </div>
          <!--加载更多-->
          <load-more v-show="maxPage>0"
                     :loading="loading"
                     :currPage="page"
                     :maxPage="maxPage"
                     @loadMoreClick="loadMore">
            <span>{{ $t('i18n.total') + totalCourses + $t('i18n.course') }}</span>
          </load-more>
        </div>
        <div class="no_record"
             v-else
        >
          <!--没有数据-->
          <no-record
            :setTop=true
            :hasRecord="hasRecord"
          >
          </no-record>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import learnItem from '../../components/LearnItem';
import { getCourseListData, getCourseCategory } from "../../api/getData";
import circularProgress from '../../components/CircularProgress';
import { newDateObj } from '../../../../assets/js/time-util';
import noRecord from '@/components/base/noRecord' // 暂无数据组件
import loadMore from '@/components/list/load_more';

  export default {
    name: 'learningTaskList',
    components: {
      learnItem,
      circularProgress,
      noRecord,
      loadMore
    },
    filters: {
      dateFormat(val) {
        return val ? val.substr(0, 10) : '';
      },
    },
    data() {
        return {
          //当前点击的目录
          cateIndex: 0,
          //当前点击的目录id
          cateId: '',
          //当前点击目录中的标签,点击全部标签cateTag为undefined
          cateTag: undefined,
          //目录的显示隐藏
          cateShow: false,
          //目录的名称
          cateType: this.$t('i18n.all'),
          //必学课课程
          compulsoryCourse: [],
          //课程目录
          courseCateCategory : [],
          /*database配置数据*/
          hasRecord:{
            show: false,
            icon: 'qwui-icon_text',
            title: this.$t('i18n.noCourse'),
            text: this.$t('i18n.taskNoCourseTips')
          },
          //加载中
          loading: false,
          //防止下拉多次加载
          lock_roll:false,
          //当前课程最多几页
          maxPage: 0,
          /*database配置数据end*/
          orderItem: 1,//当前排序的方式
          //排序功能数组
          orderItems: [
            {
              id: 1,
              text: 'i18n.smartSort'
            },
            {
              id: 2,
              text: 'i18n.newest'
            },
            {
              id: 3,
              text: 'i18n.hottest'
            }
          ],
          //当前页面
          page: 1,
          //中共多少门课程
          totalCourses: 0,
          //分类的总数
          totalCateLength : 0,
        }
    },
    computed: {
      docViewHeight () {
        return window.innerHeight;
      },
      isMust () {
        return Number(this.$route.params.isMust);
      },
      //屏幕最多可以展示多少个目录中的li标签
      maxCateLi () {
        return Math.floor((this.docViewHeight - 105)/45);
      },
    },
    beforeCreate () {
      if(Number(this.$route.params.isMust)) {
        document.title = this.$t('i18n.mustLearn');
      }else{
        document.title = this.$t('i18n.choseLearn');
      }
    },
    created () {
      this._getCourseListData();
      //获取课程目录
      getCourseCategory({}, data => {
        this.totalCateLength = data.categoryList.length;
        let courseCateCategory = this.courseCateCategory;
        courseCateCategory.push.apply(courseCateCategory, data.categoryList);
      });
    },
    methods: {
      /**
       * 获取全部课程列表
       * @return {Promise}           promise对象
       */
      _getCourseListData () {
        return getCourseListData({
          categoryId : this.cateId,
          page : this.page,
          pageSize : 10,
          "searchValue.isMust" : this.isMust,
          "searchValue.order" : this.orderItem
        }, data => {
          this.maxPage = data.maxPage;
          this.totalCourses = data.totalRows;
          this.lock_roll = false;
          this.loading = false;
          if(this.page === 1){
            this.compulsoryCourse = [];
          }
          // 尽量避免用 length和重新赋值对象可能不会触发视图更新
          let compulsoryCourse = this.compulsoryCourse;
          compulsoryCourse.push.apply(compulsoryCourse, data.page);
          // 完全没有课程，显示无课程
          if (compulsoryCourse.length === 0) {
            this.$set(this.hasRecord, "show", true);
          } else {
            this.$set(this.hasRecord, "show", false);
          }
        })
      },
      //目录点击事件
      categoryChange (index) {
        //缓存上一次的目录
        let preCateIndex = this.cateIndex;
        this.cateIndex = index;
        //分类目录改变，标签默认为全部
        if(preCateIndex !== this.cateIndex){
          this.cateTag = undefined;
        }
      },
      //目录中的标签点击事件
      cateTagChange (index) {
        index === undefined ? this.cateTag = undefined : this.cateTag = index;
      },
      //目录的显示隐藏
      cateShowChange () {
        this.cateShow = !this.cateShow;
        this.$nextTick(() => {
          //只有当目录出现滚动条才自动移动滚动条
          if(this.totalCateLength > this.maxCateLi && this.cateShow) {
            let numTop = Math.floor(this.maxCateLi / 2);
            let numBottom = this.maxCateLi - numTop;
            //目录的前几个和最后面一个根据之前的滚动位置滚动
            if(this.cateIndex < numTop) {
              this.$refs.categoryLeft.scrollTo(0, 0);
            }else if(this.cateIndex > (this.totalCateLength-numBottom)) {
              this.$refs.categoryLeft.scrollTo(0, (this.totalCateLength * 45+105-this.docViewHeight));
            }else {//中间被点击过的目录始终定位到滚动条中部
              this.$refs.categoryLeft.scrollTo(0, (this.cateIndex-numTop) * 45);
            }
          }
        });
      },
      //确定按钮
      chooseCategory () {
        this.page = 1;
        this.cateShow = !this.cateShow;
        if(this.cateTag === undefined){
          this.cateId = this.courseCateCategory[this.cateIndex].id;
          this.cateType = this.courseCateCategory[this.cateIndex].category;
        }else{
          this.cateId = this.courseCateCategory[this.cateIndex].categoryVOList[this.cateTag].id;
          this.cateType = this.courseCateCategory[this.cateIndex].categoryVOList[this.cateTag].category;
        }
        this._getCourseListData();
      },
      // 获取状态
      getStatus (item) {
        return this.isLearnEnd(item.endTime) ? this.$t('i18n.ended') : item.learnState === 5 ? this.$t('i18n.completed') : this.$t('i18n.taskStudied') + `${item.rate}%`;
      },
      // 是否已结束, 已结束返回true
      isLearnEnd(endTimeStr) {
        if (endTimeStr !== '') {
          let time = newDateObj(endTimeStr.substr(0, 19));
          let now = new Date();
          return time.getTime() + (24*60*60 - 1) * 1000 - now.getTime() < 0; //加上23小时59分59秒 服务器返回的是今天时间 0时0分
        } else {
          return false;
        }
      },
      //点击加载更多
      loadMore () {
        this.page++;
        this.loading = true;
        this._getCourseListData();
      },
      //不同类型的排序
      orderChange (index) {
        if(this.orderItem !== (index+1)){
          this.orderItem = index+1;
          if(!this.cateShow){
            this.page = 1;
            this._getCourseListData();
          }
        }
      },
      //重置按钮
      resetCategory () {
        this.page = 1;
        this.cateShow = false;
        this.cateTag = undefined;
        this.cateId = '';
        this.cateIndex = 0;
        this.cateType = this.$t('i18n.all');
        this._getCourseListData();
      },
      //滚动加载更多
      scrollFun () {
        let wrapInner = this.$refs.wrapInner;
        let scrollTop = wrapInner.scrollTop;
        let docHeight = wrapInner.scrollHeight;
        let screenHeight = this.docViewHeight;
        if(scrollTop + screenHeight >= docHeight) {
          if(!this.lock_roll && this.page<this.maxPage){
            this.lock_roll = true;
            this.loadMore();
          }
        }
      },

      // 必学剩余天数描述赋值
      initTimeDesc(timeStr) {
        let endTimeStr = timeStr.substr(0, 19);
        let time = newDateObj(endTimeStr);
        let now = new Date();
        let intervalDate = time.getTime() - now.getTime();
        let intervalDays = Math.floor(intervalDate / (24 * 3600 * 1000)) + 1;
        return intervalDays > 0 ? this.$t('i18n.remain') + intervalDays + this.$t('i18n.day'): '';
      },
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-lean_task_list {
    font-size: 14px;
    .head {
      position: absolute;
      width: 100%;
      height: 45px;
      z-index: 10;
      background-color: #F2F3F5;
      .head_fl {
        float: left;
        .fl_all {
          position: relative;
          height: 45px;
          line-height: 45px;
          margin-left: 15px;
        }
        .fl_icon_close {
          position: absolute;
          top: 6px;
          right: -20px;
          border-style: solid;
          border-color: transparent;
          border-width: 6px 5px;
          border-top-color: #9B9B9B;
        }
        .fl_icon_open {
          position: absolute;
          top: -1px;
          right: -20px;
          border-style: solid;
          border-color: transparent;
          border-width: 6px 5px;
          border-bottom-color: #9B9B9B;
        }
      }
      .head_fr {
        float: right;
        .fr_item {
          display: inline-block;
          height: 45px;
          line-height: 45px;
          margin-right: 19px;
          &:last-child {
            margin-right: 15px;
          }
          &.active {
             color: #5691C6;
          }
        }
      }
      .head_catalog {
        position: absolute;
        top: 45px;
        left: 0;
        width: 100%;
        clear: both;
        background-color: #fff;
        z-index: 2;
        .cata_content {
          overflow:hidden;
          .content_fl {
            float: left;
            width: 30%;
            background-color: #EFEFF4;
            overflow-y: auto;
            .fl_item {
              height: 45px;
              line-height: 45px;
              text-align: center;
              &.active {
                background-color: #fff;
              }
            }
          }
          .content_fr {
            float: right;
            width: 70%;
            overflow-y: auto;
            .fr_type {
              padding: 10px 4%;
              .type_item {
                display: inline-block;
                min-width: 76px;
                max-width: 132px;
                border-radius: 15px;
                margin: 0 2px 10px;
                &:nth-child(2n+1) {
                   margin: 0 25px 10px 10px;
                }
                &.active {
                   background-color: #f5f5f5;
                }
                .item_text {
                  height: 23px;
                  line-height: 23px;
                  margin: 2px 10px;
                  text-align: center;
                  cursor: pointer;
                }
              }
            }
          }
        }
        .cata_foot {
          clear: both;
          height: 60px;
          background-color: #fff;
          box-shadow:1px 0px 0px #eee;
          .foot_btn {
            &:first-child {
               padding: 8px 7px 8px 15px;
             }
            &:last-child {
               padding: 8px 15px 8px 8px;
             }
            box-sizing: border-box;
            .btn{
              display: inline-block;
              width: 100%;
              height: 42px;
              line-height: 42px;
              text-align: center;
              border-radius: 5px;
              &.btn_reset {
                border: 1px solid #D6D5D6;
                background-color: #FBFAFC;
              }
              &.btn_summit {
                color: #fff;
                border: 1px solid #0D68C6;
                background-color: #2F7DCD;
              }
            }
          }
        }
      }
      .head_mask {
        position: absolute;
        top: 45px;
        width: 100%;
        z-index: 1;
        background-color: #999;
      }
    }
    .wrap_inner {
      position: relative;
      width: 100%;
      background-color: #fff;
      overflow-y: auto;
      .head_height {
        width: 100%;
        height: 45px;
      }
      .content {
        margin: 0 15px;
        font-size: 12px;
        .content_list {
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
      .no_record {
        position: absolute;
        width: 100%;
        top: 0;
        height: 100%;
        background-color: #F5F5F5;
      }
    }
  }
</style>

