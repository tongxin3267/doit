<template>
  <div
    class="treeListWrap"
    v-windowscroll="scrollFun"
  >
    <p class="backTip" v-show="currentId!=0">
      <!--<span class="left">全部</span>-->
      <!--<span class="arrow_icon">&gt</span>-->
      <span @click="returnBack">返回上一级</span>
    </p>
    <!-- 加了input -->
    <qw-tree-item
      :options="options"
      :config="config"
      :showTreeList="showTreeList"
      v-model="selectValue"
      @input="input"
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
  export default {
    name: "QwTreeList",
    components: {
      QwTreeItem,
      QwTreeButton
    },
    props: {
      config: null,
      options: null,
      currentId:'',
      renderData: null,  //全部的数据
      selected:{
        type: [Array,String], //已选的数据
      },
      showTreeList:{
        type:Boolean
      }
    },
    data() {
      return {
        selectValue: [], //已选的数据
        selectIdStr: ''
      }
    },
    created(){
      this.initSelectValue()
    },
    computed:{
      selectName() {
        return this.selectValue.length + '个'
      },
    },
    methods: {
      initSelectValue(){
        if(this.config.checkType=="radio"){
          this.selectValue.push(this.selected)
        }else{
          if(this.selected.length){
            this.selectValue = JSON.parse(JSON.stringify(this.selected));
            this.selectValue.forEach(value=>{
              this.selectIdStr += value+','
            })
          }
        }
      },
      showNextItem(option) {
        this.$emit('showNextItem',option)
      },
      scrollFun(){
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          this.$emit('scrollFun')
        }
      },
      // 返回上一级
      returnBack() {
        this.$emit('returnBack')
      },
      //取消
      cancelSelected() {
        this.$emit('closeTreeListShow', false)
        this.$emit('cancelSelected')
      },
      confirmSelected() {
        let options = [];
        Object.values(this.renderData).forEach(value=>{
          options=options.concat(value)
        })
        let selectedItems = options.filter(value=>{
          return this.selectValue.includes(value[this.config.id])
        })
        this.$emit('confirmSelected',this.selectValue,selectedItems)
        this.$emit('closeTreeListShow', false)
      },
      showSelectedItem() {
        let options = [];
        Object.values(this.renderData).forEach(value=>{
          options=options.concat(value)
        })
        let selectedItems = options.filter(value=>{
          return this.selectValue.includes(value[this.config.id])
        })
        this.$emit('showSelectedItem',selectedItems)
      },
      clickTreeItem(payload) {
        let payloadKey = payload.id?payload.id:payload.code;
        if(this.config.checkType=="radio"){
          this.selectValue.length=0
          this.selectValue.push(payloadKey)
        }else{
          if(this.selectIdStr.indexOf(payloadKey)==-1){
            this.selectValue.push(payloadKey)
            this.selectIdStr+=payloadKey+','
          }else{
            this.selectValue.forEach((value,index)=>{
              if(value == payloadKey){
                this.selectValue.splice(index,1);
                this.selectIdStr=this.selectIdStr.replace(payloadKey+',','')
              }
            })
          }
        }
        this.$emit('clickTreeItem',payload)
      },
      input(val){
        this.$emit('input',val)
      }
    }
  }
</script>

<style scoped>
  .backTip {
    font-size: 14px;
    padding: 13px 15px;
    color: #999;
    cursor: pointer;
  }
  .backTip .left {
    color: #586C94;
  }
  .backTip .arrow_icon {
    padding: 5px;
  }
  .treeListGroup {
    min-width: 300px;
  }
  .treeListWrap {
    position: relative;
    width: 100%;
  }
</style>
