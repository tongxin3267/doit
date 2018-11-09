<template>
  <div class="qwui-dept_item_open">
    <div class="qwui-dept_item" v-for="item in message.deptList_d">
      <a class="a_link" @click="userStructureInit(item.id,item.departmentName)"></a>
      <div class="qwui-dept_item_inner">
        <div v-if="tab.select" class="qwui-user_select_icon" :class="{active:deptselected.idStr.indexOf(item.id)!=-1}" @click="selectThis(item.id)">
          <i></i>
        </div>
        <div class="avator"></div>
        <div class="title flexItem">
          <p class="">{{item.departmentName}}</p>
          <p class="">{{item.totalUser}}{{$t('i18n.members')}}</p>
        </div>
        <i class="qwui-icon_arrow_fr icon_gray"></i>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'userDeptTemp',
    data() {
      return {
        clickViewUser:true,
      }
    },
    created: function () {
    },
    props: ['message','deptselected',"tab"],
    methods:{
      //展开部门
      userStructureInit:function(id,name){
        this.$emit('userStructureInitFunc',this.message,id,name);
      },
      //选择部门
      selectThis:function(id){
        this.selDept(this,id);
      }
    },
  }
</script>
