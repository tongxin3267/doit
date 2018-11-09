<template>
  <div
    class="treeListWrap"
    v-windowscroll="scrollFun"
  >
    <button @click="treeListShow=true">显示</button>
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
</template>

<script>
  import QwTreeItem from '@/components/tree/treeItem'
  import QwTreeButton from '@/components/tree/treeButton'
  import QwReturnBack from '@/components/tree/treeReturnBack'
  import {getData,getNextItem} from './mock'
  const config = {
    id: 'id',
    title: 'typeName',
    hasChildren: 'hasChildren',
    checkType: 'checkbox',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png'
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
        config: config,           // 配置
        treeListShow: false,      // 显示列表
        options: [],              // 列表数据
        renderData: {},           // { '父级ID': [子级数据] }
        selectValue: [],          // 当前已选的数据
        currentSelected: [],      // 先前选择的数据，点击“取消”时返回
        currentParentId: '',      // 当前列表的父Id
        prevParentId: [],         // 上一级的父Id。每点击下一级，则push “当前列表的父Id”。每返回上一级，则pop最后一个元素
        lock_roll: false,         // 下拉滚动加载控制
        flag: 0   // 无用参数，仅用于控制层级
      }
    },
    created(){
      // 获取当前列表数据
      getData(this.lock_roll).then(result=>{
        // 有数据时，显示列表
        if(result.length>0) {
          this.treeListShow = true
        }
        this.options.push(...result)
        this.currentParentId = result[0].parentId
        this.renderData[this.currentParentId]=[]
        this.renderData[this.currentParentId].push(...result)
      })
    },
    computed:{
      // 当前获取的数据个数
      selectName() {
        if(this.config.checkType==='radio' && this.selectValue.length>0) {
          return '1 个'
        }
        return this.selectValue.length + '个'
      },
    },
    methods: {
      // 显示下一级数据
      showNextItem(option) {
        this.prevParentId.push(this.currentParentId)
        getNextItem(this.flag).then(result => {
          this.options=[...result]
          this.currentParentId = option[this.config.id]
          this.renderData[this.currentParentId]=[]
          this.renderData[this.currentParentId].push(...result)
          this.flag = 1      // 无用参数，仅用于控制层级
        })
      },
      scrollFun(){
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          getData(this.lock_roll).then(result=>{
            this.lock_roll=true
            this.renderData[this.currentParentId].push(...result)
          })
        }
      },
      // 返回上一级
      returnBack() {
        this.currentParentId = this.prevParentId.pop()
        this.options = [...this.renderData[this.currentParentId]]
      },
      //取消
      cancelSelected() {
        let ids = this.currentSelected.map(value => value[this.config.id])
        if(this.config.checkType==='radio') {
          this.selectValue = ids[0]
        }else {
          this.selectValue = ids
        }
        this.treeListShow = false
      },
      confirmSelected() {
        this.countSelectedItems()
        this.treeListShow = false
      },
      // 查看已选择的数据
      showSelectedItem() {

      },
      // 点击“确定”，求出已选择的数据
      countSelectedItems: function () {
        let options = [];
        Object.values(this.renderData).forEach(value => {
          options = options.concat(value)
        })
        let items = options.filter(value => {
          return this.selectValue.includes(value[this.config.id])
        })
        this.currentSelected.length =0
        this.currentSelected.push(...items)
      },
      clickTreeItem(payload) {
      },
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
