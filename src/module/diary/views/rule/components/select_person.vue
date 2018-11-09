<template>
  <div>
    <div class="selectBox" v-show="boxShow">
      <div class="selectContent qwui-border_bottom">
        <label
          v-for="(value,key) in options"
          :for="value"
          class="qwui-border_bottom">
          <input type="radio"
                 :key="key"
                 :value="key"
                 :id="value"
                 v-model="checkedData"
                 class="icon_check">
          {{value}}
        </label>
      </div>
      <user_add :userselect="dataBase.selectConfig"></user_add>
      <!--选择人员-->
      <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>
      <button_group :fixed="true">
        <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
      </button_group>
    </div>
  </div>
</template>

<script>
  import user_add from '@/components/add/user_select_build';
  import user_select from '@/components/base/user_or_dept_select';
  import {qwui_button, button_group} from '@/components/base/button'
  export default {
    name: "select-person",
    props: {
      boxShow: false,
      options: null,
    },
    data() {
      return {
        dataBase,
      }
    },
    mounted() {
      if(this.checkedData==3) {
        this.toPersonList.title="特定人员和部门";
      }
    },
    computed: {
      toPersonList() {
        return this.dataBase.selectConfig.selectList["ccPersonList"]
      },
      checkedData:{
        get() {
          return this.$store.state.rules.rang
        },
        set(val) {
          this.$store.commit('updateRang', val)
        }
      },
    },
    watch: {
      checkedData(val) {
        if(val==3){
          this.toPersonList.title="特定人员和部门";
          //life
        }else {
          this.toPersonList.title="";
        }
      }
    },
    methods: {
      cancelSelected() {
        this.$emit('update:boxShow', false)
      },
      confirmSelected() {
        if(this.checkedData==3 && !this.toPersonList.userSelected.length && !this.toPersonList.deptSelected.length){
          _.alert('提示','您未选择任何部门或人')
          return
        }
        this.$emit('confirmSelected', this.checkedData)
        this.$emit('update:boxShow', false)
      },
    },
    components: {
      qwui_button,
      button_group,
      user_select,
      user_add,
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F5F5F5;
  }
  .selectContent {
    padding-left: 15px;
    background-color: #fff;
  }
  .selectBox label {
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
  }
  .selectBox .qwui-border_bottom:last-child:after{
    border: none;
  }
  .qwui-check_btn {
    margin-right: 10px;
  }
</style>
