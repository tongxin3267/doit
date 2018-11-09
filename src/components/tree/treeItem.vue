<template>
  <div
    class="treeList"
  >
    <div
      v-for="(option) in options"
      :key="option[config.id]"
      class="treeItem"
    >
      <input
        v-if="config.checkType"
        v-model="currentValue"
        :type="config.checkType"
        :value="option[config.id]"
        :class="[align]"
        :id="option[config.id]"
        class="iconfont iconfont_check"
      >
      <label :for="option[config.id]" class="treeLabel" @click="clickTreeItem(option)">
        <img
          :src="getPic(option)"
          class="headPic"
          width="40"
          height="40"
          v-show="config.headPic"
        >
        <div class="treeContent">
          <p
            class="treeTitle"
            :class="{'top':config.subTitle}"
          >
            {{option[config.title]}}
          </p>
          <p class="subTitle">{{option[config.subTitle]}}</p>
        </div>
      </label>
      <i v-show="option[config.hasChildren]"
         @click="showNextItem(option)"
        class="qwui-icon_arrow_fr icon_gray"
      >
      </i>
    </div>
  </div>
</template>

<script>
  const defaultHeadPic = {
    'user':require('@/assets/images/touxiang02.png'),
    'deptManager':require('../../assets/images/touxiang02.png'),
    'dept':require('../../assets/images/icon_dept.png')
  }
  export default {
    name: "QwTreeItem",
    props: {
      // 选项：[{id:'',parentId:'',title:'',subTitle:'',hasChildren:Boolean,disabled:Boolean}]
      options: {
        type: Array,
        required: true
      },
      // key 值配置,没有则不配
      config: {
        type: Object,
        default() {
          return {
            id: '',
            parentId: '',
            title: '',
            subTitle: '',
            hasChildren: '',    // 是否有下一级
            disabled: '',
            headPic: '',            // 列表的头像，可以是接口的头像key值；也可以配列表统一的头像url，不显示则不配
            defaultHeadPic: '',     // 要显示头像，没有头像。不显示则不配
            checkType:'',           // 选框类型
          }
          }
      },
      // 已选择
      value: {
        type: [Array,String],
      },
      // 图标位置：默认左边, @right 右边
      align: {
        type: String,
      }
    },
    data() {
      return {
        defaultHeadPic,   // 默认头像选项
        currentValue: this.value,
      }
    },
    watch: {
      // 当前选择的数据
      value(val) {
        this.currentValue = val
      },
      // 当前选择的数据
      currentValue(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      // 点击某一列
      clickTreeItem(option) {
        this.$emit('clickTreeItem',option)
      },
      // 显示下一级
      showNextItem(option) {
        this.$emit('showNextItem',option)
      },
      // 获取头像
      getPic(option) {
        return option[this.config.headPic]     // 接口返回的头像
          || this.defaultHeadPic[this.config.defaultHeadPic]    //  要显示头像，但是接口没有返回，从组件中选择默认头像：人员'user',部门'dept'
          || this.config.defaultHeadPic        // 要显示头像，但是接口没有返回。自己配置默认头像
          || this.config.headPic               // 列表统一显示的头像
      }
    },
  }
</script>

<style scoped>
  .iconfont_check {
    line-height: 67px;
    margin-right: 10px;
  }
  .treeList {
    background-color: #fff;
    overflow-y: scroll;
    cursor: pointer;
  }
  .treeList::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }
  .treeItem {
    position: relative;
    display: flex;
    height: 65px;
    line-height: 65px;
    margin-left: 15px;
    background-color: #fff;
    cursor: pointer;
  }
  .treeItem .headPic {
    margin-top: 12px;
    margin-right: 10px;
    border-radius: 2px;
  }
  .treeItem:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .treeItem:last-child:after{
    border-bottom: 0
  }
  .treeItem .treeContent {
    flex: 1;
    width: 80%;
    margin-right: 15px;
  }
  .treeItem .treeTitle {
    font-size: 16px;
    margin: 0;
    color: #333;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .treeItem .treeTitle.top {
    line-height: 1;
    padding-top: 13px;
  }
  .treeItem .subTitle {
    line-height: 1;
    font-size: 13px;
    color: #999;
    margin-top: 8px;
  }
  .treeLabel {
    display: flex;
    width: 100%;
    cursor: pointer;
  }
  .qwui-icon_arrow_fr {
    width: 48px;
    cursor: pointer;
  }
  .qwui-icon_arrow_fr:after {
    position: absolute;
    right: 15px;
  }
</style>
