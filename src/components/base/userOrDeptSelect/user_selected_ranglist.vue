<template>
  <div class="selectBox">
    <label class="selectAllBar" v-if="defaultAllSelect">
      <input v-model="checkedAll" type="checkbox" class="icon_check">全选
    </label>
    {{title}}
    <div :class="['qwui-selectMain_item',defaultAllSelect?'top':'']">
      <div :class="['qwui-user_item',options.length>1?'pb10':'']"
           v-if="options"
           v-for="(item,index) in options">
        <p class="qwui-select_letter_bar"></p>
        <label
          v-for="(value,itemIndex) in item"
          class="qwui-user_item_inner">
          <input :type="checkedType"
                 :value="handleItemId(value)"
                 @click="checkData(index)"
                 v-model="checkedData"
                 class="icon_check">
          <div class="qwui-border_bottom selectItem">
            <div class="avator">
              <img :src="defaultHeadpic(value[config.headpic])" alt="">
            </div>
            <div class="title flexItem">
              <p class="title_main" :class="{'middle':value.departmentName}">{{value[config.name]}}</p>
              <p class="title_sub" v-if="value.departmentName">{{value.departmentName}} {{value.position}}</p>
            </div>
          </div>
        </label>
      </div>
      <div class="bar"></div>
    </div>
  <!--确定按钮-->
    <div class="qwui-btn_box active">
      <div class="qwui-btn_tab">
        <a href="javascript:;" class="qwui-btn qwui-btn_primary" @click="FlowAuditUserResult">{{$t('i18n.confirm')}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  const DEFAULTPIC= {
    'user':require('../../../assets/images/touxiang02.png'),
    'deptManager':require('../../../assets/images/touxiang02.png'),
    'dept':require('../../../assets/images/icon_dept.png')
  }
  export default {
    name: "user_selected_ranglist",
    props: {
      show: Boolean,
      options:null,
      checked:null,     // 已选
      title:'',         // 标题
      checkedType: {    // 单选 radio,多选 checkbox
        type: String,
        default: 'checkbox',
      },
      defaultAllSelect:{     // false 不显示全选选项
        type:Boolean,
        default: false,
      },
      selectType: {   // 选人类型 部门:'Dep',人:'User'
        type: String,
        default:''
      },
      config:{    // 数据配置 参考../mock/userSelected
        type: Object,
        default() {
          return {
            id: 'id',
            headpic: 'headpic',
            name: 'name',
            class:'',     // 类名
            group: false,     // 是否分组
          }
        }
      },
    },
    data() {
      return {
        checkedIndex:'',
        checkedData:null,
      }
    },
    computed: {
      checkedAllData() {
        let self = this
        let result = []
        let len = 0
        this.options.forEach((value)=>{
          value.forEach((item)=>{
            len++
            result.push(item[self.config.id])
          })
        })
        return {len,result}
      },
      checkedAll: {
        get() {
          if(!!this.checkedData){
            return this.checkedData.length === this.checkedAllData.len
          }
        },
        set(val) {
          this.checkedData = val ? this.checkedAllData.result : []
        }
      }
    },
    mounted() {
      // 如果已有选择的数据
      if(this.checked){
        this.checkedData=this.checked
      }
      this.checkIndex()
      /*this.$nextTick(function () {
        document.getElementsByClassName('qwui-selectMain_item')[0].style.height = window.innerHeight + 'px'
      })*/
    },
    methods:{
      defaultHeadpic(val) {
        if(!val || val==0){
          return DEFAULTPIC[this.selectType]
        }
        return val
      },
      FlowAuditUserResult() {
        let self = this
        // 单选或多选 id值不一样
        let idstr = (this.checkedType === 'radio') ? this.checkedData : this.checkedData.join('|')
        let ids = []
        let result=[]
        this.options.forEach((value,index)=>{
          if(index!=this.checkedIndex) {return}
          let item = value.filter( item => {
              if(idstr.indexOf(item[self.config.id]) > -1) {
                ids.push( item[self.config.id])
                return item
              }
            }
          )
          if(item.length){
            result.push(...item)
          }
        })
        ids = ids.join('|')
        this.$emit("FlowAuditUserResult",{
          selectType:this.selectType,
          ids,
          result
        })
      },

      // 切换分组选项
      checkData(index){
        if(!this.config.group){return}
        if( this.checkedIndex !== index) {
          this.checkedData.length=0
          this.checkedIndex = index
        }
      },

      // 求出当前选择的分组是第几个
      checkIndex() {
        let self = this
        if(!this.config.group){return}
        if (this.checked && !this.checked.length) {return;}
        let ids = this.checked.join('|')
        this.options.forEach((value,index)=>{
          value.forEach((item,key)=>{
            if(ids.indexOf(item[self.config.id]) > -1){
              self.checkedIndex = index
              return index
            }
          })
        })
      },

      // 分组的标题
      groupTitle(val) {
        if(this.config.group) {
          return val[this.config.groupTitle]
        }
      },
      // 如果是部门负责人分组,部门负责人可能多个部门
      handleItemId(value) {
        if(this.config.group) {
          return value.deptId+value[this.config.id]
        }
        return value[this.config.id]
      }
    },
  }
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox {
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
    background-color: #f5f5f5;
  }

  .qwui-selectMain_item {
    position: absolute;
    top: 0;
    bottom: 60px;
    width: 100%;
    background-color: #fff;
    overflow-y: scroll;
  }

  .qwui-selectMain_item::-webkit-scrollbar {
    width: 0;
  }

  .selectAllBar {
    display: flex;
    padding: 12px 15px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
    line-height: 20px;
    background-color: #fff;
  }

  .qwui-user_item {
    font-size: 16px;
    background-color: #f5f5f5;
  }

  .qwui-user_item:not(:first-child).pb10{
    padding-top: 10px;
  }

  .qwui-selectMain_item.top{
    top: 54px;
  }

  .qwui-user_item .qwui-user_item_inner {
    display: flex;
    align-items: center;
    padding-left: 15px;
    background-color: #fff;
  }

  .selectItem {
    display: flex;
    flex: 1;
    align-items: center;
    padding: 12px 0;
  }

  .qwui-user_item_inner:last-child .qwui-border_bottom:after{
    border-bottom: none;
  }

  .qwui-user_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 40px;
  }

  .qwui-user_item .avator img {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }

  .qwui-user_item .title {
    flex: 1;
    line-height: 1;
  }

  .title_sub {
    margin-top: 10px;
    line-height: 1;
    font-size: 13px;
    color: #999;
  }
</style>
