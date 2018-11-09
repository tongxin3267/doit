/** 
  *  @param path(默认:'')：路由地址
  *  @param isRouter(默认:true)：是否为路由跳转
  *  @example
  *     <parent>
  *         <crm-fixed-nail path="xxxx"></crm-fixed-nail>
  *     </parent>
  */
<template>
    <div class="crm_fixed_nail" @click="goUrl"></div>
</template>
<script>
export default {
    name: 'CrmFixedNail',
    props: {
        // 路由地址
        path: {
            type: String,
            default: '',
            required: true
        },

        // 是否为路由跳转
        isRouter: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        // 跳转链接
        goUrl () {
            if(this.isRouter){
                this.$router.push(this.path)
            }
            else{
                location.href = `${_.baseURL}${this.path}`;
            }
        }
    }
}
</script>
<style lang="scss">
@import './CrmFixedNail.scss';
</style>


