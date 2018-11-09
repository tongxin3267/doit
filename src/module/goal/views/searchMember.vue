<template>
  <div class="wrap">
      <div class="success_tips" v-show="showTips">分配成功</div>
      <div>
        <search-box :searchinput="searchBar" @listenToSearchBox="showMsgFromSearchBox"></search-box>
      </div>
      <div class="member_list_wrap" v-scroll="loadMore">
        <ul class="member_list" v-show="!noRecord.show">
            <li class="list_item" v-for="(item,idx) in memberList" :key="idx">
                <div class="mr8">
                    <img :src="item.headPic" class="avator">
                </div>
                <div class="member_name">
                    <p>{{item.memberName}}</p>
                </div>
                <div class="assign_box">
                    <div :class="{assign_num_wrap:item.isEdit}">
                        <input :class="{assign_num:true, assign_num_inputed:item.isEdit}" type="text"
                        v-model="item.goalAmount" @focus="editGoal(idx)" @blur="blurInput(idx)"
                        @input="changeGoal(idx,$event)" maxlength="8">
                        <i class="edit_btn" v-show="!item.isEdit"></i>
                    </div>
                </div>
            </li>
        </ul>
        <no-record :hasrecord="noRecord"></no-record>
        <load-more :loading="loadingMore" :currPage="page" :maxPage="maxPage">
            <div class="member_tips">共 {{totalRows}}个成员</div>
        </load-more>
      </div>
      <div class="btn_wrap" v-show="isShowBtn">
          <div class="sure_btn" @click="sumbitGoal">确定</div>
      </div>
  </div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import loadMore from '@/components/list/load_more';
import noRecord from '@/components/base/no_record';
import { getMemberList, assignGoal } from '../api/getData';
import avator from '@/assets/images/touxiang02.png';
export default {
  data(){
    return {
      searchBar:{
        show:true,  //搜索框，默认显示
        keyWord:'',
        moreFunction:{
          show:false,
          option:[
            {name:'标题', callback:null, placeholder:'搜索标题'}
          ]
        }
      },
      countType: 1,  // 统计类型: 1月份 0季度
      goalId: '',  // 目标Id
      stage: 1,  // 月份或季度
      personName: '',  // 成员名称
      page: 1,  // 当前页数
      loadingMore: false,  // 是否正在加载
      memberList: [],  // 成员列表数据
      totalRows: 0,  // 总成员数
      maxPage: 0,  // 最大页数
      hasMore: true,  // 是否还有数据
      isShowBtn: false,  // 是否显示确定按钮
      noRecord:{  // 无记录配置
        show:false,
        title:"没有搜索到结果",
        icon:"qwui-icon_search",
        text:"",
        operation:{
            text:"",
            callBack:null
        }
      },
      showTips: false // 显示成功tips
    }
  },
  components: {
    searchBox,
    loadMore,
    noRecord
  },
  methods: {
    // 初始化
    init(){
      let { countType, goalId, stage } = this.$route.query;
      this.countType = countType;
      this.goalId = goalId;
      this.stage = stage;
    },

    // 获取成员列表
    getMemberList(){
        let obj = {
            goalId: this.goalId,
            stage: this.stage,
            countType: this.countType,
            personName: this.personName,
            page: this.page,
            pageSize: 20
        }
        this.loadingMore = true;
        getMemberList(obj, res => {
            let list = res.page.pageData;
            let arr = [];
            this.loadingMore = false;
            list.map((item,idx) => {
                let dataObj = {
                    userId: item.userId,
                    headPic: item.headPic != '0'? item.headPic : avator,
                    memberName: item.userName,
                    goalAmount: this.isOperate? this.goalAmount : item.goalAmount,
                    isEdit: false
                }
                arr.push(dataObj);
            });
            this.memberList = this.memberList.concat(arr);
            this.totalRows = res.page.totalRows;
            this.maxPage  = res.page.totalPages;
            this.hasMore = res.page.currentPage >= res.page.totalPages? false : true;
            if(this.totalRows > 0){
                this.isShowBtn = true;
                this.noRecord.show = false;
            }
            else{
                this.isShowBtn = false;
                this.noRecord.show = true;
            }
        })
    },

    //搜索关键字
    showMsgFromSearchBox(keyWord, val){
      this.personName = keyWord;
      this.isShowBtn = false;
      this.resetData();
      this.getMemberList();
    },

    // 加载更多成员列表
    loadMore(el){
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;

      if(scrollTop + offsetHeight == scrollHeight){
          if(this.hasMore && !this.loadingMore){
              this.page++;
              this.getMemberList();
          }
      }
    },

    // 编辑成员目标
    editGoal(idx){
        this.memberList[idx].isEdit = true;
    },

    // 离开光标
    blurInput(idx){
        this.memberList[idx].isEdit = false;
    },

    // 改变目标
    changeGoal(idx,e){
        // 只允许输入数字
        let val = e.target.value.replace(/[^\d.]/g,'');

        // 只能为一个小数点
        val = val.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
        this.memberList[idx].goalAmount = val;
    },

    // 重置
    resetData(){
        this.page = 1;
        this.memberList = [];
    },

    // 提交目标分配
    sumbitGoal(){
        let obj = {
            goalId: this.goalId,
            stage: this.stage,
            batch: 0
        }

        // 拼接json
        let jsonObj = {};
        let arr = [];
        this.memberList.map((item,idx) => {
            let dataObj = {
                userId: item.userId,
                goalAmount: item.goalAmount
            }
            arr.push(dataObj);
        });
        jsonObj.list = arr;
        obj.dataJson = JSON.stringify(jsonObj);

        assignGoal(obj, res => {
            this.alertTips();
            this.resetData();
            this.getMemberList();
        })
    },

    // 成功tips
    alertTips(){
        this.showTips = true;
        setTimeout(() => {
            this.showTips = false;
        },800)
    }

  },
  created() {
    _.hideLoading();
    this.init();
  },
  mounted () {
    // 计算成员列表高度
    let windowHeight = document.documentElement.clientHeight;
    document.querySelector(".member_list_wrap").style.height = windowHeight - 43 - 60 + 'px';
  }
}
</script>
<style scoped>
.mr8{
    margin-right: 0.67rem;
}
.member_list_wrap{
    overflow-y: auto;
    box-sizing: border-box;
}
.member_list{
    padding: 0 1.25rem;
    background: #fff;
    overflow: hidden;
}
.member_list li{
    padding: 0.83rem 0;
}
.member_list li:first-child{
    margin-top: 0.83rem;
}
.member_list li:last-child{
    margin-bottom: 0.83rem;
}
.btn_wrap{
    padding: 0.67rem 1.25rem;
    height: 5rem;
    background: #fff;
    box-sizing: border-box;
}
.list_item{
    position: relative;
    display: flex;
}
.avator{
    display: block;
    width: 2.17rem;
    height: 2.17rem;
    border-radius: 3px;
}
.member_name{
    display: flex;
    align-items: center;
}
.member_name p{
    width: 17.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.assign_box{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: auto;
    width: 40%;
}
.edit_btn{
    display: inline-block;
    margin: -2px 0 0 0.5rem;
    width: 1rem;
    height: 1rem;
    background: url('../../../assets/images/ic_edit.png') no-repeat center;
    background-size: 100%;
    vertical-align: middle;
}
.sure_btn{
    height: 3.67rem;
    line-height: 3.67rem;
    font-size: 1.42rem;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    background: #2F7DCD;
}
.member_tips{
    color: #999;
    text-align: center;
}
.assign_num{
    padding-bottom: 0.1rem;
    width: 6.5rem;
    font-size: 1.2rem;
    color: #666;
    text-align: right;
    border-radius: 0;
}
.assign_num_inputed{
    padding-bottom: 0.3rem;
    color: #333;
    text-align: left;
}
.assign_num_wrap{
    position: relative;
}
.assign_num_wrap:after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 3;
    width: 100%;
    height: 1px;
    background: #ddd;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
.btn_wrap{
    padding: 0.67rem 1.25rem;
    height: 5rem;
    background: #fff;
    box-sizing: border-box;
}
.sure_btn{
    height: 3.67rem;
    line-height: 3.67rem;
    font-size: 1.42rem;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    background: #2F7DCD;
}
.qwui-no_record_box{
    margin-top: -98px;
}
.success_tips{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    color: #FFAC61;
    text-align: center;
    background: #FFF9E5;
}
</style>


