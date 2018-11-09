<template>
  <div class="qwui-footer_tab_item" @click="navClick">
    <span class="qwui-footer_tab_box">
      <i :class="icon? icon:''"></i>
    </span>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name:"navIcon",
    props:{
      icon:{
        type:String,
        required:true,
      },
      toParams:{
        type:Object,
        required:false,
      }
    },
    data() {
      return{

      }
    },
    created(){

    },
    methods:{
      navClick(){
        this.$emit("navIconClick",true);
      }
    }
  }
</script>
<style>
  /*十字架*/
  .qwui-cross_icon{
    display: inline-block;
    width: 45px;
    height: 45px;
    background: url(../../assets/images/round_cross.png);
    background-size: contain;
  }
  /*编辑、草稿*/
  .qwui-addDraft_icon{
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url(../../assets/images/icon_index_select.png) no-repeat;
    background-size: cover;
  }
  .qwui-addDraft_icon.icon_edit{
  background-position: 0 0;
  }
  .qwui-addDraft_icon.icon_draft{
    background-position: -50px 0;
  }
</style>
