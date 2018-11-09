<template>
  <div class="wrap">
    <div class="qwui-express_add_box">
      <div class="qwui-express_add_title">请录入快递信息</div>

      <!--选人组件-->
      <user_add :userselect="dataBase.selectConfig" @selectPerson="selectPerson"></user_add>

      <!--图片-->
      <div class="qwui-border_bottom">
        <div class="qwui-add_content_title">{{picMust=='0'? '添加图片(选填)':'添加图片(必填)'}}</div>
        <add_img :dataDetailMsg="imgUpload" v-on:listenToChild="showMsgFromAddImg"></add_img>
      </div>

      <!--快递单号-->
      <div class="qwui-add_content_title">快递单号（可选）</div>
      <div class="qwui-express_add_item">
        <textarea v-model="trackingNumber" cols="30" rows="1" ref="textarea" placeholder="请输入或点击右边扫码录入快递单号" maxlength="500" @input="changeUpdate($event,'code')"></textarea>
        <san_Code :value="trackingNumber" :type="'expresslist'" @backBarCode="backBarClickCode"></san_Code>
      </div>
      <!--到付金额-->
      <div class="qwui-add_content_title">到付金额（可选）</div>
      <div class="qwui-express_add_item">
        <input type="number" v-model="payMoney" ref="input" @input="updateValue($event.target)" placeholder="0.0" min="0" maxlength="10"/>
        <i></i>
      </div>
      <!--备注-->
      <div class="qwui-express_add_remark">
        <div class="qwui-add_content_remark_title">备注说明</div>
        <div class="qwui-express_add_remark_text">
          <textarea v-model="annotationText" cols="30" rows="2" maxlength="500" placeholder="请填写备注说明" @input="changeUpdate($event,'mark')"></textarea>
        </div>
      </div>
    </div>

    <flow_button :buttondata="dataBase.add.buttonConfig"></flow_button>
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>
    <div :class="{'qwui-no_content_fixed':hasRecord.show}">
      <no-record :hasrecord="hasRecord"></no-record>
    </div>
  </div>
</template>

<script>
  import user_select from '@/components/base/user_or_dept_select';
  import user_add from '@/components/add/user_select_build';
  import add_img from '@/components/add/add_img';
  import flow_button from '@/components/button/flow_button';
  import noRecord from '@/components/base/no_record';
  import san_Code from '@/components/add/sanQRCode';
  export default{
    data(){
      return{
        showContent:false,//显示页面
        dataBase:dataBase,
        imgUpload:dataBase.add.imgUpload,
        hasRecord:dataBase.add.hasRecord,//无权限
        userId:"",//选择的人员id
        imgUrl:'',//图片列表
        annotationText:"",//备注说明
        payMoney:"",//金额
        trackingNumber:"",//快递单号
        picMust:'0' ,//必须上传图片 0:否
        commitFlag:false,//控制是否正在提交中，以防多次点击提交,true表示正在提交
      }
    },
    created:function () {
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      _.showLoading();
      this.userSelectInit();
      //获取初始化备注、是否需要图片
      this.initStatus();
      this.dataBase.add.buttonConfig.primaryList[0].callBack = this.commitExpress;
    },
    methods:{
      //确定选择的人员返回的数据
      selectPerson(el,obj){
        if(obj && obj.user){
          this.userId=obj.user.idStr.replace(/\|/g,",");
        }
      },
      //获取初始化备注、是否需要图片
      initStatus:function () {
        var self = this;
        _.ajax({
          url: _.baseURL + self.dataBase.add.settingStatus.url,
          type: 'POST',
          data:'',
          success: function (result) {
            _.hideLoading();
            if (result.code == '0') {
              if(result.data.po){
                self.annotationText = result.data.po.remark;
              }
              if(!result.data.ispower){
                self.hasRecord.show=true;
              }
              self.picMust = result.data.picmust;
              self.showContent=true;
            }
          }
        })
      },
      //初始化数据
      userSelectInit(){
        this.userId="";
        this.imgUrl="";
        this.imgUpload.picList=[];
        this.trackingNumber="";
        this.payMoney="";
        this.imgUpload.clearCache = !this.imgUpload.clearCache;
        this.dataBase.selectConfig.selectList["ccPersonList"].title="收件人";
        this.dataBase.selectConfig.selectList["ccPersonList"].userSelected=[];
      },
      backBarClickCode(val){
        if(val!=""){
          this.trackingNumber=val;
          this.$refs.textarea.focus();
        }
      },
      //提交
      commitExpress:function () {
        if(this.commitFlag){
          return
        }
        var self = this;
        if(!self.userId){
          _.alert("提示","请选择收件人");
          return;
        }
        if(!self.imgUrl && self.picMust == '1'){
          _.alert("提示","请添加图片");
          return;
        }
        var buttonConfig = {
          primaryBtn:{name:"继续录入", callBack:this.userSelectInit},
          defaultBtn:{name:"返回列表", callBack:this.backToList}
        };
        self.commitFlag = true;
        _.showLoading('提交中');
        _.ajax({
          url: _.baseURL + self.dataBase.add.url,
          type: 'POST',
          data:{
            'relatives': self.userId,
            "tbQyExpressInfoPO.trackingNumber":self.trackingNumber,//快递单号
            "tbQyExpressInfoPO.payMoney":self.payMoney,//到付金额
            'tbQyExpressInfoPO.content': self.annotationText,
            'imageUrls': self.imgUrl
          },
          success: function (result) {
            _.hideLoading();
            if (result.code == '0') {
              _.alert('',"提交成功",buttonConfig);
            }else{
              _.alert('',"提交失败",buttonConfig);
            }
            self.commitFlag = false;
          }
        })
      },
      //返回首页列表
      backToList:function () {
        this.$router.push({path:'/'})
      },
      //返回图片列表
      showMsgFromAddImg:function (val) {
        var self = this;
        self.imgUrl ="";
        if(val.length > 0){
          for (var i = 0; i < val.length; i++) {
            self.imgUrl+= val[i] + ","
          }
        }
      },
      //金额处理
      updateValue(obj){
        var value = parseFloat(obj.value);
        if(value == ""|| isNaN(value)){
          this.$refs.input.value="";
          obj.focus();
          return;
        }
        if(obj.value.indexOf(".")>-1){
          value=obj.value.split(".")[0].length>8? obj.value.split(".")[0]:obj.value.split(".")[0].substring(0,8);
          value=value+"."+obj.value.split(".")[1].substring(0,2);
          obj.focus();
        }else{
          value=obj.value.substring(0,8);
        }
        this.payMoney=value;
      },
      //备注处理
      changeUpdate($el,type){
        var value=$el.target.value;
//        计算剩余字数
        if(value.length>500) {
          type=="code"? this.trackingNumber = value.substring(0, 500):"";
          type=="mark"? this.annotationText = value.substring(0, 500):"";
        }
        this.dealValue($el,value,type);
      },
      dealValue($el,value,type){
        //        计算占位符
        var len = 0;
        for (var i = 0; i < value.length; i++) {
          var a = value.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
          }
          else{
            len += 1;
          }
        }
//        判断换行
        var row=Math.round(len/32);
        switch (true){
          case row>=2 && row<6:
            $el.target.rows=row;
            break;
          case row>=6:
            $el.target.rows=5;
            break;
          case row<2:
            type=="code"? $el.target.rows=1:$el.target.rows=2;
        }
      }
    },
    components:{
      user_select,
      add_img,
      flow_button,
      user_add,
      noRecord,
      san_Code
    },
  }
</script>

<style>
  .qwui-express_add_box{
    position: relative;
    margin-bottom: 12px;
  }
  .qwui-express_add_title{
    position: relative;
    width:100%;
    padding: 10px 0;
    font-size: 16px;
    color:#333;
    text-align: center;
    background-color: #fff;
  }

  .qwui-express_add_remark{
    position: relative;
    background: #fff;
    color: #333;
  }
  .qwui-express_add_item{
    display: flex;
    position: relative;
    padding: 10px 15px;
    background: #fff;
  }
  .qwui-express_add_item input,.qwui-express_add_item textarea{
    flex: 1;
    font-size: 14px;
    color: #666;
    line-height: 24px;
    border: none;
  }
  .qwui-add_content_remark_title{
    padding: 15px 15px 0;
    font-size: 16px;
    color: #333;
  }
  .qwui-express_add_remark_text{
    position: relative;
    padding: 15px;
    min-height: 19px;
  }
  .qwui-express_add_remark_text textarea{
    width: 100%;
    border: none;
    font-size: 14px;
    color: #666;
  }

  .qwui-express_add_title:after,.qwui-express_add_item:after,.qwui-express_add_box:after{
    content: '';
    position: absolute;
    left:0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-no_content_fixed{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 8;
  }
</style>
