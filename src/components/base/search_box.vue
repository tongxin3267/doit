<template>
  <div class="qwui-search_wrap"  :class="{'qwui-search_mask': setTopMask, 'qwui-no_mask':searchinput.ridMask}">
    <div class="qwui-search_bar">

        <!--菜单选项-->
        <div  class="qwui-search_title" v-if="searchinput.moreFunction && searchinput.moreFunction.show" @click.stop.prevent="chooseList = !chooseList">
            <span class="qwui-ellipsis">{{initChoose}}</span>
            <span class="qwui-search_san"></span>
          <span class="qwui-search_popsan" v-show="chooseList"></span>
          <ul class="qwui-search_pop" v-show="chooseList">
            <li v-for="(item,index) in searchinput.moreFunction.option" @click.stop.prevent="thisFunction(item)">{{item.name}}</li>
          </ul>
        </div>

        <!--输入按钮、搜索图标-->
        <div class="qwui-search_inner" :class="{'qwui-with_left_span':searchinput.moreFunction && searchinput.moreFunction.show}">
          <!--点击搜索图标-->
          <i class="qwui-icon_search" @click="search()"></i>
          <!--删除输入内容-->
          <i class="qwui-icon_del" v-if="getKeyWord != ''" @click="clearInput()"></i>
          <!--输入按钮-->
          <input class="qwui-search_input " v-model="getKeyWord" type="text" @click="clickInput($event.target)"
                 v-focus="inputFocus" @keyup.enter="search()" :placeholder="inputPlaceholder">
        </div>

      <!--不聚焦遮罩层-->
        <label class="qwui-search_text" :class="{'qwui-with_left_span':searchinput.moreFunction && searchinput.moreFunction.show,
         'with_right_span': searchinput.rightSpan && searchinput.rightSpan.show}" @click="closeThis()" v-if="showMask">
          <i class="qwui-icon_search"></i>
          <span>{{inputPlaceholder}}</span>
        </label>

      <!--右边图标-->
      <slot name="rightSpan"><div class="qwui-search_hanber" v-if="searchinput.rightSpan &&  searchinput.rightSpan.show" @click="clickRightSpan"></div></slot>


    </div>

    <!--聚焦白色图层-->
    <div @click="closeDialog" class="qwui-full_width"></div>
  </div>
</template>

<script>
  export default {
//    搜索框
    name:"searchBox",
    props:{
      keyWord:{
        type:String,
        required:false,
        default:""
      },
      searchinput:{
        type:Object
      },
      searchIndex:{
        type: Number,
        default: -1
      },
      placeholder:{
        type:String,
        default: ''
      },
    },
    data () {
      return {
        chooseList: false,
        initChoose: '',//选项菜单值
        inputPlaceholder: this.placeholder?this.placeholder:this.$t("i18n.search"),//搜索款遮罩层描述
        useTimeComponents: {}, //保存的当前输入框需要进行的特殊处理
        getKeyWord:this.keyWord,//关键字
        setTopMask:false,//点击聚焦后置顶
        inputFocus:false,//input进入聚焦状态，true:聚焦
        showMask:true,//显示遮罩层，false:聚焦状态，隐藏
        isSearching:false//true表示正在搜索，禁止再次提交emit
      }
    },
    watch:{
      'searchinput.keyWord':function (val) {
        this.getKeyWord = val;
        if(val){
          this.search();
        }
      },
      "keyWord":function (value) {
        this.getKeyWord = value;
      },
      'isSearching':function (val) {
        var _this = this;
        if(val){
          _this.intervalId = setInterval(() => {
            _this.isSearching = false;
          }, 1000);
        } else {
          clearInterval(_this.intervalId)
        }
      },
      'searchIndex': function (value) {
        let nowOption;
        if(this.searchinput && this.searchinput.moreFunction) {
          nowOption = this.searchinput.moreFunction.option[value];

          this.useTimeComponents = nowOption;
          if(this.initChoose != nowOption.name){
            this.initChoose = nowOption.name;
          }
          this.chooseList = false;
          this.inputPlaceholder = nowOption.placeholder?nowOption.placeholder: this.$t('i18n.search');
        }
      },
      //修改这个默认值，以改变显示在搜索框左部的显示值
      'searchinput.moreFunction.defaultChoose':function (val) {
        this.initChoose = val
      }
    },
    created:function(){
      let initIndex,
          moreFunction = this.searchinput.moreFunction;

      if (this.searchinput && moreFunction){
        initIndex = this.searchIndex < 0? 0: this.searchIndex;

        this.initChoose = moreFunction.option && moreFunction.option.length? moreFunction.option[initIndex].name:
                          moreFunction.defaultChoose? moreFunction.defaultChoose: '请选择';
        this.useTimeComponents = moreFunction.option && moreFunction.option.length? moreFunction.option[initIndex]: {};
      }

      if(this.getKeyWord){
        this.showMask=false;
      }
    },
    methods:{
      //点击输入按钮
      clickInput:function (event) {
        this.inputFocus=true;
        this.setTopMask = true;
        if(this.useTimeComponents.callback) {
          event? event.blur():"";
          this.useTimeComponents.callback();
          this.inputFocus=false;
        }
      },
      //点击选项菜单
      thisFunction:function (val) {
        this.useTimeComponents = val;
        this.searchinput.moreFunction.defaultChoose = val.name;
        if(this.initChoose != val.name){
          this.initChoose = val.name;
        }
        this.chooseList = false;
        this.inputPlaceholder = val.placeholder?val.placeholder:this.$t('i18n.search');
        //保存可能需要传回的值
        this.$emit("listenToSearchBox", this.getKeyWord, val.value != undefined?val.value:'', true);
      },

      //关闭白色聚焦图层
      closeDialog:function () {
        this.setTopMask = false;
        this.inputFocus = false;
        this.chooseList = false;
      },
      //点击遮罩层进入聚焦状态
      closeThis:function () {
        this.showMask = false;
        this.inputFocus = true;
        this.clickInput();
      },
      //点击删除图标
      clearInput:function () {
        this.getKeyWord = '';
        this.inputFocus = false;
      },
      //点击、回车搜索
      search:function () {
        if(!this.isSearching) {
          this.setTopMask = false;
          this.isSearching = true;
          this.$emit("listenToSearchBox", this.getKeyWord, this.useTimeComponents.value)
        }
      },
      //点击右边图标
      clickRightSpan:function () {
        if(this.searchinput.rightSpan.callback){
          this.searchinput.rightSpan.callback();
        }
      }
    }
  }
</script>
<style type="text/css">
  .qwui-search_wrap{
    position: relative;
  }
  .qwui-full_width{
    height: 100%
  }
  .qwui-search_mask{
    position: fixed;
    z-index: 11;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: white;
  }
  .qwui-no_mask{
    background:none
  }
  .qwui-search_bar {
    display: flex;
    position: relative;
    padding: 7px;
    background-color: #f0f0f0;
  }
  .qwui-search_bar:after, .qwui-search_pop li:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-search_inner {
    display: flex;
    position: relative;
    z-index: 6;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    background: #fff;
  }
  .qwui-with_left_span{
    padding: 0 55px 0 75px;
  }
  .qwui-search_text .qwui-icon_search {
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: text-bottom;
    background: url(../../assets/images/ic_search.png) no-repeat;
    background-size: 14px;
  }
  .qwui-search_inner .qwui-icon_search {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 14px;
    height: 14px;
    padding-left: 8px;
    border-left: 1px solid #ddd;
    background: url(../../assets/images/ic_search.png) right no-repeat;
    background-size: 14px;
    cursor: pointer;
  }
  .qwui-search_inner .qwui-icon_del {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 40px;
    width: 14px;
    height: 14px;
    margin: auto;
    padding: 0;
    border:none;
    background: url(../../assets/images/ic_del.png) no-repeat;
    background-size: 14px;
  }
  .qwui-search_inner .qwui-search_input {
    flex: 1;
    width: 100%;
    height: 19px;
    padding: 5px;
    border: 0;
    line-height: 19px;
    box-sizing: content-box;
    background: transparent;
    font: normal 13px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  }
  .qwui-search_text {
    position: absolute;
    z-index: 6;
    top: 1px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    margin: 5px;
    text-align: center;
    line-height: 30px;
    color: #9b9b9b;
    border-radius: 4px;
    background: #fff;
  }
  .qwui-search_text.with_right_span{
    margin-right: 45px;
  }
  .qwui-search_title {
    position: absolute;
    left: 3px;
    width: 56px;
    height: 19px;
    padding: 0 14px 0 8px;
    margin: 6px 0 3px;
    border-right: 1px solid #ddd;
    font-size: 13px;
    color: #666;
    text-align: center;
    cursor: pointer;
    z-index: 10;
  }
  .qwui-ellipsis {
    display: inline-block;
    width: 56px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-search_san {
    position: absolute;
    float: left;
    top: 6px;
    right: 5px;
    border-style: solid;
    border-color: transparent;
    border-width: 6px 5px;
    border-top-color: #9B9B9B;
  }
  .qwui-search_popsan {
    display: block;
    position: relative;
    width: 12px;
    height: 12px;
  }
  .qwui-search_popsan:before {
    content: "";
    display: table;
    font: 0/0 a;
    position: absolute;
    top: -5px;
    left: 0;
    margin-left: 36px;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #ddd transparent;
    z-index: 2;
  }
  .qwui-search_popsan:after {
    content: "";
    display: table;
    font: 0/0 a;
    position: absolute;
    top: -4px;
    left: 0;
    margin-left: 36px;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
    z-index: 2;
  }
  .qwui-search_pop {
    position: relative;
    left: -4px;
    top: -6px;
    width: 85px;
    padding: 0;
    margin: 0;
    max-height: 380px;
    font-size: 13px;
    text-align: center;
    background: #FFF;
    border-radius: 3px;
    overflow: auto;
  }
  .qwui-search_pop::-webkit-scrollbar{
    width: 0 !important;
  }
  .qwui-search_pop:before{
    content: '';
    position: absolute;
    left:0;
    width: 200%;
    height: 200%;
    border: 1px solid #ddd;
    transform-origin: 0 0;
    transform: scale(0.5, 0.5);
    box-sizing: border-box;
  }
  .qwui-search_pop li {
    position: relative;
    height: 39px;
    width: 100%;
    line-height: 39px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qwui-search_pop li:hover {
    background:#F5F5F5
  }
  .qwui-search_pop li:last-child:after{
    content:none
  }
  .qwui-search_hanber{
    float: right;
    width: 18px;
    height: 13px;
    padding: 9px 0 9px 17px;
    margin-right: 5px;
    background: url(../../assets/images/icon_more.png) center no-repeat;
    background-size: 3px;
    cursor: pointer;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
</style>
