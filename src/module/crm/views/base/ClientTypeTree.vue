<template>
  <div :class="searchBoxShow==true ? 'treeListWrap' : 'treeListMt'"
    v-show="treeListIsShow">
    <!-- 公海列表隐藏搜索框 -->
    <header class="qwui-client_type_fixed" v-if="searchBoxShow">
      <search_box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search_box>
    </header>
    <div class="search-result" v-if="searchNone">
      <i class="search-image"></i>
      <span class="search-text">没有搜索结果</span>
    </div>
    <div
      class="treeListAll"
      :style="{ height: winHeight }"
      @scroll="loadMore"
      ref="treeListAll"
    >
      <qw-return-back
        v-show="prevParentId.length"
        @returnBack="returnBack"
      >
      </qw-return-back>

      <qw-tree-item v-if="treeLists"
        v-model="selectValue"
        :options="options"
        :config="config"
        @clickTreeItem="clickTreeItem"
        @showNextItem="showNextItem"
      >
      </qw-tree-item>
      <!-- 滚动加载 -->
      <!-- <load-more
        :currPage="page"
        :maxPage="maxPage"
        :loading="loadingMore"
      > -->
      <div class="member_tips"></div>
      <!-- </load-more> -->

    </div>
    <qw-tree-button class="tree-btn"
      @cancelSelected="cancelSelected"
      @confirmSelected="confirmSelected"
      @showSelectedItem="showSelectedItem"
      :subTitle="selectName"
    >
    </qw-tree-button>
  </div>
</template>


<script>
import QwTreeItem from "@/components/tree/treeItem";
import QwTreeButton from "@/components/tree/treeButton";
import QwReturnBack from "@/components/tree/treeReturnBack";
import QwTreeList from "@/components/tree/treeList";
import search_box from "@/components/base/search_box";
import LoadMore from '@/components/list/load_more';
import { getTypeList, getIndustryList,getPoolList } from "../../api/client/getData";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

const data = [];
const clientConfig = {
    id: 'id',
    title: 'typeName',
    hasChildren: 'hasChildren',
    checkType: 'checkbox',
    headPic:'',
    parentId:'parentId'
  };
const industryChildrenConfig = {
  id: 'code',
  title: 'industry',
  checkType: 'checkbox',
  headPic:'',
  parentId:'fatherid'
};
 const industryParentConfig = {
    id: 'id',
    title: 'industry',
    hasChildren: 'hasChildren',
    checkType: '',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',
    parentId:'fatherid'
  };
export default {
  name: "treeDemo",
  components: {
    LoadMore,
    QwTreeItem,
    QwTreeButton,
    QwReturnBack,
    search_box,
  },
  props: {
    typeDatas:{
      type:[Array, String]
    },
    typeData: {
      type:[Array, String]
    }, // 存放客户类别请求对象
    poolData: {
      type:[Array, String]
    }, // 存放公海列表请求对象
    industryData: {
      type:[Array, String]
    }, // 存放行业列表请求对象
    checkConfirm: "",
    treeListIsShow: {
      type:[Boolean,String],
    },
    searchBoxShow: {
      type:[Boolean,String],
    },
  },
  data() {
    return {
      params: {
        pId: 0,
        page: 1,
        code: "",
        title: "",
        keyWord: ""
      },
      searchBar: {
        show: true,
        ridMask: true
      },
      typeCode: '',
      loadingMore: true,
      totalRows: 0,
      page: 1,
      maxPage: 0,
      hasMore: true,
      lastPage:{},
      treeLists:true,
      selectValueStr: '',
      clearSelectedPerson: "",
      searchNone: false,
      treeKeys: {},
      lock_roll: false,
      selected: [], //已选的数据
      showTreeList: true
    };
  },
  computed: {
    ...mapState({
      config: state => state.tree.config, // 配置
      options: state => state.tree.options, // 列表数据
      renderData: state => state.tree.renderData, // { '父级ID': [子级数据] }
      currentSelected: state => state.tree.currentSelected, // 先前选择的数据，点击“取消”时返回
      currentParentId: state => state.tree.currentParentId, // 当前列表的父Id
      prevParentId: state => state.tree.prevParentId // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
    }),
    ...mapGetters([
      "selectName" // 当前获取的数据个数
    ]),
    // 当前已选的数据【必要的】
    selectValue: {
      get() {
        return this.$store.state.tree.selectValue;
      },
      set(value) {
        this.updateSelectValue(value);
      }
    },
    winHeight() {
      if(this.checkConfirm == 'poolList'){
        let height = window.innerHeight - 50; // 减去搜索框和nav栏
        return height + 'px';
      }else{
        let height = window.innerHeight - 43 - 50; // 减去搜索框和nav栏
        return height + 'px';
      }
    }
  },
  methods: {
    ...mapMutations([
      "changeConfig",
      "updateSelectValue",
      "handleGetData",
      "handleRenderData",
      "handlePrevParentId",
      "handleGetNextItem",
      "handleCancelSelected",
      "handleConfirmSelected",
      "handleReturnBack",
      "resetTreeConfigData",
    ]),
    getListData () {
      this.lock_roll = true;
      let obj = {
        ...this.typeDatas[this.typeDatas.length-1],
        page: this.page,
      }
      this.loadingMore = true;
      // 基本配置
      this.changeConfig(clientConfig);
      if(this.checkConfirm == 'clientTypeList' && this.prevParentId.length>0){
        let childObj = {
          pId: this.currentParentId,
          page: this.page,
        }
        getTypeList(childObj,(data) => {
          let list = data.pageData;
          this.typeDatas.push(...list);
          let { maxPage, totalRows } = data;
          this.maxPage = maxPage;
          this.totalRows = totalRows;
          this.hasMore = this.page >= this.maxPage? false : true;
          this.loadingMore = false;
          this.handleGetData(list);
          this.lock_roll = false;
          // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
          this.handleRenderData(list);
        })
      }else{
        getTypeList(obj,(data) => {
          let list = data.pageData;
          this.typeDatas.push(...list);
          let { maxPage, totalRows } = data;
          this.maxPage = maxPage;
          this.totalRows = totalRows;
          this.hasMore = this.page >= this.maxPage? false : true;
          this.loadingMore = false;
          this.handleGetData(list);
          this.lock_roll = false;
          // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
          this.handleRenderData(list)
        })
      }

    },
    getPoolListData () {
      this.lock_roll = true;
      let obj = {
        ...this.poolDatas[this.poolDatas.length-1],
        page: this.page,
      }
      this.loadingMore = true;
      // 基本配置
      this.changeConfig(clientConfig);
      getPoolList(obj,(data) => {
        let list = data.pageData;
        this.poolDatas.push(...list);
        let { maxPage, totalRows } = data;
        this.maxPage = maxPage;
        this.totalRows = totalRows;
        this.hasMore = this.page >= this.maxPage? false : true;
        this.loadingMore = false;
        this.handleGetData(list);
        this.lock_roll = false;
        // this.updateSelectValue(this.typeDatas);
        // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
        this.handleRenderData(list)
      })

    },
    // 滚动加载
    loadMore (el) {
      let scrollTop =  el.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      let offsetHeight = el.target.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if(scrollTop + offsetHeight >= this.$refs.treeListAll.scrollHeight){
          if(this.hasMore && !this.lock_roll){
            this.page++;
            if(this.checkConfirm == 'clientTypeList'){
              this.getListData();
            }else if(this.checkConfirm == 'poolList'){
              this.getPoolListData();
            }
          }
      }
    },
    //搜索关键字
    showMsgFromSearchBox(val) {
      this.params.title = val;
      this.params.keyWord = val;
      // 客户类别的搜索
      if (this.checkConfirm == "clientTypeList") {
        getTypeList(this.params, data => {
          // 搜索内容为空，则渲染全部
          if(this.params.title==''||this.params.keyWord==''){
            this.resetTreeConfigData();
            // 修改配置
            this.changeConfig(clientConfig)
            this.handleGetData(data.pageData);
            this.treeLists = true;
            this.searchNone = false;
          }
          if (data.pageData) {
            // 重置数据
            this.resetTreeConfigData();
            // 修改配置
            this.changeConfig(clientConfig)
            this.handleGetData(data.pageData);
          } else {
            this.treeLists = false;
            this.searchNone = true;
          }
        });
      } else if (this.checkConfirm == "industryList") {
        // 行业的搜索
        getIndustryList(this.params, data => {
          // 若搜索内容为空，默认搜全部列表
          if(this.params.title==''||this.params.keyWord==''){
            this.resetTreeConfigData();
            // 修改配置
            this.changeConfig(industryParentConfig)
            this.handleGetData(data.pageData);
            this.treeLists = true;
            this.searchNone = false;
          }
          if (data.pageData) {
          // 有图标搜索
            this.resetTreeConfigData();
            // 修改配置
            this.changeConfig(industryParentConfig)
            this.handleGetData(data.pageData);
          }else if(data.isIndustry == '0'){ // 无图标搜索
            if(data.Industry){ // 无图标搜索有内容
              this.resetTreeConfigData();
              // 修改配置
              this.changeConfig(industryChildrenConfig)
              this.handleGetData(data.Industry);
            }
          } else {
            this.treeLists = false;
            this.searchNone = true;
          }
        });
      }
    },


    // 点击input
    clickTreeItem(payload) {
      if (payload.code && payload.fatherid == "") {
        this.params.code = payload.code;
        // 修改配置
        this.changeConfig(industryChildrenConfig)
        this.handlePrevParentId();
        getIndustryList(this.params,(data) => {
          this.handleGetNextItem({ result:data.Industry, option:payload });
        });
      }
    },

    // 点击下一级
    showNextItem(option) {
      this.page = 1;
      let self = this;
      self.params.pId = option.id;
      // 点击下一级前修改 prevParentId 【必要的】
      this.handlePrevParentId();
      // 请求二级树状，遍历添加
      this.lock_roll = true;
      getTypeList(self.params, childrenData => {
          this.hasMore = this.page<childrenData.maxPage ? true : false;
          this.handleGetNextItem({ result:childrenData.pageData, option });
          this.lock_roll = false;
      });

    },
    // 返回上一级
    returnBack() {
      this.page = 1;
      this.hasMore = true;
      // 假如是客户，返回
      if(this.checkConfirm == 'clientTypeList'){
        let pageParams = {
          page: this.page,
        }
        this.handleReturnBack();
        // 修改配置
        this.changeConfig(clientConfig)
        getTypeList(pageParams,(data) => {
          this.handleGetData(data.pageData);
        })
      }

      // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
      if (this.checkConfirm == "industryList"){
        // 行业返回
        this.handleReturnBack({'isResetData':false});
        this.changeConfig(industryParentConfig)
      }
    },
    // 处理选中后的value，传到父组件进行赋值
    selectValueHandle(){
      let selectValueArr = [];
      this.currentSelected.forEach((item) => {
        if(item.typeName){
          selectValueArr.push(item.typeName)
        }else if(item.poolName){
          selectValueArr.push(item.poolName)
        }else{
          selectValueArr.push(item.industry)
        }
      })
      this.selectValueStr = selectValueArr.join('|');
    },
    // 处理typeCode,拼接客户编码
    typeCodeHandle(){
      if(this.currentSelected.length == 1){
        this.typeCode = this.currentSelected[0].typeCode 
      }else{
        this.typeCode = ''
      }
    },
    // 按确认键
    confirmSelected() {
      this.page = 1;
      this.hasMore = true;
      //  【必要的】
      this.handleConfirmSelected();
      this.selectValueHandle();
      this.typeCodeHandle();
      // 页面存在多种层级类型的选择时，才需要判断。只有一种类型时从 store 的selectValue获取
      if (this.checkConfirm == "clientTypeList") {
        this.$emit("typeCode",this.typeCode)
        this.$emit("typeSelected", this.selectValue);
        this.$emit("typeSelectedStr",this.selectValueStr);
      }
      // 根据点进去类型传值
      if (this.checkConfirm == "poolList") {
        this.$emit("poolSelected", this.selectValue);
        this.$emit("poolSelectedStr", this.selectValueStr);
        this.selectValue.length < 0
          ? (this.clearSelectedPerson = false)
          : (this.clearSelectedPerson = true); // 假如公海有选，则选人组件清空
        this.$emit("clearSelectedPerson", this.clearSelectedPerson);
      }
      if (this.checkConfirm == "industryList") {
        this.$emit("industrySelected", this.selectValue);
        this.$emit("industrySelectedStr", this.selectValueStr);
      }
      // 点击公海确认，假如公海有值，那选人组件清空
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit("treeListShow", false);
    },

    // 取消键
    cancelSelected(val) {
      this.page = 1;
      this.hasMore = true;
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit("treeListShow", false);
    },
    showSelectedItem(selectedItems) {
    },
    input(val) {
      this.$emit("typeIds", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.treeListWrap {
  position: relative;
  width: 100%;
  margin-top: 44px;
.treeListAll{
    height:640px;
    overflow-y: auto;
  }
  .qwui-client_type_fixed {
    position: fixed;
    top: 0;
    width: 100%;
    left: 0px;
    z-index: 3;
  }
  .qwui-tree_list {
    margin-top: 3.6rem;
    margin-bottom: 5rem;
  }
  .searchBoxhide {
    margin-bottom: 5rem;
  }
  .search-result {
    margin: 50% 108px 50% 107px;
    width: 160px;
    height: 200px;
    text-align: center;
    position: relative;
    .search-image {
      background: url(../../../../assets/images/crm/searchNone.png) center no-repeat;
      background-size: 160px, 160px;
      position: absolute;
      top: 0;
      left: 0;
      width: 160px;
      height: 160px;
    }
    .search-text {
      position: absolute;
      bottom: 0;
      margin-left: -47px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      color: #a2a5b2;
      width: 100px;
    }
  }
}
.treeListMt{
  margin-top: 0px;
  padding-bottom: 50px;
  overflow: auto;
  .member_tips{
    height:50px;
  }
}
</style>
