<template>
  <div>
    <div class="qwui-inner_f_item qwui-flexbox" @click="showPicker">
      <span class="qwui-item_title">提交截止时间</span>
      <a href="javascript:;" class="qwui-inner_item">
        {{handleCurrentDay}}{{handleLastTime}}
      </a>
    </div>

    <timePicker
      :data="data[0]"
      ref="picker1"
      @select="handleSelect(arguments)"
      cancelTxt="取消" confirmTxt="确定">
    </timePicker>

    <timePicker
      :data="data[1]"
      ref="picker2"
      @select="handleSelect(arguments)"
      cancelTxt="取消" confirmTxt="确定">
    </timePicker>

    <timePicker
      :data="data[2]"
      ref="picker3"
      @select="handleSelect(arguments)"
      cancelTxt="取消" confirmTxt="确定">
    </timePicker>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import timePicker from '@/components/picker/index'

  const DAY = [
    {text:'次日'}
  ]
  // 周
  const WEEK = [
    {text: '周日', value: 0},
    {text: '周一', value: 1},
    {text: '周二', value: 2},
    {text: '周三', value: 3},
    {text: '周四', value: 4},
    {text: '周五', value: 5},
    {text: '周六', value: 6},
  ]
  // 时间
  const TIME = [
    {text: '6:00', value: 600},
    {text: '7:00', value: 700},
    {text: '8:00', value: 800},
    {text: '9:00', value: 900},
    {text: '10:00', value: 1000},
    {text: '11:00', value: 1100},
    {text: '12:00', value: 1200},
  ]
  // 几号
  const DATE = (function () {
    let arr = []
    for(let i=1;i<29;i++){
      arr.push({
        text: i+'号',
        value: i
      })
    }
    return arr
  })()

  export default {
    name: "ruleTime",
    props: ['ruleId'],
    data() {
      return {
        data: [           // 截止时间
          [DAY, TIME],     // 周期为每天
          [WEEK, TIME],    // 周期为每周
          [DATE, TIME],    // 周期为每月
        ],
      }
    },
    computed: {
      ...mapGetters(['handleLastTime','rate','handleCurrentDay']),
    },
    methods: {
      // 根据选择的周期，显示时间
      showPicker() {
        if(this.ruleId!=='0') {
          return
        }
        let pick = this.$refs['picker' + this.rate]
        pick.show()
      },
      // 获取选择到的时间
      handleSelect(args) {
        let index = Number(this.rate)-1
        let data = this.data[index]
        let time = data[1][args[1][1]].value
        if(this.rate!=1){
          let day = data[0][args[1][0]].value
          this.$store.commit('updateCurrentDay',day)
        }
        this.$store.commit('updateLastTime',time)
      },
    },
    components: {
      timePicker
    }
  };
</script>
