<template>
  <div>
    <div
      class="treeListWrap"
      v-windowscroll="scrollFun"
    >
      <button @click="showCrmUsersData">选择客户</button>
      <button @click="showPositionData">选择行业</button>
      <qw-return-back
        v-show="prevParentId.length"
        @returnBack="returnBack"
      >
      </qw-return-back>
      <qw-tree-item
        v-model="selectValue"
        :options="options"
        :config="config"
        :treeListShow.sync="treeListShow"
        @clickTreeItem="clickTreeItem"
        @showNextItem="showNextItem"
      >
      </qw-tree-item>
      <qw-tree-button
        @cancelSelected="cancelSelected"
        @confirmSelected="confirmSelected"
        @showSelectedItem="showSelectedItem"
        :subTitle="selectName"
      >
      </qw-tree-button>
    </div>
  </div>
</template>

<script>
  import QwTreeItem from '@/components/tree/treeItem'
  import QwTreeButton from '@/components/tree/treeButton'
  import QwReturnBack from '@/components/tree/treeReturnBack'
  import {getData,getNextItem} from './mock'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  const config = {
    id: 'id',
    title: 'typeName',
    hasChildren: 'hasChildren',
    checkType: 'checkbox',
    // 不显示头像，则不配headpic
    // headPic:'headPic', defaultHeadPic: 'user',   // 要显示接口返回的头像。从组件中选择默认头像：人员'user',部门'dept'
    // headPic:'headPic', defaultHeadPic: 'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',   // 要显示接口返回的头像。自己配默认头像
    // headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',    // 列表统一显示的头像
    parentId: 'parentId'
  }
  export default {
    name: "QwTreeList",
    components: {
      QwTreeItem,
      QwTreeButton,
      QwReturnBack
    },
    data() {
      return {
        treeListShow: true,        // 显示列表
        lock_roll: false,          // 下拉滚动加载控制
        flag: 0,                   // 无用参数，仅用于控制层级数据模拟请求
        selectTreeType: '',        // 层级选择的类型，页面存在多种层级类型的选择时，才声明。（例子：'showCrmUsersData','showPositionData'）
        CrmUsersData: [],          // 保存已选择的客户ID，页面存在多种层级类型的选择时，才声明。只有一种类型时从 store 的selectValue获取
        PositionData: [],          // 保存已选择的行业ID，页面存在多种层级类型的选择时，才声明。只有一种类型时从 store 的selectValue获取
      }
    },
    computed:{
      ...mapState({
        config: state => state.tree.config,                        // 配置
        options: state => state.tree.options,                      // 列表数据
        renderData: state => state.tree.renderData,                // { '父级ID': [子级数据] }
        currentSelected: state => state.tree.currentSelected,      // 先前选择的数据，点击“取消”时返回
        currentParentId: state => state.tree.currentParentId,      // 当前列表的父Id
        prevParentId: state => state.tree.prevParentId,            // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
      }),
      ...mapGetters([
        'selectName',     // 当前获取的数据个数
      ]),
      // 当前已选的数据【必要的】
      selectValue: {
        get() {
          return this.$store.state.tree.selectValue
        },
        set(value) {
          this.updateSelectValue(value)
        }
      },
    },
    methods: {
      ...mapMutations([
        'changeConfig',
        'updateSelectValue',
        'handleGetData',
        'handleRenderData',
        'handlePrevParentId',
        'handleGetNextItem',
        'handleCancelSelected',
        'handleConfirmSelected',
        'handleReturnBack',
        'resetTreeConfigData',
      ]),
      // 显示下一级数据
      showNextItem(option) {
        // 点击下一级前修改 prevParentId 【必要的】
        this.handlePrevParentId()
        getNextItem(this.flag).then(result => {
          // 【必要的】
          this.handleGetNextItem({result, option})

          this.flag = 1      // 无用参数，仅用于控制层级
        })
      },
      scrollFun(){
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          getData(this.lock_roll).then(result=>{
            this.lock_roll=true

            // 滚动加载后，继续添加对应的 renderData 数据  【必要的】
            this.handleRenderData(result)
          })
        }
      },
      // 返回上一级
      returnBack() {
        //  【必要的】
        this.handleReturnBack({'isResetData':false})
      },
      //取消
      cancelSelected() {
        //  【必要的】
        this.handleCancelSelected()
        this.treeListShow=false
      },
      // 点击“确定”，求出已选择的数据
      confirmSelected() {
        //  【必要的】
        this.handleConfirmSelected()
        this.treeListShow=false

        // 页面存在多种层级类型的选择时，才需要判断。只有一种类型时从 store 的selectValue获取
        if(this.selectTreeType === 'showCrmUsersData') {
          this.CrmUsersData = this.selectValue
        }
        if(this.selectTreeType === 'showPositionData') {
          this.PositionData = this.selectValue
        }
      },
      // 查看已选择的数据
      showSelectedItem() {},
      // 点击列表
      clickTreeItem(payload) {},
      // 选择客户
      showCrmUsersData() {
        // 重置数据 【必要的】
        this.resetTreeConfigData()
        // 修改配置
        this.changeConfig(config)

        // 获取当前列表数据
        getData(this.lock_roll).then(result=>{
          // 有数据时，显示列表
          if(result.length>0) {
            this.treeListShow = true
          }
          // 【必要的】
          this.handleGetData(result)
        })

        // 页面存在多种层级类型的选择时，才需要
        this.selectTreeType='showCrmUsersData'
        // 页面存在多种层级类型的选择时，才需要修改已选择的数据
        this.updateSelectValue(this.CrmUsersData)
      },
      // 选择行业
      showPositionData() {
        // 重置数据
        this.resetTreeConfigData()
        // 修改配置
        this.changeConfig(config)

        // 获取当前列表数据
        this.lock_roll=false
        getData(this.lock_roll).then(result=>{
          // 有数据时，显示列表
          if(result.length>0) {
            this.treeListShow = true
          }
          this.handleGetData(result)
        })

        // 页面存在多种层级类型的选择时，才需要
        this.selectTreeType = 'showPositionData'
        // 页面存在多种层级类型的选择时，才需要修改已选择的数据
        this.updateSelectValue(this.PositionData)
      }
    }
  }
</script>

<style scoped>
  .treeListGroup {
    min-width: 300px;
  }
  .treeListWrap {
    position: relative;
    width: 100%;
  }
</style>
