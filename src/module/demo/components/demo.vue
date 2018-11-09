<template>
  <div>
    <div class="qwui-demo_top_title">
        <span class="qwui-demo_top_logo"></span>
    </div>
    <div class="qwui-demo_nav">
      <div class="qwui-demo_nav_box">
        <div class="qwui-demo_nav_header" v-for=" (item,index) in pageNav">
          <div class="qwui-demo_nav_title">{{item.header}}</div>
          <div class="qwui-demo_nav_child" v-for="(child,i) in item.child" @click="chooseActive($event);jumpTo(index,i)">{{child.title}}</div>
        </div>
      </div>
    </div>
    <!--!dataBase.selectConfig.show && !dataBase.detail.userListConfig.toPersonList.show-->
    <!--:class="{'active': dataBase.selectConfig.show || dataBase.detail.userListConfig.toPersonList.show}"-->
    <div>
      <div class="qwui-demo_right_detail">
        <div class="qwui-demo">
          <div class="qwui-demo_title">概述</div>
          <ul>
            <li><div class="qwui-demo_li_mg"><span>本文档描述如何使用自定义vue组件</span></div></li>
          </ul>
        </div>
        <div class="qwui-demo">
          <div class="qwui-demo_title">应用构成</div>
        </div>
        <!--alert弹窗-->
        <div class="qwui-demo">
          <div class="qwui-demo_title">alert弹窗</div>
          <ul>
            <li>
              <div class="qwui-demo_li_mg">
                <strong>默认结构</strong>
              </div>
              <pre><code class="language-javascript">  dialogConfig:{
      show:false,
      title:"",//标题
      type:"",
      content:[],//中间自定义内容
      canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
      btnConfig:{
        primaryBtn:{name:"", callBack:null}, //主操作按钮、回调函数
        defaultBtn:{name:"", callBack:null}, //次操作按钮、回调函数
      }
    }
</code></pre>
            </li>
            <li>
              <div class="qwui-demo_li_mg"><strong>用法</strong>
                <button class="qwui-demo_btn mg-l" @click="showDialogOne()" >演示</button>
              </div>
              <span>① 默认提示</span>
                <pre><code class="language-javascript">_.alert('标题', '这是弹窗提示内容')
                </code></pre>
              <div class="qwui-demo_li_mg">默认按钮为：确定，点击后关闭弹窗</div>
              <span>② 配置方法</span>
                <pre><code class="language-javascript">_.alert('标题', '这是弹窗提示内容',{
                  primaryBtn:{name:"确定",callBack:this.callBack},
                  defaultBtn:{name:"取消", callBack:null}
                  });
                </code></pre>
              <div class="qwui-demo_li_mg">不需要标题可传 " "，按钮名称name为空 " "不会显示该按钮,callBack为null默认点击即关闭弹窗</div>
            </li>
          </ul>
        </div>
        <!--showMsg弹窗-->
        <div class="qwui-demo">
          <div class="qwui-demo_title">showMsg弹窗</div>
          <ul>
            <li>
              <div class="qwui-demo_li_mg">
                <strong>默认结构</strong>
              </div>
              <pre><code class="language-javascript">  dialogConfig:{
      show:false,
      title:"",//标题
      type:"",
      content:[],//中间自定义内容
      canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
      btnConfig:{
        primaryBtn:{name:"", callBack:null}, //主操作按钮、回调函数
        defaultBtn:{name:"", callBack:null}, //次操作按钮、回调函数
      }
    }
</code></pre>
            </li>
            <li>
              <div class="qwui-demo_li_mg"><strong>用法</strong></div>
              <span>① 配置方法</span>
              <pre><code class="language-javascript">var content=[
      {type:"updateRateType",updateRateType:{rateValue:"进度值", limit:"限制拖动区间值"}},//拖动进度条
      {type:"rateType",rateList: [{text: "", time: "", rateValue: ""}],//进度条列表
      {type:"radioType",radioType:{title:"选项题目", list:[{text:"选项", value:"选项值"}],}} //单选项
      {type:"scoreType",scoreType:{title:"评分标题",num:"星星总数",score:"总分"}} //评分
      {type:"dateTime", dateTime:{title:"时间标题",value:"当前时间值"}}  //选时间
      {type:"comment",comment:{maxLength:'限制字数长度',placeholder:"描述内容",value:"内容值"}}, //评论框
      ];
var btnConfig={
      primaryBtn:{name:'确定', callBack:this.callBack}, //主操作按钮
      defaultBtn:{name:"取消", callBack:null}, //次操作按钮
};

_.showMsg('标题',content, btnConfig)
              </code></pre>
              <div class="qwui-demo_li_mg">content为自定义内容,通过push操作content数值可自定义内容的排列顺序</div>
              <div class="qwui-demo_li_mg">不需要标题可传 " "，按钮名称name为空 " "不会显示该按钮,callBack为null默认点击即关闭弹窗</div>
              <span>② 红色错误提示</span>
 <pre><code class="language-javascript">
_.alertError("这个是错误描述",相应位置（类型：Number）);
 </code></pre>
              <div class="qwui-demo_li_mg">Number为0时，错误提示在第一个位置，为1时，错误提示在第二个位置</div>
              <span>③ 弹窗演示</span>
              <div class="qwui-demo_tips_word">
                <button class="qwui-demo_btn mg-t" v-for="item in dialogTwoBtn"@click="showDialogTwo(item.value)" >{{item.title}}</button>
                <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript"></code></pre></div>
                注意选人弹窗里面包含的是单独的选人控件(下面会讲到)，这里需要通过
                <span class="qwui-demo_font_code">this.dataBase.selectConfig.selectList["ccPersonList"].title="这是标题"</span>
                来控制弹窗的标题。<br/>另外，可以调用公共方法里的
                <pre><code class="language-javascript">   _.alertError("这个是错误提示",0);</code></pre>
                来进行点击确定后的判断提示
              </div>
            </li>
          </ul>
        </div>
        <!--loading弹窗-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title"> 加载中 + 操作成功</div>
          <ul>
            <li>
              <div class="qwui-demo_li_mg">
                <strong>默认结构</strong>
              </div>
<pre><code class="language-javascript">  loading:{
    show:false,
    text:"",
    name:"",
  }</code></pre>
            </li>
            <li>
              <div class="qwui-demo_li_mg"><strong>用法</strong></div>
              <span>①showLoading    加载中、提交中...等描述</span>
<pre><code class="language-javascript">_.showLoading("描述提示",Boolean);</code></pre>
              <div class="qwui-demo_li_mg">  Boolean为true则透明遮罩显示页面，Boolean为false则白底遮罩隐藏页面，Boolean不传默认隐藏页面；</div>
              <div class="qwui-demo_li_mg"> 描述提示为空默认为加载中，可自定义描述如：提交中...、修改中...等、请求中...等；</div>

              <span>② hideLoading   隐藏loading弹窗</span>
              <pre><code class="language-javascript"> _.hideLoading();</code></pre>

              <span>③ 删除成功等描述</span>
              <pre><code class="language-javascript">_.tooltips_succeed("XXX");</code></pre>
              <div class="qwui-demo_li_mg">  该方法调用loading组件，提示图标为"打勾√"图标和描述提示；</div>
              <div class="qwui-demo_li_mg">  描述提示XXX不可为空；</div>
              <span>④ 演示</span>
              <div class="qwui-demo_tips_word">
                <button class="qwui-demo_btn" @click="showLoading">loading演示</button>
              </div>
              <div class="qwui-demo_tips_word">
                <button class="qwui-demo_btn" @click="showToast">tooltips_succeed演示</button>
              </div>
            </li>
          </ul>
        </div>
        <!--头部导航-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">头部导航菜单</div>
          <ul>
            <li>
              <div class="qwui-demo_li_mg">
                <strong>默认结构</strong>
              </div>
              <pre><code class="language-javascript">data:{
  show:true,
  nav:[
       {class:"ic_add", text:"新建", url:"路由名称"},
       {class:"ic_draft", text:"草稿", url:"路由名称", num:"列表总条数"}],
  searchBar:{
       show:false,//搜索框，默认显示
  }
}</code></pre>
            </li>
            <li>
              <div class="qwui-demo_li_mg"><strong>用法</strong></div>
              <span>① 传值props</span>
              <pre><code class="language-javascript">< home-head-nav :headrdata="data" v-on:getSearchRequest="getSearchRequest"></home-head-nav></code></pre>
              <header>
                <home_head_nav :headrdata="dataBase.home_head"></home_head_nav>
              </header>
              <div class="qwui-demo_li_mg"> 头部组件固定在界面顶部，带有一个搜索框, headData为数据结构（自定义名称），headrdata为props名称（固定写法）</div>
              <div class="qwui-demo_li_mg">  v-on:getSearchRequest="getSearchRequest" 为搜索框的触发事件，没有用到搜索框可不要</div>
              <div class="qwui-demo_li_mg">搜索框组件通过输入关键字触发getSearchRequest执行父组件中的 getSearchRequest方法，传参为关键字的值</div>
            </li>
          </ul>
        </div>
        <!--搜索框-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">搜索框</div>
          <search_box :searchinput="dataBase.searchBar" ></search_box>
          <ul>
            <li>
              <div class="qwui-demo_li_mg">
                <strong>默认结构</strong>
              </div>
            </li>
          </ul>
          <div class="qwui-demo_tips_word">
            说明：点击会弹出遮罩层，再点击空白处复原，父组件使用时
            可以在方法里通过"<span class="qwui-demo_font_code">showMsgFromSearchBar:function (val)" 和 "passValueThis:function(val)</span>"获取，
            前一个即是搜索框传来的值，后一个是左边选项功能的自定义值，即<span class="qwui-demo_font_code">moreFunction.option里的value</span>。
          </div>
        </div>
        <!--Tab选项菜单-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">tab选项卡</div>
          <div class="qwui-demo_tips_word">
            选项卡也有两种：<br/><div class="qwui-demo_item">①首页会用到的。</div>
            <menu_tab_two :selectdata="dataBase.selectData" ></menu_tab_two>
            <br/>传入参数格式如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;menu_tab_two :selectData="dataBase.selectData" v-on:listenToChild="showMsgFromSelectCard">
selectData: {
  index:0,
  scroll:true,//是否开启滚动置顶功能
  bottomLength: '90px',//底部横线的宽度
  nav:[
    {
      content: '未阅',
      data:{ //点击切换传递的数据
        page:1,
        pageSize:10,
        keyWord:'',
        status:3,
        type:2
      },
    },
    {
      content: '逾期',
      data:{ //点击切换传递的数据
        page:1,
        pageSize:10,
        keyWord:'',
        status:5,
        type:2
      },
    },
    {
      content: '已关闭',
      data:{ //点击切换传递的数据
        page:1,
          pageSize:10,
          keyWord:'',
          status:2,
          type:2
      },
    }
  ]
},
            </code></pre></div>
            通过<span class="qwui-demo_font_code">showMsgFromSelectCard:function (val, index)</span>获取点击的nav[index]和index值
            <div class="qwui-demo_item">②详情里用到的。</div>
            <menu_tab :menudata="dataBase.menuData"></menu_tab>
            <br/>传入参数格式如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;menu_tab :menudata="dataBase.menuData">
menuData:{
  show:false, //控制显示与否
  navNum:0, //当前点击的是哪个
  navBar:[
    {
      name:"全部", //标题
      num:"2", //标题后带的数字
      data:{type:"0"}, //执行回调要用的数据
      callBack:null //回调函数
    },
    {name:"已完成",num:"3",data:{type:"1"},callBack:null},
    {name:"未完成",num:"4",data:{type:"2"},callBack:null},
  ],
},
            </code></pre></div>
          </div>
        </div>
        <!--加载列表-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">load_more</div>
          <div class="qwui-demo_tips_word">
            <load_more :loadmore="dataBase.loadMore"></load_more>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;load_more :loadmore="dataBase.loadMore" ref="loadMoreFun">

loadMore:{//加载更多组件
  url:"",     //请求路径
  pageIndexName:"page",//不同应用不同分页参数
  data:{ //ajax入参数据
    keyWord:'',
    page:1,
    status:0,
    toptypes:''
  },
  padeConfig:{
    currPage:"",
    maxPage:"",
    pageData:[],  //返回的列表数据
    totalRows:""//数据总条数
  },
  hasRecord:{
    show:false,
    setTop:false,//是否置顶?覆盖整个页面
    icon:"qwui-icon_box",
    title:"没有快递记录",//若text无内容则title为16px #bbb，有则为18px #666
    text:"手机扫码快速录入、一键催领"//标题下面的提示
  }
}
            </code></pre></div>
            <span class="qwui-demo_font_code">ref="loadMoreFun"</span>需要手动使用，即在你的列表页面中写一个loadingData方法，如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
resetRequestListData:function(){ //重新请求列表数据
  this.loadMore.data.page=1; //重新设定参数
  this.loadMore.padeConfig={
    currPage:"",
    maxPage:"",
    pageData:[],  //返回的列表数据
    totalRows:""//数据总条数
  };
  this.$refs.loadMoreFun.requestData();
}
            </code></pre></div>
          </div>
        </div>
        <!--底部导航-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">底部导航</div>
          <div class="qwui-demo_tips_word">
            底部导航有两种：<br/><div class="qwui-demo_item">①底部按钮。</div>
            <footer_button :footernavdata="dataBase.footerButton"></footer_button>
            传入参数格式如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
footerButton: {
  text: "录入快递",
  callBack: null
}
            </code></pre></div>
            <div class="qwui-demo_item">②底部nav</div>
            <footer>
              <footer_nav :footernavdata="dataBase.home_footer"></footer_nav>
            </footer>
            <div class="qwui-demo_tips_word">
              <p>说明：固定在界面底部，使用时传入的参数结构为:</p>
              <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
home_footer:{
  nav_on:0, //当前点击的是哪个
  nav:[ //可配置底部菜单
    {
      class:"ic_tabar1", //样式
      text:"我发起的",
      data:{ //url参数
        page:1,
        pageSize:10,
        keyWord:'',
        status:1,
        type:1
      },
      url:"",
      callBack:null
    },
    {
      class:"ic_tabar2",
      text:"待我处理",
      data:{
        page:1,
        pageSize:10,
        keyWord:'',
        status:0,
        type:2
      },
      url:"",
      num:"3", //右上角显示的badge
      callBack:null
    },
    {
      class:"ic_tabar3",
      text:"我相关的",
      data:{
        page:1,
        pageSize:10,
        keyWord:'',
        status:3,
        type:2
      },
      url:"",
      callBack:null
    }
  ]
}
            </code></pre></div>
            </div>
          </div>
        </div>
        <!--列表操作弹窗-->
        <div class="qwui-demo" >
            <div class="qwui-demo_title">列表操作弹窗</div>
            <div class="qwui-demo_tips_word">
              <button class="qwui-demo_btn" @click="showDialogBottom()">演示</button><span>说明：使用方法j及调用的数据格式如下</span>
              <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
import dialog_mask_bottom from '../../../components/base/dialog_mask_bottom.vue' //js里的调用
components:{dialog_mask_bottom} //js组件声明
&lt;dialog_mask_bottom :dialogConfig="dialogBottomConfig"> //html里的使用

dialogBottomConfig:{
  show: false, //控制弹窗显示与否
  title: "tryThis", //头部标题，设置为空的话不显示
  btnConfig:[ //自定义弹框操作,可以设置回调函数
    {title:" 结束作业", callBack: null},
    {title:" 编辑并重新提交", callBack: null},
    {title:" 删除", callBack: null, primary:true},//primary为true显示为红色，默认为灰色
    {title:" 取消", callBack: null}
  ]
}
              </code></pre></div>
            </div>
        </div>
        <!--下拉选择+标题+输入框-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">新增头部信息</div>
          <div class="qwui-demo_tips_word">
            <add_title :dataDetailMsg="dataBase.add.add_nav"></add_title>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;add_title :dataDetailMsg="dataBase.add.add_nav" v-on:listenToChild="showMsgFromDataDetail">

add_nav:{ //数据详情头部信息
  nav: '作业类型', //头部标题
  titlePlaceholder: '请输入作业标题',
  contentPlaceholder: '请输入作业内容',
  homeworkTemplate: {
    show: true,
    data: [],
    url: '/portal/homeworkAction!getHomeworkTemplate.action',
  },
  detailData: [], // 编辑/复制等存在的原数据,0:option，1:标题，2:内容
}
            </code></pre></div>
            <span class="qwui-demo_font_code"> showMsgFromDataDetail(val)</span>
            返回的val是一个数组，val[0]是option的值，val[1]是标题的值，val[2]是内容的值
          </div>
        </div>
        <!--图片上传-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">新增图片</div>
          <div class="qwui-demo_tips_word">
            <add_img :dataDetailMsg="dataBase.add.imgUpload"></add_img>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;add_img :dataDetailMsg="dataBase.add.imgUpload" v-on:listenToChild="showMsgFromImgDetail">

imgUpload: {
  picList: [], // 编辑/复制等存在的原数据
  clearCache: false, //用来提交完成后清空图片显示列表
  url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action'
},
            </code></pre></div>
            其中<span class="qwui-demo_font_code"> showMsgFromImgDetail(val)</span>
            返回的val是一个上传的图片url组成的数组；clearCache使用的时候改变就行，如clearCache = !clearCache
          </div>
        </div>
        <!--附件上传-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">新增文件</div>
          <div class="qwui-demo_tips_word">
            <add_file :dataDetailMsg="dataBase.add.fileUpload"></add_file>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;add_file :dataDetailMsg="dataBase.add.fileUpload" v-on:listenToChild="showMsgFromFileDetail">

fileUpload: {
  mediaList: [], // 编辑/复制等存在的原数据
  url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
},
            </code></pre></div>
            其中<span class="qwui-demo_font_code"> showMsgFromFileDetail(val)</span>
            返回的val是一个上传的附件id组成的数组
          </div>
        </div>
        <!--时间选择-->
        <div class="qwui-demo">
          <div class="qwui-demo_title">时间选择</div>
          <time_detail></time_detail>
          <div class="qwui-demo_tips_word">
            说明：父组件使用时
            <div class="qwui-demo_overflow_hidden">
              <pre><code class="language-javascript">&lt;time_detail :hasData="timeData" v-on:listenToChild="showMsgFromTimeDetail"></code></pre>
            </div>
            通过"<span class="qwui-demo_font_code">showMsgFromTimeDetail:function (startTime, endTime){}</span>"获取，
            timeData（可以不写）是传入的初始化数据，是含有两个<span class="qwui-demo_font_code">yyyy-MM-dd hh:mm</span>时间格式字符串的数组</p>
          </div>
        </div>
        <!--负责人、相关人-->
        <!--高级设置-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">高级设置</div>
          <div class="qwui-demo_tips_word">
            <advanced_setting :dataDetailMsg="dataBase.advancedSetting"></advanced_setting>
            说明：主要用于新增/编辑页面，自定义数据格式如下，hasData是用来处理编辑页面有数据，switchControl是自定义内容，
            <span class="qwui-demo_font_code">showMsgFromAdvancedSetting:function(val1, val2)</span>可以获取传来的优先级值及一个高级设置的1/0数组
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;advanced_setting :hasData="settingData" :dataDetailMsg="dataBase.advancedSetting" v-on:listenToChild="showMsgFromAdvancedSetting">
advancedSetting: {
  switchControl: [ // 内容
    {content: '开始前30分钟提醒', onOff: true},
    {content: '截止前30分钟提醒', onOff: true},
    {content: '启用进度反馈', onOff: true},
    {content: '允许负责人结束作业', onOff: true},
    {content: '负责人信息相互可见', onOff: true}
  ],
  levelData: {
    show:true,
    data:[ // 优先级
      {id: 0, level: '普通'},
      {id: 1, level: '!不紧急但重要'},
      {id: 2, level: '!!紧急但不重要'},
      {id: 3, level: '!!!紧急且重要'}
    ]
  },
  option:[]
},
            </code></pre></div>
          </div>
        </div>
        <!--操作按钮-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">按钮</div>
          <div class="qwui-demo_tips_word">
            说明：排列在一行内用来操作的按钮，分为 主要蓝色按钮 和 默认灰色按钮 两个自定义数组，主要蓝色按钮一般只用一个
            <flow_button :buttondata="dataBase.buttonConfig"></flow_button>
            传入参数格式如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;flow_button :buttondata="dataBase.buttonConfig">
buttonConfig:{ //操作按钮
  primaryList:[
    {type:"primary",name:'立即提交',callBack:null},
  ],
  defaultList:[
    {type:"default",name:'保存', callBack:null},
    {type:"default",name:'草稿', callBack:null}
  ],
  style:{class:""}//按钮是否置底部 active :底部、"":相对定位
},
            </code></pre></div>
          </div>
        </div>
        <!--详情头部-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">详情头部信息</div>
          <div class="qwui-demo_tips_word">
            <detail_title :titledata="dataBase.detail"></detail_title>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;detail_title :titledata="dataBase.detail">

detail:{ //详情内容
  openPrint:true,
  creator:"",
  personName:"道一",
  createTime:"2018-02-23 16:21:48",
  describes:[{content:'语文', text:'类型'},{content:'2018-03-02 09:00',text:'开始时间'},{content:'2018-03-04 09:00',text:'截止时间'}],
  content:"这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容",
  configCopy:{},//复制页面信息到新建页面
  picList:[],//上传的图片列表
  mediaList:[],//上传的附件列表
  isUseRate:"1",
  priority:"1",
  status:{active:'true',class:'status_gray', name:'已过期'},
  title:'员村一横路'
}
            </code></pre></div>
          </div>
        </div>
        <!--负责人、相关人-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">详情负责人/相关人</div>
          <div class="qwui-demo_tips_word">
            <user_selected :userselect="dataBase.detail.userListConfig"></user_selected>
            <user_show :userselect="dataBase.detail.userListConfig"></user_show>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;user_selected :userselect="dataBase.detail.userListConfig">
&lt;user_show :userselect="dataBase.detail.userListConfig">

userListConfig:{ //负责人、相关人
  toPersonList:{
    show:false,
    title: "相关人(可查看、评论)",
    num:5,
    userSelected: [], //这里是详情传过来的人，这里不显示出来
    callBack: null
  },
  ccPersonList:{
    show:false,
    title: "负责人(家长)",
    num:5,
    userSelected: [], //这里是详情传过来的人，这里不显示出来
    callBack: null
  }
},
            </code></pre></div>
            <span class="qwui-demo_font_code">user_selected</span>是上面的界面，
            <span class="qwui-demo_font_code">user_show</span>是人数超过5之后点击<span class="qwui-demo_font_code">user_selected</span>右边出现的 可点击箭头 出现的页面
          </div>
        </div>
        <!--负责人、相关人查看预览-->
        <!--评论列表-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">评论列表</div>
          <div class="qwui-demo_tips_word">
            <list_comment :listcomment="dataBase.listComment"></list_comment>
            说明：传参使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;list_comment :listcomment="dataBase.listComment">

listComment:{ //评论
  get:{  //获取
    url:"/portal/homeworkAction!listComment.action",
    pageIndex:1,//当前页面
    data:{
      id:"",
      size:10,
      commentStatus:"1",//1只看评论，2显示全部
      page:1,
    },
  },
  send:{ //发送
    url:"/portal/homeworkAction!commitComment.action",
    contentObject:'tbQyHomeworkCommentPO.content',//传送的内容字符串
    data:{}
  },
  delete:{ //删除
    url:"/portal/homeworkAction!deleteComment.action",
    commentId:"commentId",//需要传的id字段
    data:{
    }
  },
  comments:[]//评论数据列表，这里不显示出来
},
            </code></pre></div>
            评论框和评论列表所传的数据是同一个
          </div>
        </div>
        <!--评论输入框-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">评论框</div>
          <div class="qwui-demo_tips_word">
            <chat_comment :listcomment="dataBase.listComment"></chat_comment>
            说明：数据格式如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;chat_comment :listcomment="dataBase.listComment">
listComment:{ //评论
  get:{  //获取
    url:"/portal/homeworkAction!listComment.action",
    pageIndex:1,//当前页面
    data:{
      id:"",
      size:10,
      commentStatus:"1",//1只看评论，2显示全部
      page:1
    }
  },
  send:{ //发送
    url:"/portal/homeworkAction!commitComment.action",
    contentObject:'tbQyHomeworkCommentPO.content',//传送的内容字符串
    data:{}
  },
  delete:{ //删除
    url:"/portal/homeworkAction!deleteComment.action",
    commentId:"commentId",//需要传的id字段
    data:{
    }
  },
  comments:[] //评论数据列表
}
            </code></pre></div>
          </div>
        </div>
        <!--头像个人信息-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">头像个人信息</div>
          <div class="qwui-demo_tips_word">
            说明：点击头像显示个人信息详情<br/>
            <li class="qwui-demo_user_info" @click="showUserInfoCard">
                <img :src="userInfoData.headPic">
            </li>
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
import user_info from '@/components/detail/user_info_card';
&lt;user_info ref="loadPersonalMsg" @getNewHeadPic="newHeadPic">

showUserInfoCard:function () {//点击头像事件
  //this.userInfoData为一个含有该成员的数据的对象，包括id和头像等
  //true表示不需要用到@功能(默认为含有@功能)
  this.$refs.loadPersonalMsg.showUserMessage(this.userInfoData,true);
},
newHeadPic:function (item) {//获取组件传来的新头像url
  this.userInfoData.headPic = (item&&item!="0")?item:this.userInfoData.headPic;
},
            </code></pre></div>
            该组件会自动刷新该成员最新头像并返回url
          </div>
        </div>
        <!--选人-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">选人</div>
          <div class="qwui-demo_tips_word">
            说明：主要用于新增/编辑页面，分两种：<br/><div class="qwui-demo_item">①单次选人，需要展示头像</div>
            <user_add :userselect="dataBase.selectConfig" ></user_add>
            使用时直接调用下面的代码
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;user_add :userselect="dataBase.selectConfig" @selectPerson="selectPerson">

selectConfig:{
  show:false,
  signIndex:'',
  selectList:{
    "ccPersonList": {
      "title":"道一",
      "selectType": "user",
      "userName": "relatives",
      "userSelected": [],
      "callBack": {
        "confirm": null
      }
    },
  }
},

//确定选择的人员返回的数据
selectPerson(el,obj){
  if(obj && obj.user){
    str = obj.user.idStr.replace(/\|/g,",");
  }
},
            </code></pre></div>
            <span class="qwui-demo_font_code">selectPerson(el,obj)</span>
            el在单次选人中用不上，obj.user.idStr是选好人后返回的id组成的字符串，中间以 '|' 隔开
            <div class="qwui-demo_item">②多次选人，只显示数目。</div>
            <user_select :selectconfig="dataBase.selectConfig"></user_select>
            使用时调用：
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
import user_select from '../../../components/add/user_select_icon_right.vue'
import user_choose from '../../../components/base/user_or_dept_select.vue' //js导入
components:{user_select, user_choose} //js组件声明
&lt;user_select>&lt;/user_select>
&lt;user_choose v-if="dataBase.selectConfig.show">&lt;/user_choose> //html引用

selectConfig:{ //负责人、相关人
  show:false,
  signIndex:'',
  selectList:{
    "toPersonList": {
      "title":"",
      "selectType": "user",
      "userName": "incharges",
      "userSelected": [],
      "callBack": {
        "confirm": null
      }
    },
    "ccPersonList": {
      "title":"",
      "selectType": "user",
      "userName": "relatives",
      "userSelected": [],
      "callBack": {
        "confirm": null
      }
    },
  }
},

selectPerson(el,obj){
  if(el=="toPersonList"){
    str = obj.user.idStr;
  }
  if(el=="ccPersonList"){
    str = obj.user.idStr;
  }
},
            </code></pre></div>
            其中<span class="qwui-demo_font_code">user_select</span>是上面的负责人/相关人界面，
            <span class="qwui-demo_font_code">user_choose</span>是点击后的界面，
            <span class="qwui-demo_font_code">selectPerson(el,obj)</span>
            el是组件自动返回的字符串来识别 相关人/负责人，obj.user.idStr是选好人后返回的id组成的字符串，中间以 '|' 隔开
          </div>
        </div>
        <!--标签状态-->
        <div class="qwui-demo" >
          <div class="qwui-demo_title">状态标签</div>
          <div class="qwui-demo_tips_word">
            <div class="left_ten">
              <div v-for="item in dataBase.statusFormat" class="fl_l"><apply_status :applystatus="item"></apply_status></div>
            </div>
            <br/>说明：传参只需要传一个对象，使用如下
            <div class="qwui-demo_overflow_hidden"><pre><code class="language-javascript">
&lt;div v-for="item in dataBase.statusFormat">
  &lt;apply_status :applystatus="item">&lt;/apply_status>
&lt;/div>
statusFormat:[
  {
     name:"进行中", //标签内容
     class:"status_blue", //标签颜色
     active:false //false为默认，true加了"padding:3px"会大一些
  },
  {name:"已关闭", class:"status_gray", active:false},
  {name:"已完成", class:"status_green", active:false},
  {name:"有问题", class:"status_red", active:true},
  {name:"等待中", class:"status_orange", active:true}
]
            </code></pre></div>
          </div>
        </div>
        <!--扫码-->
        <!--无记录、无权限等图标-->


      </div>
      <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
      <dialog_mask></dialog_mask>
      <loading></loading>
      <user_choose :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_choose>
      <user_info ref="loadPersonalMsg" @getNewHeadPic="getNewHeadPic"></user_info>
    </div>
  </div>
</template>
<script>
import dialog_mask_bottom from '../../../components/base/dialog_mask_bottom.vue'
import dialog_mask from '../../../components/base/dialog_mask.vue'
import loading from '../../../components/base/loading.vue'
import search_box from '../../../components/base/search_box.vue'
import time_detail from '../../../components/base/time_detail.vue'
import home_head_nav from '../use/home_head_nav';
import footer_nav from '../use/footer_nav';
import footer_button from '../use/home_footer_button.vue'
import menu_tab from '../../../components/button/menu_tab.vue'
import flow_button from '../../../components/button/flow_button.vue'
import menu_tab_two from '../../../components/button/menu_tab_two.vue'
import chat_comment from '../use/chat_comment'
import advanced_setting from '../../../components/add/advanced_setting'
import user_select from '../../../components/add/user_select_icon_right.vue'
import user_choose from '../../../components/base/user_or_dept_select.vue'
import user_add from '@/components/add/user_select_build'
import apply_status from '../../../components/part/apply_status'
import add_title from '@/components/add/add_title'
import add_img from '@/components/add/add_img'
import add_file from '@/components/add/add_file'
import detail_title from '@/components/detail/detail_title';
import user_selected from '@/components/detail/user_select';
import user_show from '@/components/base/user_show';
import list_comment from '@/components/detail/list_comment';
import load_more from '@/components/base/load_more.vue';
import user_info from '@/components/detail/user_info_card';//个人信息

// import home_head_nav from ''
export default {
  data(){
    return {
      dataBase:dataBase,
      dialogBottomConfig: dataBase.dialogBottomConfig,
      dialogTwoBtn:dataBase.dialogTwoBtn,
      isClick: false,
      isClickTwo: false,
      isClickThree:false,
      userInfoData:{
        askStatus:0,
        countDay:0,
        createTime:null,
        diaryId:"",
        headPic:"http://shp.qpic.cn/bizmp/ck4hSGq23RjwqBQey4e03ZLMQp2shwPiarNR8LEic22BEK5OrIibC0wVg/100",
        id:"f35c2a6369854948b8b42d525e51ee6a",
        notSubmit:0,
        orgId:"",
        personName:"李泽伟",
        ruleId:"",
        userId:"d48e46e15fda09f371bca36d8e95f865"
      },
      pageNav:[
        {header:"开发前必读",
          child:[
            {title:"概述"},
            {title:"应用构成"},
          ]},
        {header:"全局必配组件",
          child:[
            {title:"alert弹窗"},
            {title:"showMsg弹窗"},
            {title:"loading+toast弹窗"},
          ]},
        {header:"首页组件",
          child:[
            {title:"头部导航"},
            {title:"搜索框"},
            {title:"Tab选项菜单"},
            {title:"加载列表"},
            {title:"底部导航"},
            {title:"列表操作弹窗"},
          ]},
        {header:"新建组件",
          child:[
            {title:"下拉选择+标题+输入框"},
            {title:"图片上传"},
            {title:"附件上传"},
            {title:"时间选择"},
//            {title:"负责人、相关人"},
            {title:"高级设置"},
            {title:"操作按钮"},
          ]},
        {header:"详情组件",
          child:[
            {title:"详情头部"},
            {title:"负责人、相关人(预览)"},
            {title:"评论列表"},
            {title:"评论输入框"},
            {title:"头像个人信息"},
          ]},
        {header:"其他组件",
          child:[
            {title:"选人"},
            {title:"标签状态"},
            {title:"扫码"},
            {title:"无记录、无权限等图标"},
          ]},
      ]
    }
  },
  mounted:function(){
    //Prism.highlightElement(document.querySelectorAll("code"));
    Prism.highlightAll()
  },
  methods:{
    chooseActive:function (val) { //val.target当前点击的元素，当前点击的选中状态
      document.querySelectorAll('.qwui-demo_nav_child').forEach(function (e) {
        if(e.className == 'qwui-demo_nav_child active'){
          e.className = 'qwui-demo_nav_child'
        }
      });
      val.target.className = 'qwui-demo_nav_child active'
    },
    showDialogBottom:function () {
      var self = this;
      self.dialogBottomConfig.show = !self.dialogBottomConfig.show;
    },
    showDialogOne:function () {
      _.alert('标题', '这是弹窗提示内容')
    },
    showUserInfoCard:function () {//点击头像显示详情
      this.$refs.loadPersonalMsg.showUserMessage(this.userInfoData,true);
    },
    getNewHeadPic:function (item) {//获取新头像
      this.userInfoData.headPic = (item&&item!="0")?item:this.userInfoData.headPic;
    },
    showDialogTwo:function (val) {
      if(val == 1){
        var content = [
          { type:"rateType", //进度列表
            rateList:[
              {text:"道一",time:"2018-01-01",rateValue:"0"},
              {text:"do1",time:"2018-12-31",rateValue:"100"}
            ],
          },
        ];
      } else if(val == 2){
        var content = [
          { type:"updateRateType",
            updateRateType:{
              rateValue:"",
              limit:10
            }
          }
        ];
      } else if(val == 3){
        var content = [
          { type:"radioType",
            radioType: {
              title: "单选",
              list: [{text: "完成", value: "0"}, {text: "终止", value: "1"}, {text: "取消", value: "2"}
              ]
            }
          }
        ];
      } else if(val == 4){
        var content = [
          { type:"scoreType",
            scoreType: {//评分
              title: "评分",//小标题
              length: 10,//星级10个
            },
          }
        ];
      } else if(val == 5){
        var content = [
          { type:"dateTime",
            dateTime: {
              title: "",//头部标题
              timeValue: "2018-01-01 10:00"//值
            },
          }
        ];
      } else if(val == 6){
        var content = [
          { type:"comment",
            comment: {//评语
              maxLength: '',//限制字数长度
              placeholder: "",//描述提示
              value: "",//评语值
            }
          }
        ];
      } else {
        this.dataBase.selectConfig.selectList["ccPersonList"].title="这是标题";
        var content = [
          {type:"relative", data:{}},
        ];
      }
      var buttonConfig = {
        primaryBtn:{name:"确定", callBack:this.showError},
        defaultBtn:{name:"取消", callBack:null},
      };
      _.showMsg('标题', content, buttonConfig)
    },
    showError:function () {
      _.alertError("这个是错误提示",0);
    },
    showLoading:function () {
      _.showLoading('xxx');
      setTimeout(function () {
        _.hideLoading();
      },2000);
    },
    showToast:function () {
      _.tooltips_succeed("xxx");
    },
    jumpTo:function(index,childIndex) { //锚点定位方法
      var jump = document.querySelectorAll('.qwui-demo');
      var position = 0;
      for(var i=0;i<index;i++){
        position += this.pageNav[i].child.length;
      }
      position += childIndex;
      var total = jump[position].offsetTop;
      var distance = document.querySelectorAll('.qwui-demo_right_detail')[0].scrollTop;
      // 平滑滚动，时长500ms，每10ms一跳，共50跳
      var step = total / 50;
      if (total > distance) {
        this.smoothDown(distance, total, step)
      } else {
        var newTotal = distance - total;
        step = newTotal / 50;
        this.smoothUp(distance, total, step)
      }
    },
    smoothDown:function (distance, total, step) { //平滑向下滚动
      var self = this;
      if (distance < total) {
        distance += step;
        document.querySelectorAll('.qwui-demo_right_detail')[0].scrollTop = distance;
        setTimeout(function () {
          self.smoothDown(distance, total, step)
        },10);
      } else {
        document.querySelectorAll('.qwui-demo_right_detail')[0].scrollTop = total
      }
    },
    smoothUp:function (distance, total, step) { //平滑向上滚动
      var self = this;
      if (distance > total) {
        distance -= step;
        document.querySelectorAll('.qwui-demo_right_detail')[0].scrollTop = distance;
        setTimeout(function () {
          self.smoothUp(distance, total, step)
        },5);
      } else {
        document.querySelectorAll('.qwui-demo_right_detail')[0].scrollTop = total
      }
    }
  },
  components:{dialog_mask_bottom, search_box, time_detail, dialog_mask, loading, home_head_nav, footer_button,
    footer_nav, menu_tab, menu_tab_two, flow_button, chat_comment, advanced_setting, user_select, user_choose,
    user_add, apply_status, add_title, add_img, add_file, detail_title, user_selected, user_show, list_comment,
    load_more, user_info},
}
</script>
<style>
  .qwui-demo_nav{
    display: inline-block;
    position: absolute;
    top: 55px;
    left:0;
    bottom: 0;
    width: 265px;
    max-height: 895px;
    font-size: 14px;
    overflow-y: scroll;
    background-color: #eee;
  }
  .qwui-demo_nav_box{
    position: relative;
    overflow: hidden;
    padding: 10px 0 20px;
  }
  .qwui-demo_nav_title{
    position: relative;
    padding: 0 30px;
    color: #999;
    line-height: 32px;
  }
  .qwui-demo_nav_child{
    display: inline-block;
    width:100%;
    padding: 0 45px;
    line-height: 30px;
    vertical-align: top;
    cursor: pointer;
  }
  .qwui-demo ul li{
    list-style-type: disc;
  }
  .qwui-demo ul li strong{
    font-weight: 600;
    color: #2c3e50;
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 15px;
  }
  .qwui-demo_li_mg{
    margin: 15px 0;
  }
  a{
    color:#333
  }
  .qwui-demo_top_title {
    position: absolute;
    z-index: 1;
    left:0;
    width:100%;
    height: 54px;
    padding: 0 30px;
    background: #fff;
    border-bottom: 1px solid #E4E6E9;
  }
  .qwui-demo_top_logo {
    display: inline-block;
    position: absolute;
    top: 14px;
    height: 26px;
    width: 155px;
    background: url(../../../assets/images/logo.png) no-repeat;
  }
  .qwui-demo_nav_child:hover{
    background-color: #DCDCDC;
  }
  .qwui-demo_nav_child.active{
    color: #fff;
    background-color: #f87b00;
  }
  .qwui-demo_right_detail {
    position: absolute;
    top: 55px;
    bottom: 0;
    left: 265px;
    right: 0;
    min-width: 800px;
    padding:50px 20px 0 150px;
    overflow-y: auto;
    background-color: white;
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 15px;
  }
  .qwui-demo_right_detail.active{
    left:0;
    padding:0
  }
  .qwui-demo {
    position: relative;
    margin-bottom: 20px;
    line-height: 25px;
    overflow: hidden;
  }
  .qwui-demo_font_code{
    font-family: "Roboto Mono", Monaco, courier, monospace;
  }
  .qwui-demo_item{
    margin-top:15px
  }
  .qwui-demo_title{
    height: 30px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    font-weight: 600;
    font-size: large;
    color: #2c3e50;
  }
  .qwui-demo_tips_word{
    position: relative;
    padding: 12px 24px;
  }
  .qwui-demo_btn{
    position: relative;
    min-width: 60px;
    margin-right: 10px;
    padding: 0 10px;
    padding-top: 2px;
    text-align: center;
    text-decoration: none;
    color: #ff9600;
    line-height: 25px;
    background: #fff;
    border: 1px solid #ff9600;
    border-radius: 2px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    cursor: pointer;
  }
  .qwui-demo_btn:hover{
    color: white;
    background: #ff9600;
    border: 1px solid #ff9600;
  }
  .qwui-demo_overflow_hidden{
    width:100%;
    overflow: hidden
  }
  .qwui-demo_user_info{
    position: relative;
    display: inline-block;
    width: 45px;
    height:45px;
    margin: 10px 15px 10px 0;
    text-align: center;
    list-style: none;
  }
  .qwui-demo_btn.mg-t{margin-top:10px;}
  .qwui-demo_btn.mg-l{margin-left:10px;}
  .qwui-demo_tips_word .fl_l{float: left;margin-right: 20px;}
  .qwui-demo_tips_word .left_ten{position: relative;left:-10px;width: 100%;height: 25px;}
</style>
