<template>
  <ul class="qwui-add_user_list">
     <li v-for="item in deptselected.data">
            <a class="qwui-remove_icon" style="display: inline;" @click="selectThisDept(item.id)"></a>
            <p class="img"><img class="images" src="../../../assets/images/dept_ico.jpg" alt=""></p>
            <p class="name">{{item.departmentName}}</p>
       </li>
     <li v-for="item in userselected.data">
            <a class="icon_remove" @click="selectThisUser(item.userId)"></a>
            <p class="img" :class="{'qwui-user_no_images':item.headPic==''||item.headPic=='0'}">
              <img class="images" v-if="item.headPic!='0' && item.headPic!=''" :src="item.headPic"  alt="">
              </p>
            <p class="name">{{item.personName}}</p>
       </li>
  </ul>
</template>

<script>
  export default {
    name: 'resultItemTemp',
    created: function () {

    },
    props: ['userselected','deptselected','selectdata'],
    methods:{
      //选择人员
      selectThisUser(id){
        this.$emit('selUser',this,id);
      },
      //选择部门
      selectThisDept(id){
        this.$emit('selDept',this,id);
      }
    }
  }
</script>
<style>
  .qwui-add_user_list{
    margin: 10px 0;
  }
  .qwui-add_user_list li{
    position: relative;
    float: left;
    width: 45px;
    margin: 10px 15px 10px 0;
    text-align: center;
    list-style: none;
  }
  .qwui-add_user_list .icon_remove{
    position: absolute;
    left: 34px;
    top: -6px;
    width: 16px;
    height: 16px;
    background: url(../../../assets/images/remove02.png) center no-repeat;
    background-size: 100% 100%;
  }
  .qwui-add_user_list .img,.qwui-add_user_list .images{
    display: inline-block;
    width: 45px;
    height: 45px;
  }
  .qwui-add_user_list .name{
    display: inline-block;
    overflow: hidden;
    width: 45px;
    margin-top: 5px;
    font-size: 11px;
    color: #666;
    line-height: 12px;
    text-align: center;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
</style>
