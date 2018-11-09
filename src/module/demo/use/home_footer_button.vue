<template>
  <div>
    <div class="qwui-footer_tabbar">
      <div class="qwui-footer_tabbar_item">
        <div class="qwui-footer_one"></div>
        <p style="display: inline-block;">{{footernavdata.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'footer_nav',
    props:["footernavdata"],
    data(){
      return {
      }
    }
  }

</script>

<style type="text/css">
  .qwui-footer_one{
    display: inline-block;
    position: relative;
    width: 15px;
    height: 15px;
    margin-right: 3px;
    vertical-align: middle;
    background: url(../../../assets/images/ic_topicfabu.png) center no-repeat;
    background-size: 15px;
  }
  .qwui-footer_tabbar {
    position: relative;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    background-color: #FFF;
    z-index: 9;
  }
  .qwui-footer_tabbar_item {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 5px 0 0;
    line-height: 49px;
    font-size: 16px;
    color: #434343;
    text-align: center;
  }
</style>
