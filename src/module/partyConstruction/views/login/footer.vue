<template>
  <div>
    <div class="qwui-footer_height"></div>
    <div class="qwui-bar">
      <a @click="changeFooterNav(item,i)"
         v-for="(item,i) in footerNavData.nav"
         class="item"
         :class="{'on':footerNavData.nav_on==i}">
          <span class="span">
              <div class="reimndex" :class="item.class"></div>
          </span>
          <p class="label">{{item.text}}</p>
      </a>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'footer_nav',
    props:["footerNavData"],
    data(){
      return {
      }
    },
    methods:{
      changeFooterNav(item,i){
        if(this.footerNavData.nav_on!=i){
          this.footerNavData.nav_on = i;
          this.$emit('click', item.data)
        }
      }
    }
  }
</script>
<style src="../../scss/footer.scss" lang="scss">
</style>
