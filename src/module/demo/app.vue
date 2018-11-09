<template>
      <router-view  id="app"></router-view>
    <!-- <msg-boxs></msg-boxs> -->
</template>

<script>
//import msgBoxs from '@/components/base/msgBoxs'
export default {
  name: 'app',
  created:function(){
  },
  //components:{"mall-head":mallHead,"msg-boxs":msgBoxs},
  data(){
    return {
      dataBase:dataBase
    }
  }
}

</script>

<style>
	@import '../../assets/css/style.css';
</style>
