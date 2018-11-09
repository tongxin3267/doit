<template>
  <div class="qwui-user-select-content">
    <div v-for="(item,index) in List" :key="index" v-if="index < rowNum || openMore"
      @click="previewPerson(item)" class="qwui-user_select_view">
      <a class="qwui-remove_icon"
         v-show="isRemove && isEdit"
         @click.stop="removeSelected(config.type,item[config.id],index)"></a>
      <p class="img">
        <img :src="defaultHeadpic(item[config.headpic],config.type)" alt="" class="qwui-user_select_img">
      </p>
      <p class="qwui-userInfo_name">{{item[config.name]}}</p>
    </div>
    <div class="qwui-user_select_add"
         v-if="isEdit"
         @click="showUserSelectedBox">
    </div>
    <div v-if="previewMore && isEdit" class="under_open">
      <p class="openIcon-box" @click="handleUserSelectList">
        <span>{{controlHiddenText}}<span class="userTotal-num">{{List.length}}</span>人</span>
        <i class="click_icon" :class="openMore ? 'click_icon_close': 'click_icon_open'"></i>
      </p>
    </div>
    <div v-if="previewMore && !isEdit" class="under_open">
      <p class="openIcon-box" @click="previewUserList">
        <span>查看全部<span class="userTotal-num">{{List.length}}</span>人</span>
        <i class="click_icon"></i>
      </p>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/utils/eventBus'
  const DEFAULTPIC= {
    'user':require('../../../assets/images/touxiang02.png'),
    'dept':require('../../../assets/images/dept_ico.jpg')
  }
  export default {
    name: "user_selected_item",
    props:{
      title: String,
      isEdit:{
        type: Boolean,
        default: true
      },
      isRemove: {   // 是否可删除
        type: Boolean,
        default: true
      },
      List: null,
      widthSize:{                         //宽度的内边距、外边距、边框，如paddingSize:5、marginSize: 10,borderSize:1
        type:Object,
        default(){
          return {
            paddingSize:0,
            marginSize:0,
            borderSize:0,
          }
        }
      },
      config:{
        type: Object,
        default() {
          return {id: 'id', name: 'personName',headpic:'headPic',type:'user'}
        }
      }
    },
    data() {
      return {
        isHidden: false,       // false: 默认展开
        rowNum: 0,
        openMore: false, //  展开更多
      }
    },
    computed:{
      // 已选择的数据
      selectedData() {
        if(this.List){
          return [...this.List]
        }
      },
      //显示预览更多箭头，15：左边距宽度，60：人员div宽度
      previewMore(){
        if(this.List){
          let len = this.isEdit ? 15 + 60: 15;
          this.rowNum = parseInt((this.getClientWidth() - len)/60);
          this.openMore = this.List.length > this.rowNum ?  false: true;
          return this.List.length > this.rowNum ? true: false;
        }else{
          return false
        }
      },
      //显示展开收起
      controlHiddenText() {
        return this.openMore ? '收起':'展开'
      }
    },
    methods: {
      getClientWidth(){
        let {
          paddingSize,
          marginSize,
          borderSize,
        } = this.widthSize;
        paddingSize = paddingSize? paddingSize:0;
        marginSize = marginSize? marginSize:0;
        borderSize = borderSize? borderSize:0;
        return document.body.clientWidth - paddingSize -marginSize - borderSize;
      },
      showUserSelectedBox() {
        this.$emit('showUserSelectedBox',true)
      },
      //收起展開
      handleUserSelectList() {
        this.openMore = !this.openMore
      },
      // 删除掉已选的
      removeSelected(key,id,index) {
        this.selectedData.splice(index,1)
        this.$emit('removeSelected',{
          key,
          id,
          index
        })
      },
      defaultHeadpic(val,key) {                            // 默认头像
        if(!val || val==0){
          return DEFAULTPIC[key]
        }
        return val
      },
      previewPerson(item){           //查看个人信息
        if(item.userId!=_.userId){
          this.$emit("atThisPersonUtil",item);
        }
      },
      previewUserList(){
        this.$emit('showPersonList',this.title,this.List);
      }
    },
  }
</script>
<style scoped>
  .qwui-user_select_add {
    position: relative;
    display: inline-block;
    width: 45px;
    margin: 7px 15px 18px 0;
    vertical-align: top;
  }
  .qwui-userInfo_name{
    display: inline-block;
    width: 45px;
    margin-top: 6px;
    font-size: 11px;
    color: #666;
    text-align: center;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qwui-user-select-content {
    display: inline;
  }
  .qwui-user_select_list_view li,.qwui-user_select_view{
    position: relative;
    display: inline-block;
    width: 45px;
    margin: 7px 15px 14px 0;
    text-align: center;
    list-style: none;
  }

  .right_open{
    position: absolute;
    margin-right: 15px;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 70px;
    text-align: center;
    cursor: pointer;
  }
  .under_open{
    position: relative;
    font-size: 14px;
    color: #999;
    text-align: center;
    cursor: pointer;
  }
  .openIcon-box{
    display: inline-block;
    position: relative;
    padding: 0 10px 10px;
  }
  .click_icon{
    display: inline-block;
    position: relative;
    margin-left: 10px;
    top: 3px;
    width: 10px;
    height: 15px;
    background: 0 0 url(../../../assets/images/CSSSprites.png) no-repeat;
    background-size: 100px 100px;
  }
  .click_icon_open{
    transform: rotate(90deg);
  }
  .click_icon_close{
    transform: rotate(-90deg);
  }
  .userTotal-num{
    padding: 0 5px;
  }
</style>
