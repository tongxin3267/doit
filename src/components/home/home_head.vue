<template>
  <div class="header">
    <div class="nav-box">
        <div class="nav-box-content" v-for="item in dataBase.home.home_head.nav">
            <router-link :to="item.url">
                <div class="nav-box-radius">
                    <i class="nav-box-icon" :class="item.class"></i>
                </div>
                <p class="nav-box-text">{{item.text}}<span id="draftSpan" class="f-color-ddd" v-if="item.num">({{item.num}})</span></p>
            </router-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home_head',
  created:function(){

  },
  data(){
    return {
      dataBase:dataBase,
      rter:8,
    }
  }
}

</script>

<style type="text/css">
.header .nav-box{
    display: flex;
    height: 100px;
    background-color: #5077AA;
}
.header .nav-box-content{
    flex: 1;
    padding: 15px 0 10px;
    text-align: center;
}
.header .nav-box-content a{
    display: block;
}
.header .nav-box-radius{
    width: 50px;
    height: 50px;
    margin:auto;
    border-radius: 100%;
    background: #fff;
}
.header .nav-box-text{
    margin-top: 10px;
    line-height: 1;
    color: #fff;
}
.header .nav-box-icon{
    display: block;
    width: 22px;
    height: 22px;
    margin: 0 auto;
    padding-top: 28px;
}
.header .nav-box .ic_add{
    background: url(../../assets/images/ic_new1.png) center no-repeat;
    background-size: 22px 22px;
}
.header .nav-box .ic_draft{
    background: url(../../assets/images/ic_draft1.png) center no-repeat;
    background-size: 22px 22px;
}
</style>
