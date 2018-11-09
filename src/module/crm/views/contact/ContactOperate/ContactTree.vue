<template>
  <div :class="searchBoxShow==true ? 'treeListWrap' : 'treeListMt'"
    v-show="treeListIsShow">
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
      v-scroll="loadMore"
    >
      <qw-return-back
        v-show="prevParentId.length"
      >
      </qw-return-back>
      <qw-tree-item v-if="treeLists"
        v-model="selectValue"
        :options="options"
        :config="config"
        @clickTreeItem="clickTreeItem"
      >
      </qw-tree-item>
      <load-more 
        :currPage="page" 
        :maxPage="maxPage"
        :loading="loadingMore" 
      >
      <div class="member_tips">共 {{totalRows}}个客户</div>
      </load-more>
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
import LoadMore from '@/components/list/load_more';
import search_box from "@/components/base/search_box";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { getPoolList,searchClientList } from '../../../api/contact/getData';

const data = [];
// 存放所属客户的配置
const clientConfig = {
    id: 'clientCode',
    title: 'clientName',
    checkType: 'radio',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
    parentId:'parentId',
    subTitle:'clientCode'
}
export default {
  name: "ContactTree",
  components: {
    QwTreeItem,
    LoadMore,
    QwTreeButton,
    QwReturnBack,
    search_box
  },
  props: {
    belongData: {
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
      loadingMore: true,  // 是否正在加载
      totalRows: 0,  // 总成员数
      page: 1,  // 当前页数  
      maxPage: 0,  // 最大页数
      hasMore: true,  // 是否有更多数据
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
      "resetTreeConfigData"
    ]),

    getListData () {
            let obj = {
                ...this.belongData[this.belongData.length-1],
                page: this.page,
            }
            this.loadingMore = true;
            // 修改配置
            this.changeConfig(clientConfig)
            searchClientList(obj,(data) => {
              let list = data.pageData;
              this.belongData.push(...list);
              let { maxPage, totalRows } = data;
              this.maxPage = maxPage;
              this.totalRows = totalRows;
              this.hasMore = this.page >= this.maxPage? false : true;
              this.loadingMore = false;
              this.handleGetData(this.belongData);
              // this.updateSelectValue(this.typeData);
            })
    },
    showMsgFromSearchBox(val){
      this.params.title = val;
      this.params.keyWord = val;
      // 重置数据
      this.resetTreeConfigData();
      // 配置
      this.changeConfig(clientConfig);
      // 请求数据
      searchClientList(this.params,(data) => {
        if(data.pageData){
          this.handleGetData(data.pageData);
        }else{
          this.searchNone = true
        }
      })
    },
    // 滚动加载更多
    loadMore (el) {
        let scrollTop = el.scrollTop;
        let offsetHeight = el.offsetHeight;
        let scrollHeight = el.scrollHeight;
        if(scrollTop + offsetHeight == scrollHeight){
            if(this.hasMore){
                this.page++;
                this.getListData();
            }
        }
    },

    // 点击input
    clickTreeItem(payload) {
      if (payload.code && payload.fatherid == "") {
        this.params.code = payload.code;
        // 修改配置
        this.changeConfig(industryChildrenConfig)
        this.handlePrevParentId();
       
      }
    },

    // 按确认键
    confirmSelected() {
      //  【必要的】
      this.handleConfirmSelected();
      // 页面存在多种层级类型的选择时，才需要判断。只有一种类型时从 store 的selectValue获取
      this.$emit("typeSelected", this.selectValue);
      this.$emit("belongClientStr",this.currentSelected[0].clientName);
      this.$emit('update:treeListIsShow', false)
      this.$emit('update:searchBoxShow', false)
      this.$emit("treeListShow", false);
    },

    // 取消键
    cancelSelected(val) {
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
  margin-bottom: 50px;
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
      background: url(../../../../../assets/images/crm/searchNone.png) center no-repeat;
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
}
</style>
