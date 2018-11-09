<template>
  <div class="qwui-overdue_box">
      <div class="qwui-overdue_tips">
        <div class="qwui-overdue_tips_img"></div>
        <div class="qwui-overdue_tips_text">{{tips}}</div>
        <p class="qwui-overdue_type">找不到访问地址的服务器ip地址，错误代码：</p>
        <p class="qwui-overdue_type">{{typeTip}}</p>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'QWErrorPage',
    data(){
      return {
        msg:"",
        tips:"无法访问该页面",
        typeTip: ''
      }
    },
    mounted (){
      this.msg=this.$route.query.msg;
      this.typeTip += this.msg.split('500')[1].toUpperCase()
    }
  }
</script>
<style scoped>
  .qwui-overdue_box{
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    min-width:280px;
    height: 100%;
    flex-direction: column;
    justify-content: center;
  }
  @media screen and (min-width: 1024px) {
    .qwui-overdue_box{
      width: 740px;
      margin: 0 auto;
    }
  }
  .qwui-overdue_tips {
    text-align: center;
    margin-top: -23%;
  }
  .qwui-overdue_tips_img{
    display: inline-block;
    width: 160px;
    height:160px;
    background:  url("../../../assets/images/icon_emptypage.png") no-repeat;
    background-size: contain;
    vertical-align: top;
  }
  .qwui-overdue_tips_text {
    margin-bottom: 6px;
    font-size: 16px;
    color: #0A1735;
  }
  .qwui-overdue_type{
    padding: 0 15px;
    font-size: 14px;
    color: #B2B9C8
  }
</style>
