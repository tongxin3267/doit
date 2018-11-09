<template>
    <div>
      <div class="selectBox" v-show="boxShow">
        <div class="selectContent qwui-border_bottom">
          <label
            v-for="(value,key,index) in week"
            :for="value"
            class="qwui-border_bottom">
            <input type="checkbox"
                   :key="key"
                   :value="key"
                   :id="value"
                   v-model="checkedWorkday"
                   class="icon_check">
            {{value}}
          </label>
        </div>

        <button_group :fixed="true">
          <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
          <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
        </button_group>
      </div>
    </div>
</template>

<script>
  import {qwui_button, button_group} from '@/components/base/button'
  import { mapGetters } from 'vuex'

  const WEEK = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  }
  export default {
    name: "select-work-day",
    props: {
      boxShow: false,
      checkedData:null
    },
    data() {
      return {
        show:'',
        checkedWorkday:[...this.checkedData],
        week: WEEK,
      }
    },
    computed: {
      ...mapGetters(['rate']),
    },
    methods: {
      cancelSelected() {
        this.$emit('update:boxShow', false)
      },
      confirmSelected() {
        if(this.rate!=1) return
        let day = this.checkedWorkday.sort().join(',')
        this.$store.commit('updateCurrentDay',day)
        this.$emit('update:boxShow', false)
      }
    },
    components: {
      qwui_button,
      button_group,
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
</style>
