<template>
  <div class="qwui-user_show_box" v-show="show">
      <div class="qwui-user_select_head">
        <div v-if="showTitle">
          {{title}}
          <span class="person_num">{{'(' + userSelect.length + ')'}}</span>
        </div>
        <slot name="title"></slot>
      </div>
      <div class="qwui-user_show_scroll" :style="styleHeight">
        <div class="qwui-user_select_list">
          <ul>
            <li v-for="(list,i) in userSelect">
              <p class="img" @click.stop.prevent="showPersonDetail(list)" :class="{'active':list.headPic=='0'||list.headPic==''}">
                <img v-if="list.headPic!='0' && list.headPic!=''" :src="list.headPic"  alt="">
              </p>
              <p class="qwui-user_select_person">{{list.personName}}</p>
            </li>
          </ul>
        </div>
        <div class="qwui-user_footer_height"></div>
      </div>
      <div class="qwui-user_btn">
        <a class="qwui-user_btn_back" @click="showPersonBack()">{{$t('i18n.returnBack')}}</a>
      </div>
  </div>
</template>
<script>
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'userShow',
    props:{
      title:{
        type: String,
        default: ''
      },
      userSelect:{
        type: Array,
        default: []
      },
      show:{
        type: Boolean,
        default: false
      },
      showTitle:{
        type: Boolean,
        default: true
      },
      limitPreview:{
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        styleHeight: {}//页面高度
      }
    },
    created:function () {
      if(document.documentElement.clientHeight>0){
        this.styleHeight={
          height:document.documentElement.clientHeight-40+'px'
        }
      }
    },
    mounted() {
      EventBus.$on('chatSendUtil',this.showPersonBack)                                  //监听@人
    },
    methods:{
      showPersonDetail:function (list){
        if(!this.limitPreview && list.userId!=_.userId){                                //显示个人信息弹窗
          EventBus.$emit("atThisPersonUtil",list);
        }
      },
      showPersonBack:function () {                                                    //关闭预览人员列表弹窗
        this.$emit('update:show',false)
      },
    }
  }
</script>
<style scoped>
	@media screen and (min-width: 1024px) {
		.qwui-user_show_box,.qwui-user_btn{
			width: 740px!important;
			margin: auto;
		}
	}
  .qwui-user_show_box{
    position: fixed;
    z-index: 3;
    top: 0;
	right:0;
    left:0;
    bottom: 0;
    width: 100%;
    background: #fff;
    overflow: hidden;
  }
  .qwui-user_select_head{
    display: flex;
    position: relative;
    padding: 14px 15px 4px 15px;
    line-height: 22px;
    font-size: 16px;
    color: #333;
  }
  .qwui-user_show_scroll{
    padding-left: 15px;
    overflow-y: scroll;
  }
  .qwui-user_show_scroll::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }
  .qwui-user_btn{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px 15px;
    background: #fff;
	box-sizing: border-box;
  }
  .qwui-user_btn:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
  .qwui-user_btn_back{
    display: block;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    color: rgba(51,51,51,1);
    text-align: center;
    text-decoration: none;
    background: rgba(251,250,252,1);
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
  }
  .qwui-user_footer_height{
    height: 60px;
  }
  .qwui-user_btn_back:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 10px;
  }
</style>
