<template>
    <div class="qwui-overlay" v-show="showDialogMask">
      <div class="qwui-mask" @click="closeMask"></div>
      <div class="qwui-dialog_bottom">
        <div class="qwui-dialog_bottom_header">
          最后一步 让我们更了解你
        </div>
        <div class="qwui-dialog_bottom_content">
          <div class="qwui-dialog_bottom_choose" v-for="(item,index) in optionsData">
            <div class="qwui-dialog_bottom_box" @click="showOptionBox(index)">
              <span class="qwui-dialog_choose_answer"
                    :class="{'qwui-dialog_font_style':optionsAnswer[index].choosed}">{{optionsAnswer[index].text}}</span>
              <span class="qwui-click_icon"
                    :class="{'right_change':optionsAnswer[index].choosed}"></span>
            </div>
            <div class="qwui-dialog_bottom_options" v-show="index === optionsIndex">
              <div class="qwui-dialog_options_title" @click="showOptionBox">
                <span class="qwui-dialog_choose_answer qwui-dialog_font_style">{{item.title}}</span>
                <span class="qwui-click_icon up"></span>
              </div>
              <div class="qwui-dialog_choose_answer">
                <div class="qwui-dialog_options_option" v-for="itemOption in item.optionsList">
                  <div @click="chooseOption(index,itemOption)">{{itemOption}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="qwui-dialog_bottom_tip" v-show="showInfoTip">
            <p class="qwui-dialog_bottom_tip_style">请填入信息</p>
            <span class="qwui-dialog_bottom_tip_icon"></span>
          </div>
        </div>
        <div class="qwui-dialog_bottom_footer" @click="saveInfo">
            <div class="qwui-activity_button">
              查看方案
            </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { addExperienceInfo } from "../../api/getData";

    export default {
      data() {
        return {
          optionsIndex: '',//区分点击了哪一个选项
          optionsAnswer: [
            {
              text:"选择公司规模",//选项的提示语
              choosed: false//该选项的值是否已选
            },
            {
              text:"选择所在行业",
              choosed: false
            }
          ],
          showInfoTip: false,//两个选项必选提示框
          //选项框数据
          optionsData:[
            {
              title: "选择公司规模",
              optionsList: [
                "1-50人","50-100人","101-200人","201-500人","501-1000人","1001及以上"
              ]
            },
            {
              title: "选择所在行业",
              optionsList: [
                "IT行业","制造业","批发/零售","文化/体育/娱乐业","建筑/房地产","教育",
                "运输/物流/仓储","医疗","政府","金融","能源/采矿","农林渔牧","其他"
              ]
            }
          ],
        }
      },
      props: [
        'showDialogMask','userId'
      ],
      methods: {
        //点击遮罩层隐藏页面底部弹框
        closeMask(){
          this.$emit("hideDialogMask");
          this.optionsAnswer = [
            {
              text:"选择公司规模",
              choosed: false
            },
            {
              text:"选择所在行业",
              choosed: false
            }
          ];
          this.optionsIndex = '';
        },
        showOptionBox(index){
          this.optionsIndex = index;//记录当前点击的选项
          this.showInfoTip = false;
        },
        chooseOption(index,itemOption){
          this.optionsAnswer[index].text = itemOption;
          this.optionsAnswer[index].choosed = true;
          this.optionsIndex = '';
        },
        saveInfo(){
          MtaH5.clickStat("get");
          if(this.optionsAnswer[0].text == "选择公司规模" || this.optionsAnswer[1].text == "选择所在行业"){
            this.showInfoTip = true;
          }else{
            var self = this;
            addExperienceInfo({"applicationPO.corpScale": self.optionsAnswer[0].text,
                               "applicationPO.corpIndustry":self.optionsAnswer[1].text,
                               "applicationPO.id":self.userId},function(){
                                _.showLoading('加载中');
                                setTimeout(function () {
                                  _.hideLoading();
                                  self.$router.push('scheme');
                                },2000);
                              });
          }
        },
      }
    }
</script>

<style>
  .qwui-overlay{
    opacity: 1;
  }
  .qwui-mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
  .qwui-dialog_bottom{
    position: absolute;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 258px;
    border-radius: 14px 14px 0 0;
    text-align: center;
    background-color: #fff;
  }
  .qwui-dialog_bottom_header {
    width:187px;
    height:22px;
    margin: 16px auto 0;
    font: 700 16px/22px PingFangSC-Medium;
    color:#333;
  }
  .qwui-dialog_bottom_content {
    position: relative;
    margin-top: 21px;
  }
  .qwui-dialog_bottom_choose {
    position: relative;
    width: 281px;
    height: 40px;
    margin: 0 auto 16px;
    text-align: center;
  }
  .qwui-dialog_bottom_box {
    background:rgba(245,247,249,1);
    border-radius: 22px ;
    text-align: center;
  }
  .qwui-dialog_choose_answer {
    font: 14px/40px PingFangSC-Regular;
    color: #999;
  }

  .qwui-dialog_font_style {
    color: #333;
    font-weight: 700;
  }
  .qwui-click_icon {
    display: block;
    position: absolute;
    top: 0;
    right: 50%;
    top: 14px;
    margin-right: -60px;
    width: 13px;
    height: 13px;
    background:0 0 url("../../../../assets/images/qwui-others_arrow.png") no-repeat;
    background-size: contain;
  }
  .qwui-click_icon.up {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    top: 20px;
  }
  .qwui-click_icon.right_change {
    margin-right: -132px;
  }
  .qwui-dialog_bottom_options {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 281px;
    height: 280px;
    background-color: #fff;
    border-radius: 22px;
    z-index: 11;
    overflow: hidden;
  }
  .qwui-dialog_options_title {
    width: 281px;
    height: 46px;
    font-size:14px;
    font-weight: 700;
    font-family:PingFangSC-Medium;
    color:rgba(51,51,51,1);
    line-height:46px;
  }
  .qwui-dialog_choose_answer {
    max-height: 234px;
    overflow: auto;
  }
  .qwui-dialog_options_option {
    width: 281px;
    height: 39px;
    font-size:15px;
    font-family:PingFangSC-Regular;
    color:rgba(51,51,51,1);
    line-height:39px;
    background-color: #F5F7F9;
    box-shadow: 0 -1px 0 0 rgba(240,240,240,1)
  }
  .qwui-dialog_options_option:active {
    background-color: rgba(240,240,240,1);
  }
  .qwui-dialog_bottom_tip {
    position: absolute;
    bottom: -25px;
    left: 50%;
    margin-left: -30px;
  }
  .qwui-dialog_bottom_tip_style {
    color: #F25F5F;
    font-family: PingFangSC-Regular;
  }
  .qwui-dialog_bottom_tip_icon {
    display: block;
    position: absolute;
    margin-top: -10px;
    margin-left: -7px;
    width: 3px;
    height: 3px;
    background-color: #F25F5F;
    border-radius: 50%;
  }
  .qwui-dialog_bottom_footer {
    margin-top: 32px;
  }
</style>

