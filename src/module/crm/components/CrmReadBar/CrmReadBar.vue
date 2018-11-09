/** 
  *  @params readMsg(默认:'',必填)：未阅信息文字
  *  @params checkReadMsg：查看未阅信息回调函数
  *  @params signRead：标记已阅回调函数
  *  @example
        <crm-read-bar 
                :readMsg="readMsg"
                @checkReadMsg="checkReadMsg"
                @signRead="signRead"
            >
        </crm-read-bar>
  */
<template>
    <div class="crm_read_bar_wrap">
        <div class="crm_read_bar">
            <div class="read_msg" @click="checkReadMsg">
                <span>{{readMsg}}</span>
                <i class="right_arrow"></i>
            </div>
            <div class="sign_read_wrap" @click="signRead">
                <span class="sign_read">标记为已阅</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'CrmReadBar',
    props: {
        // 未阅信息
        readMsg: {
            type: String,
            default: '',
            required: true
        }
    },
    methods: {
        // 查看未阅信息
        checkReadMsg () {
            this.$emit('checkReadMsg');
        },

        // 标记已阅
        signRead () {
            this.$emit('signRead');
        }
    }
}
</script>
<style lang="scss" scoped>
@import './CrmReadBar.scss';
</style>

