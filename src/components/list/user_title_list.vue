<template>
  <li :style="styleObject" class="qwui-list" :class="['qwui-list_'+colorType]">
    <slot name="tip"></slot>
    <div class="qwui-list_item" @click.stop.prevent="routerLink">
      <router-link :to="toParams" :class="{'routerActive':showRightMenu}">
        <div class="qwui-list_item_box">
          <!--列表前置内容，如：个人头像-->
          <slot name="img">
            <p slot="img" class="qwui-person_headPic" v-if="headPic">
              <img class="img borderRadius" :src="headPic" alt=""/>
            </p>
          </slot>
          <div class="qwui-list_content_box">
            <!--默认标题插槽-->
            <slot name="title">
              <div class="qwui-list_title_box">
                <!--标题前置内容-->
                <slot name="prepend"></slot>
                <p class="qwui-list_item_title" :class="{active:title}">{{title}}</p>
                <!--标题后置内容-->
                <slot name="append">
                  <span class="title-append_time" v-if="titleTime">{{titleTime}}</span>
                </slot>
              </div>
            </slot>
            <!--自定义内容插槽-->
            <p class="qwui-list_item_user">
              <slot></slot>
            </p>
          </div>
        </div>
      </router-link>
      <!--列表后置内容，如：菜单弹窗-->
      <slot name="rightMenu" v-show="showRightMenu"></slot>
    </div>
  </li>
</template>
<script>
  export default {
    name: "user_title_list",
    props:{
      showRightMenu:{                     //可根据条件判断显示列表的右边菜单，显示则列表的右边距为50px
        type:Boolean,
        default:false
      },
      headPic:{                           //默认前置内容头像
        type:String
      },
      title:{                             //默认标题
        type:String
      },
      titleTime:{                        //标题的后置时间
        type:String
      },
      toParams:{                          //路由跳转的路径配置
        type:Object,
        required:false,
        default: function () {
          return {}
        }
      },
      styleObject:{                        //列表的最外层行内样式配置,默认左内边距为15px
        type:Object,
        default: function () {
          return {'paddingLeft': '15px'}
        }
      },
      colorType:{                         //列表的默认背景配置，默认为白色
        type:String,
        default:"FFF"
      }
    },
    data() {
      return {
      }
    },
    methods: {
      //列表内容点击回调
      routerLink(){
        if(JSON.stringify(this.toParams)=='{}'){
          this.$emit("routerLinkClick",true);
        }
      }
    }
  }
</script>
<style scoped>
  .qwui-list{
    position: relative;
  }
  .qwui-list_FFF{
    background: #fff;
  }
  .qwui-list_item{
    position: relative;
    font-size: 16px;
    line-height: 2.2;
    overflow: hidden;
  }
  .qwui-list_item .routerActive{
    padding-right: 50px;
  }
  .qwui-list_item a{
    display: block;
  }
  .qwui-list_item:before{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #dfdfdd;
    color: #dfdfdd;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 1;
  }
  .qwui-list:last-child .qwui-list_item:before{
    border-bottom: none;
  }
  .qwui-list_item_box{
    display: flex;
    padding: 15px 0;
    line-height: 1.4;
    overflow: hidden;
    cursor: pointer;
  }
  .qwui-list_title_box{
    display: flex;
  }
  .qwui-list_item_title{
    flex: 1;
    display: inline-block;
    margin-top: -3px;
    font-size: 16px;
    color: #333;
    line-height: 21px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-list_item_title.active{
    padding-right: 15px;
  }
  .title-append_time{
    display: inline-block;
    position: relative;
    margin-top: -2px;
    padding: 0 15px;
    font-size: 12px;
    color: rgb(153, 153, 153);
    line-height: 20px;
  }
  .qwui-list_content_box{
    flex: 1;
    overflow: hidden;
  }
  .qwui-list_item_user{
    display: flex;
    padding-top: 8px;
    font-size: 13px;
    color: #999;
    overflow: hidden;
    align-items: flex-end;
  }
  .qwui-list_menu_box{
    display: flex;
    position: absolute;
    top: 50%;
    margin-top: -25px;
    right: 0;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .qwui-list_menu_box.qwui-list_menu_more{
    background: url(../../assets/images/icon_more.png) center no-repeat;
    background-size: 3px;
  }
  .qwui-yuan_red{
    width: 9px;
    height: 9px;
    display: inline-block;
    margin: auto;
    background: #EB5342;
    border-radius: 50%;
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
  }
</style>
