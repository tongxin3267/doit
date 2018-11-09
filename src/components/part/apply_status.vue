<template>
  <span class="qwui-apply_status" :class="[{'active':showStatus.active},showStatus.class]" v-if="showStatus">{{statusName}}</span>
</template>
<script>
  export default{
    name:"applyStatus",
    props:{
      applystatus:{
        type:Object,
        default() {
          return {
            name:"",
            class:"",
            active:true,
          }
        }
      }
    },
    computed:{
      showStatus:function () {
        if(this.applystatus && JSON.stringify(this.applystatus)!="{}"){
          return this.applystatus.name? this.applystatus:false;
        }
        return false;
      },
      statusName(){
          return this.applystatus.name.indexOf("i18n")==-1? this.applystatus.name:this.$t(this.applystatus.name);
      }
    }
  }
</script>
<style>
  /*详情审批状态*/
  .qwui-apply_status{
    display: inline-block;
    padding: 2px;
    font-size: 12px;
    line-height: 1;
    vertical-align: middle;
    text-align: center;
    border-radius: 2px;
  }
  .qwui-apply_status.status_blue{ border: 1px solid #458be9;color: #458be9 ;}
  .qwui-apply_status.status_green{  border: 1px solid #1aad19;color: #09bb07 ;}
  .qwui-apply_status.status_red{  border: 1px solid #d64949;color:#e94f4f;}
  .qwui-apply_status.status_gray{  border: 1px solid #999;color:#999; }
  .qwui-apply_status.status_orange{  border: 1px solid #ff6000;color: #ff6000;}
  .qwui-apply_status.active{ padding: 3px 3px;margin-left: 10px;}
</style>
