<template>
  <div class="wrap">
    <div class="qwui-warning" v-if="isWarnShow"><span class="waring-text">{{warnMsg}}</span></div>
    <div class="qwui-client_main" v-show="mainShow">
      <div class="qwui_btn_margin_bottom">
        <!--客户基本资料-->
        <div class="qwui-client_detail">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="(item,idx) in nav"
            :item="item"
            :key="idx"
            v-model="item.value"
          >
            <div v-show="slotShow" class="repeatTips" @click="clientRepeat(item.value)">
              <p>
                客户名称已存在，点击查看
                <span class="repeatTipsIcon"></span>
              </p>
            </div>
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>


        <!--客户区域地址行业-->
        <div class="qwui-client_location">
          <!-- 省市区三级联动 -->
          <distpicker v-if="districtShow"
          :listenDistrictMust="listenDistrictMust"
          :area="area"
          @inputDispicker="inputDispicker"
          ref="distpicker"></distpicker>
          <!-- 地址跟行业 -->
          <crm-operate-item
            v-if="item.status"
            :dataDetailMsg="add_nav"
            v-for="item in centerNav"
            :item="item"
            :key="item.id"
            :log="parentMsg"
            v-model="item.value"
          ></crm-operate-item>
          <div class="qwui-separate_bar" v-show="centerNavShow"></div>
        </div>


        <!-- 联系电话 邮箱 网址 备注 -->
        <div class="qwui-client_communication">
          <crm-operate-item
            :dataDetailMsg="add_nav"
            v-for="item in communicationNav"
            :item="item"
            :telRepeatMsg="telRepeatMsg"
            :key="item.id"
            :editTimeVal="editTimeVal"
            v-if="item.status"
            @listenToChild="listenToChild"
            @listenToTime="listenToTime"
            v-model="item.value"
          ></crm-operate-item>
          <div class="qwui-separate_bar custom_bar">可通过后台启用更多自定义字段</div>
        </div>

        <!-- 上传照片附件 -->
        <div class="qwui-client_attachment">
          <span class="img-text">照片</span>
          <img_detail :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail"></img_detail>
          <file_detail :dataDetailMsg="add.fileUpload" @listenToChild="showMsgFromFileDetail"></file_detail>
        </div>


        <!--选人组件-->
        <user-add :userselect="dataBase.selectConfig"
        @selectPerson="selectPerson"
        @confirmPick="confirmPick"
        @selectUserClick="selectUserClick"
        ></user-add>
        <div class="qw-client_inform">
          <div class="qwui-inform_text">
            <span class="qw-bar_text">通知相关人</span>
            <span class="qwui-user_cell_switch">
              <input type="checkbox" class="qwui-user_cell_input" @click="getLastPick(advise)">
            </span>
          </div>
        </div>
      </div>

      <!--底部操作按钮-->
      <flow_button :buttondata="clientDetail.buttonConfig"></flow_button>

    </div>
    <!-- 地图 -->
    <tencent-map :pos="pos" v-show="!mapHide" @closeMap='closeMap' @positionData="positionData"></tencent-map>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig"
    :closeAllTab="true"
    :closeGroup="true"
    :closeDept="true"
    :tabActive="'user'"
    :userSelectType="'onlyUser'"
    :userListUrl="userListUrl"
    :keyWordSearchUrl="keyWordSearchUrl"
    :letterSearchUrl="letterSearchUrl"
    v-if="dataBase.selectConfig.show"
    >
    </user_select>
    <!-- 客户类别 -->
    <client-type-tree v-show="typeTreeShow"
    @typeCode="typeCode"
    @industrySelectedStr="industrySelectedStr"
    @typeSelectedStr="typeSelectedStr"
    @poolSelectedStr="poolSelectedStr"
    @typeSelected="typeSelected"
    @poolSelected="poolSelected"
    @industrySelected="industrySelected"
    @clearSelectedPerson="clearSelectedPerson"
    @treeListShow='treeListShow'
    @newTypeValue="newTypeValue"
    :typeDatas="typeDatas"
    :typeData="typeData"
    :industryData="industryData"
    :treeListIsShow.sync="treeListIsShow"
    :searchBoxShow.sync="searchBoxShow"
    :check-confirm="checkConfirm"
    ref="qwtree"
    ></client-type-tree>
  </div>
</template>

<script>
import CrmOperateItem from '../../base/CrmOperateItem';
import userAdd from '@/components/add/user_select_build';
import TencentMap from '@/components/add/TencentMap';
import ClientTypeTree from '../../base/ClientTypeTree';
import { getClientBriefing, getAddClient,
getClientDetail, getOldGivenList, getPhotoSetting,
getClientHistoryInfo, addUserTo,
getValidClientName, getTypeList, getValidPhone,
getPoolList, getIndustryList, getClientUpdate,
 } from '../../../api/client/getData';
import {mapMutations} from 'vuex'
import distpicker from '../../base/distpicker';
import img_detail from '@/components/add/add_img';
import file_detail from '@/components/add/add_file';
import time_detail from '../../base/time_detail';
import related_person_detail from '@/components/add/user_select_icon_right';
import advanced_setting from '@/components/add/advanced_setting';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import * as timeUtil from '@/assets/js/time-util';
import clientOperateData from './data';
  // 存放客户的配置
  const clientConfig = {
    id: 'id',
    title: 'typeName',
    hasChildren: 'hasChildren',
    checkType: 'checkbox',
    headPic:'',
    parentId:'parentId',
  }
  // 存放公海配置
  const poolConfig = {
    id: 'id',
    title: 'poolName',
    hasChildren: 'false',
    checkType: 'radio',
    headPic:'',
    parentId:'orgId',
    subTitle:'clientNum'
  }
  // 存放行业配置
  const industryConfig = {
    id: 'id',
    title: 'industry',
    hasChildren: 'hasChildren',
    checkType: '',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png',
    parentId:'fatherid'
  }

export default {
  name: 'ClientOperate',
  components:{
    userAdd,
    distpicker,
    ClientTypeTree,
    img_detail,
    file_detail,
    time_detail,
    related_person_detail,
    advanced_setting,
    flow_button,
    user_select,
    TencentMap,
    CrmOperateItem
  },
  data(){
    return {
      code: '',
      typeDatas: [],
      editItemList: [], //存放编辑的自定义字段
      updateParams:[],
      typeValue:[],
      typeListIds:[],
      poolListIds:[],
      industryListIds:[],
      getClientHisList: [],
      userListUrl:'/portal/selectUserAction!ajaxGetUserListByOrgID.action',
      keyWordSearchUrl:'/portal/selectUserAction!searchByNameOrPhone.action',
      letterSearchUrl:'/portal/selectUserAction!searchFirstLetter.action',
      // userListUrl: '', // 传过去选人组件的url
      typeId:'',
      poolId:'',
      industryId:'',  // 传入树状子组件id,根据类别传
      typesSelected:'',
      poolsSelected:'',
      industriesSelected: '',  // 树状组件将已选中的值传回父组件
      dataBase:dataBase,
      advise: false,  // 是否通知相关人按钮
      slotShow: false, // 客户重复提示
      telRepeatMsg: false,
      keyword:{
        type: 0,
        clientName: ''
      },
      page:'',
      centerNavShow: true, // 分割线隐藏，行业地址区域板块隐藏的时候就为false
      address: '', // 地图
      clientData: '',// 所有list字段
      fixedData: '',
      params:{
        agentCode: 'client',
        isPhotograph: 1,
        typeId:'',
        poolId:'',
        strItem:'4,5,6,7,8,9,10,11,14', // 不知道是什么的参数
        typeIds:'',
        isClient:'',
        typeIsMust:0,
        contact_province_code:360000,
        contact_city_code:360100,
        file:'',
        'tbCrmClientInfoPO.industry':'',
        industrys:'',
        'tbCrmClientIndustryPO.getIndustryName':'',
        'tbCrmClientInfoPO.id':'',
        'tbCrmClientInfoPO.hasItem':1,
        oldPhone:18827987867,
        toSelectId:0,
        ccSelectId:0,
        submitType: 0, // 通知负责人相关人
        // 详情页面传值，获取id
        page: 1,
        id: '',
        incharges:'', // 传的是负责人id
        relatives:'', // 传的是相关人id
        itemJson:{
          "list":[]
        }
      },
      treeListIsShow: true,
      searchBoxShow:true,
      checkConfirm: '',
      typeData: [], // 客户类别列表
      poolData: [], // 公海列表
      industryData: [], // 行业列表
      isWarnShow: false, // 格式错误的顶部toast提示
      warnMsg: '',
      parentMsg: '',
      typeTreeShow: false,
      listenDistrictMust: '',
      districtShow: false, //区域显示
      nav: clientOperateData.client.clientDetail.nav,  //  头部输入框
      centerNav: clientOperateData.client.clientDetail.centerNav,  // 区域地址行业输入框
      communicationNav: JSON.parse(JSON.stringify(clientOperateData.client.clientDetail.communicationNav)),  // 通讯方式输入框
      clientDetail: clientOperateData.client.clientDetail,
      mainShow: true,
      mapHide: true,
      timeVal: '',
      editTimeVal: '',
      // showMap: false,
      inchargesSelected: '',
      relativesSelected: '',
      userSelected: '',
      areaName: '',
      add: clientOperateData.client.clientDetail, // 传入组件的详细数据
      timeData: [],
      area:[],
      add_nav:{ //数据详情头部信息
        // nav: 'i18n.homeworkType', //头部标题
        title:"",
        content:"",
      },
      routerName: '',  // 当前路由的名称
      pos: {
        latitude: 23.128144,
        longitude: 113.359308,
        value: '广东省广州市天河区员村一横路3号'
      },
      editClientId: ''
    }
  },
  created:function(){
    // 获取缓存
    this.routerName = this.$router.history.current.name;
    let storageValue = localStorage.getItem(this.routerName);
    let storageObj = storageValue? JSON.parse(storageValue) : {};
    window.location.href.indexOf('clientId')!=-1 ? this.editClientId = true : false;

    this.inint();
    // 请求列表list
    getClientBriefing((data) => {
      this.listenDistrictMust = data;
      let beforeClientData = this.clientDetail.nav.concat(this.clientDetail.centerNav,this.communicationNav); //渲染自定义字段前的字段

      // 判断区域是否显示
      if(data.basicList.length>0){
        for(let i = 0;i<data.basicList.length;i++){
          if(data.basicList[i].optionName === '区域'){
            data.basicList[i].status === '1'? this.districtShow = true : false ;
          }
          // 判断status，1，0 判断是否生成固定字段
          for(let j = 0;j<beforeClientData.length;j++){
            if(data.basicList[i].optionName === beforeClientData[j].optionName){
              let val = this.editClientId? '' : storageObj[beforeClientData[j].key] || '';

              data.basicList[i].status == '1' ? beforeClientData[j].status = true
              :beforeClientData[j].status = false;
              // 判断假如是编辑页面，就把公海input隐藏
              if(this.editClientId && beforeClientData[j].optionName=='所属公海'){
                beforeClientData[j].status = false;
              }
              this.$set(beforeClientData[j],'value',val);
              data.basicList[i].isMust === '1'? beforeClientData[j].isMust = 1 : beforeClientData[j].isMust = 0;//判断星号是否加载
            }
          }
        }
      }
      // 自定义字段动态加载
      let placeholderName = '';
      for(let i = 0;i<data.list.length;i++){
        // 判断placeholder的值
        if(data.list[i].list.length>0){
          placeholderName = data.list[i].list[0].name
        }else{
          placeholderName = '请输入'+data.list[i].optionName
        }
        // 根据后台返回的type判断显示类型
        if(data.list[i].type == 1){
          data.list[i].type = 'input'
        }else if(data.list[i].type == 2){
          data.list[i].type = 'textarea'
        }else if(data.list[i].type == 0){
          data.list[i].type = 'select'
        }else{
          data.list[i].type = 'dateTime'
        }
        data.list[i] = Object.assign({}, data.list[i], { placeholder: placeholderName, maxLength:'250',value: '' })//处理视图更新，得重创对象接收
        this.communicationNav.push(data.list[i]);
      }
      this.clientData = this.nav.concat(this.centerNav,this.communicationNav); // 所有字段list
      this.fixedData = this.nav.concat(this.centerNav); // 固定字段list
      // 自定义参数命名
      for(let i = 0;i<this.listenDistrictMust.list.length;i++){
        let obj = {
          fieldName:this.listenDistrictMust.list[i].optionName,
          fieldValue:this.listenDistrictMust.list[i].value
        }
        this.params.itemJson.list.push(obj);
      }
      this.clientCode();
      if(!this.districtShow){
        this.centerNavIsShow();
      }
      data.basicList.forEach((item) =>{
        this.communicationNav.forEach((citem) => {
          if(item.optionName==citem.optionName){
            item.status == '0'? citem.status = false : citem.status = true;
          }
        })
      })
    });
     // 如果clientId存在，则跳转编辑
    if(this.editClientId){
      this.params.id = window.location.href.split('?')[2].split('=')[1];
      getClientHistoryInfo(this.params,(data) => {
        this.getClientHisList = data;
        if(data.itemList&&data.itemList.length>0){
          data.itemList.forEach((item) => {
            this.editItemList.push(item)
          })
        }
        this.userListUrl='/portal/clientPoolAction!getPoolMember.action?poolId='+data.vo.poolId;
        // 映射，把固定字段赋值
        data.basicList.forEach((item) =>{
          this.communicationNav.forEach((citem) => {
            if(item.optionName==citem.optionName){
              item.status == '0'? citem.status = false : citem.status = true;
            }
          })
        })
        // 在这里把几个后台返回的树状id传到子组件
        if(data.vo.typeList){
          data.vo.typeList.forEach((item) => {
            this.typeListIds.push(item.typeId)
          })
          this.typeData = this.typeListIds;
        }
        if(data.vo.industryList){
          data.vo.industryList.forEach((item) => {
            this.industryListIds.push(item.industryId)
          })
          this.industryData = this.industryListIds;
        }
        if(data.vo.poolId){
          this.poolData = data.vo.poolId
        }
        this.params['tbCrmClientInfoPO.provinceCode'] = data.vo.provinceCode;
        this.params['tbCrmClientInfoPO.cityCode'] = data.vo.cityCode;
        this.params['tbCrmClientInfoPO.areaCode'] = data.vo.areaCode;
        this.params['tbCrmClientInfoPO.id'] = data.vo.id;
         let typeArr = []
         this.clientData.forEach((item) => {
           item.optionName == '客户类别' ?
           item.value = data.vo[item.editName].split('|')[1]
           : item.value = data.vo[item.editName];
           if(item.optionName == '客户类别' ){
             typeArr = data.vo[item.editName].split('|');
           }
         })
         let typeSplit = [];
         typeArr.forEach((item) => {
           if(item.indexOf('>')!=-1){
             typeSplit.push(item.split('>')[1]);
           }else{
             typeSplit.push(item);
           }
         })
          this.clientData.forEach((item) => {
           item.optionName == '客户类别' ?
           item.value = typeSplit.join('|')
           : item.value = data.vo[item.editName];
          })
        // 自定义字段赋值
        if(data.itemList){
          for(let j = 0;j<data.itemList.length;j++){
            if(this.params.itemJson.list[j].fieldName == data.itemList[j].fieldName){
              this.listenDistrictMust.list[j].value=data.itemList[j].fieldValue;
              if(this.listenDistrictMust.list[j].type == 'dateTime'){
                this.editTimeVal = data.itemList[j].optionVal;
              }
            }
          }
        }
        // 负责人赋值
        if(data.vo.toPersons){
          data.vo.toPersons.forEach((item) => {
            this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(item)
          })
        }
        // 相关人赋值
        if(data.vo.ccPersons){
          data.vo.ccPersons.forEach((item) => {
            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
          })
        }
        // 照片赋值
        if(data.vo.picList){
          data.vo.picList.forEach((item) => {
            this.add.imgUpload.picList.push(item)
          })
        }
        // 附件赋值
        if(data.mediaList){
          data.mediaList.forEach((item) => {
            this.add.fileUpload.mediaList.push(item)
          })
        }
        this.area.push(data.vo.provinceCode,data.vo.cityCode,data.vo.areaCode);
      })
    }
    else{
      let params = {
        userId: window._.userId
      }
      // 新增默认当前用户为负责人
      addUserTo(params)
      .then(res => {
        let { user } = res.data;
        this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(user);
        this.params.incharges = params.userId;
      })
    }
  },

  methods: {
    ...mapMutations([
        'updateSelectValue',
        'handleGetData',
        'resetTreeConfigData',
        'changeConfig',
      ]),
    clearSelectedPerson(val){
      this.clearPerson = val;
      if(val){
        this.dataBase.selectConfig.selectList["toPersonList"].userSelected=[];
        this.poolId = this.poolData;
        this.userListUrl='/portal/clientPoolAction!getPoolMember.action?poolId='+this.poolId;
        this.keyWordSearchUrl='/portal/selectUserAction!searchByNameOrPhone.action';
        this.letterSearchUrl='/portal/selectUserAction!searchFirstLetter.action';
      }
    },
    typeCode(val){
      this.nav.forEach((item) => {
        if(item.optionName == '客户编码' && item.status == true){
          if(val!=''){
            item.value = val+'_'+this.code;
          }else if(val == ''){
            item.value = this.code
          }
        }
      })
    },
    typeSelectedStr(val){
      this.nav.forEach((item) => {
        if(item.editName == 'clientType'){
          item.value = val;
        }
      })
    },
    poolSelectedStr(val){
      this.nav.forEach((item) => {
         if(item.editName == 'poolName'){
          item.value = val;
        }
      })
    },
    industrySelectedStr(val){
      this.centerNav.forEach((item) => {
         if(item.editName == 'industry'){
          item.value = val;
        }
      })
    },
    typeSelected(val){
      this.typeData = val;
      this.params.typeIds = val.join();
    },
    poolSelected(val){
      this.poolData = val;
      this.params.poolId = val;
    },
    industrySelected(val){
      this.industryData = val;
      this.params.industrys = val.join();
    },
    // 客户查重跳转
    clientRepeat(item){
      this.$router.push({ name:"checkList",params:{keyword:item}});
    },
    newTypeValue(val){
      for(let i = 0;i<this.clientData.length;i++){
        if(this.clientData[i].editName == 'clientType' && this.checkConfirm == 'clientTypeList'){
          this.clientData[i].value = val
        }
        if(this.clientData[i].editName == 'poolName'&&this.checkConfirm == 'poolList'){
          this.clientData[i].value = val
        }
        if(this.clientData[i].editName == 'industry'&&this.checkConfirm == 'industryList'){
          this.clientData[i].value = val
        }
      }
    },
    // 按确认键
    treeListShow(val){
      this.mainShow = !val;
    },
    // 关闭地图
    closeMap(){
      this.mainShow = true;
      this.mapHide = true;
      if(this.address == ''){
        this.centerNav[0].value = this.pos.value
      }else{
        this.centerNav[0].value = this.address;
      }
    },
    positionData(val){
      this.address = val.value;
    },
    // 附件参数
    showMsgFromFileDetail(mediaId) {
      this.params['mediaIds'] = mediaId.join(',');
    },
    // 图片参数
    showMsgFromImgDetail(imgurl){
      this.params['imageUrls'] = '';
      this.params['imageUrls'] = imgurl.join(',');
    },
    // 校验数据
    validateData () {
      // 弹窗
      // if(!this.isWarnShow || !this.slotShow){
        if(!this.isWarnShow){
        for(let i = 0;i<this.clientData.length;i++){
          if(this.clientData[i].isMust == 1 && this.clientData[i].value == '' && this.clientData[i].status == true){
            _.alert("提示信息","请输入"+this.clientData[i].optionName);
            return false;
          }
        }
        // 假如commuNav的联系电话跟邮箱格式错，则红色toast
        for(let i = 0;i<this.communicationNav.length;i++){

          if(this.communicationNav[i].value != ''){ // 判断手机如果有value值就进行验证
            if(this.communicationNav[i].name === 'tel'){

              let phone = /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g;
              let tel = this.communicationNav[i].value;
              if(phone.test(tel)){
                this.isWarnShow = false;
              }else{
                this.isWarnShow = true;
                setTimeout(() => {
                  this.isWarnShow = false;
                },1000);
                this.warnMsg = '请输入正确的联系方式';
                return false;
              }
            }else if(this.communicationNav[i].name === 'mail'){
              var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              let mail = this.communicationNav[i].value;
              if(myreg.test(mail)){
                this.isWarnShow = false;
              }else{
                this.isWarnShow = true;
                setTimeout(() => {
                  this.isWarnShow = false;
                },1000);
                this.warnMsg = '请输入正确的邮箱格式';
                return false;
              }
            }
          }
        }


        if(this.dataBase.selectConfig.selectList["toPersonList"].userSelected.length < 1){
          _.alert("提示","至少要一个负责人才能保存");
          return false;
        }
        return true;
      }
    },
    // 保存并关闭
    keepClose(){
      let isPass = this.validateData();
      if(!isPass) return;
      if(!this.slotShow){

      if(this.params.itemJson && typeof this.params.itemJson != 'object'){
        this.params.itemJson = JSON.parse(this.params.itemJson);
      }

      // 将固定字段跟自定义字段传入params
      for(let i = 0;i<this.clientData.length;i++){
        this.params[this.clientData[i].key] = this.clientData[i].value;  // 固定字段
        this.params.itemJson.list.forEach((item) => {
          if(this.clientData[i].optionName == item.fieldName && item.type != 'dateTime'){
            if(this.clientData[i].list.length>0 && this.clientData[i].type == 'select' && this.clientData[i].value ){
              item.fieldValue = this.clientData[i].value
            }else{
            item.fieldValue = this.clientData[i].value
            }
            item.fieldId = this.clientData[i].id
          }
        })
      }

      // 将负责人传入params
      let inchargesSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
      let toarr = [];
      inchargesSelected.forEach((item) => {
        toarr.push(item.userId);
      })
      this.params.incharges = toarr.join();
      // 将相关人传入params
      let relativesSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
      let ccarr = [];
      relativesSelected.forEach((item) => {
        ccarr.push(item.userId);
      })
      this.params.relatives = ccarr.join();
      // 发送请求并跳转旧页面
      // this.params.itemJson = JSON.stringify(this.params.itemJson);
      if(this.params['tbCrmClientInfoPO.phone'] && this.params['tbCrmClientInfoPO.phone'] != ''){
        getValidPhone(this.params,
        (data) => {
          if(data!='0'){ // 重复的时候
            this.telRepeatMsg = true
          }else{
            this.telRepeatMsg = false;
          }
        })
      }
        this.params['tbCrmClientInfoPO.industry'] = this.params['tbCrmClientInfoPO.industryName'];
        this.params['tbCrmClientInfoPO.poolId'] = this.params.poolId
        if(this.editClientId){
          this.params.typeIds = this.typeData.join();
          // 编辑页面的行业列表传值
          this.industriesSelected ? this.params.industrys = this.industriesSelected.join()
          : this.params.industrys = this.industryData.join();
          this.params.itemJson.list.forEach((item) => {
            this.editItemList.forEach((editItem) => {
              if(item.fieldName == editItem.fieldName && item.type != 'dateTime'){
                item.fieldId = editItem.fieldId
                item.id = editItem.id
              }
            })
          })
          this.params.itemJson = JSON.stringify(this.params.itemJson);
          getClientUpdate(this.params,(data) => {
            this.updateParams = this.params;
            location.href = `${_.baseURL}/jsp/wap/crm/client/client_list.jsp`;
            // // 清除缓存
            localStorage.removeItem(this.routerName);
          })

        }else if(!this.telRepeatMsg&&!this.slotShow){
          this.params.itemJson = JSON.stringify(this.params.itemJson);
          getAddClient(this.params,(data) => {
            // 将params里面的参数属性转化成数组形式进行遍历比较
            location.href = `${_.baseURL}/jsp/wap/crm/client/client_list.jsp`;
            // // 清除缓存
            localStorage.removeItem(this.routerName);
          })
        }
      }
    },
    // 保存并创建联系人
    keepCreate () {
      let isPass = this.validateData();
      if(!isPass) return;

      if(this.params.itemJson && typeof this.params.itemJson != 'object'){
          this.params.itemJson = JSON.parse(this.params.itemJson);
      }

      // 把params所需要的参数循环出来再传给后台
      for(let i = 0;i<this.clientData.length;i++){
        this.params[this.clientData[i].key] = this.clientData[i].value;
      }
       // 将负责人传入params
      let inchargesSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
      let toarr = [];
      inchargesSelected.forEach((item) => {
        toarr.push(item.userId);
      })
      this.params.incharges = toarr.join();
      // 将相关人传入params
      let relativesSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
      let ccarr = [];
      relativesSelected.forEach((item) => {
        ccarr.push(item.userId);
      })
      this.params.relatives = ccarr.join();
      this.params.typeIds = this.typeData.join();
      // 编辑页面的行业列表传值
      this.industriesSelected ? this.params.industrys = this.industriesSelected.join()
      : this.params.industrys = this.industryData.join();
      if(this.params.itemJson.list){
        this.params.itemJson.list.forEach((item) => {
          this.editItemList.forEach((editItem) => {
            if(item.fieldName == editItem.fieldName && item.type != 'dateTime'){
              item.fieldId = editItem.fieldId
              item.id = editItem.id
            }
          })
        })
      }
      // 自定义字段的赋值
      if(this.params.itemJson.list){
        this.params.itemJson.list.forEach((item) => {
          this.clientData.forEach((hitem) => {
            if(hitem.list){
              if(item.fieldName == hitem.optionName){
                item.fieldValue = hitem.value
                item.fieldId = hitem.id
              }
              if(item.fieldName == hitem.optionName&&item.type == "select"){
                item.fieldValue = hitem.id
                item.fieldId = hitem.id
              }
            }
          })
        })
      }
      this.params['tbCrmClientInfoPO.poolId'] = this.params.poolId;
      this.params['tbCrmClientInfoPO.industry'] = this.params['tbCrmClientInfoPO.industryName'];
      this.params.itemJson = JSON.stringify(this.params.itemJson);
      // 编辑页面的创建联系人是更新接口，新增页面是添加接口
      if(this.editClientId){
        getClientUpdate(
          this.params,
          (data) => {
          let clientId  = this.params.id;
          location.href = `${_.baseURL}/jsp/wap/crm/contact/contact_add.jsp?type=1&id=${clientId}`;
          // 清除缓存
          localStorage.removeItem(this.routerName);
        })
      }else{
        getAddClient(
          this.params,
          (data) => {
          let { clientId } = data;
          location.href = `${_.baseURL}/jsp/wap/crm/contact/contact_add.jsp?type=1&id=${clientId}`;
          // 清除缓存
          localStorage.removeItem(this.routerName);
        })
      }
    },
    listenToChild(val){
      for(let i = 0;i<this.listenDistrictMust.list.length;i++){
        if(this.listenDistrictMust.list[i].type == '4'){
          this.listenDistrictMust.list[i].value = val;
        }
      }
    },
    inputDispicker(val){
      this.params['tbCrmClientInfoPO.provinceCode'] = val[0];
      this.params['tbCrmClientInfoPO.cityCode'] = val[1];
      this.params['tbCrmClientInfoPO.areaCode'] = val[2];
    },
    // 添加至database
    resetSelectPerson(){
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["toPersonList"].title="负责人(可查看/修改)";
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人(可查看)";
      this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:true,name:"加载上次"};
      this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次"};
      this.dataBase.selectConfig.selectList["toPersonList"].userSelected=[];
    },
    // 父组件判断是负责人还是相关人
    selectUserClick(val){
      this.clientData.forEach((item) => {
        if(item.editName == 'poolName' && item.status == true && item.value != '' && val=="incharges" && item.value != '默认公海'){
          this.poolId = this.poolData;
          this.userListUrl='/portal/clientPoolAction!getPoolMember.action?poolId='+this.poolId;
        }
        if(item.editName == 'poolName' && item.status == false && val=="incharges"){
          this.userListUrl='/portal/selectUserAction!ajaxGetUserListByOrgID.action';
        }
        if(item.value == '默认公海'){
          this.userListUrl='/portal/selectUserAction!ajaxGetUserListByOrgID.action';
        }
      })
      if(val == 'relatives'){
        this.userListUrl='/portal/selectUserAction!ajaxGetUserListByOrgID.action';
      }
    },

    // 确定人员返回的数据,把id传至后台
    selectPerson(el,obj){
      if(el == 'toPersonList'){
        this.params.incharges = obj.user.idStr;
      }
      if(el == 'ccPersonList'){
        this.params.relatives = obj.user.idStr;
      }
    },

    // 负责人相关人添加
    confirmPick(el, isGet){ //负责人
      if(el == 'toPersonList'){
        let userSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
        if(isGet){
          this.keyword.type = Number(!isGet);
          getOldGivenList(this.keyword,(data) => {
            userSelected.splice(0,userSelected.length);
            userSelected.push.apply(userSelected, data.ccOrTolist);
          })
        }else{
          userSelected.splice(0,userSelected.length);
        }
      }else if(el == 'ccPersonList'){ //相关人
        let userSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
        if(isGet){
          this.keyword.type = Number(isGet);
          return getOldGivenList(this.keyword,(data) => {
            userSelected.splice(0,userSelected.length);
            userSelected.push.apply(userSelected, data.ccOrTolist);
          })
        }else{
          userSelected.splice(0,userSelected.length);
        }
      }
    },

    // 初始化客户编码
    clientCode () {
      var nowDate = _.getFormatDate(new Date(Date.now()), 'yyyy-MM-dd-hh-mm-ss');
      this.nav.forEach((item) => {
        if(item.optionName == '客户编码' && item.status == true ){
          item.value = nowDate.split('-').join('');
          this.code = item.value;
        }
      })
    },

    // 初始化
    inint () {
      // 初始化省市区三级联动组件
      this.params['tbCrmClientInfoPO.provinceCode'] = '';
      this.params['tbCrmClientInfoPO.cityCode'] = '';
      this.params['tbCrmClientInfoPO.areaCode'] = '';
      // 初始化负责人相关人组件参数
      this.resetSelectPerson();
      // 判断能不能选择多个负责人
      getPhotoSetting(this.params,(data) => {
        if(data.is_photograph == '0'){
          this.dataBase.selectConfig.selectList["toPersonList"].userRestriction="1";
        }
      })
      // 给两个按钮绑定事件
      this.clientDetail.buttonConfig.defaultList[0].callBack = this.keepClose;
      this.clientDetail.buttonConfig.primaryList[0].callBack = this.keepCreate;

      // 给操作项绑定事件
      this.nav[0].clickEvent = this.checkClientName;
      this.nav[1].clickEvent = this.selectClientType;
      this.nav[2].clickEvent = this.selectPool;
      this.centerNav[0].iconEvent = this.selectAddress;
      this.centerNav[1].clickEvent = this.selectIndustry;
    },


    listenToTime(timeVal){
      this.timeVal = timeVal;
    },
    // 客户名称
    checkClientName(){
      this.keyword.clientName = this.nav[0].value;
      // 判断客户名称是否重复 编辑页面客户名与刚进页面时候相同则不请求
      if(this.editClientId && this.nav[0].value != this.getClientHisList.vo.clientName || !this.editClientId){
        getValidClientName(this.keyword, (data)=> {
          data.isRepeat? this.slotShow = true
          :this.slotShow = false
        })
      }
    },



    // 选择客户类别
    selectClientType () {
      this.$refs.qwtree.lock_roll = true;
      this.checkConfirm = 'clientTypeList'
      this.typeTreeShow = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(clientConfig)
      getTypeList(this.params,(data) => {
        this.handleGetData(data.pageData);
        this.typeDatas = data.pageData;
        this.updateSelectValue(this.typeData);
        this.treeListIsShow=true;
        this.searchBoxShow=true;
        this.$refs.qwtree.lock_roll = false;
      })
    },


    // 选择公海
    selectPool () {
      this.checkConfirm = 'poolList'
      this.typeTreeShow = true;
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(poolConfig)
      // this.poolId = this.poolId;
      getPoolList(this.params,(data) => {
        this.handleGetData(data.allPoolList);
        this.updateSelectValue(this.poolData);
        this.treeListIsShow=true;
        this.searchBoxShow=false;
      })

    },

    // 选择行业
    selectIndustry () {
      this.checkConfirm = 'industryList'
      this.typeTreeShow = true;
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(industryConfig)
      getIndustryList(this.params,(data) => {
        this.handleGetData(data.pageData);
        this.updateSelectValue(this.industryData);
        this.treeListIsShow=true;
        this.searchBoxShow=true;
      })
    },

    // 选择地址
    selectAddress () {
      this.mapHide = false;
    },
    //判断是否通知负责人和相关人
    getLastPick:function (string) {
      this.advise == false ? this.advise = true : this.advise = false;
      if(this.advise){
        this.params.submitType = 1
      }else{
        this.params.submitType = 0
      }
    },
    // 判断中间分割线是否隐藏
    centerNavIsShow(){
      let centerArr = [];
      this.centerNav.forEach((item) => {
        centerArr.push(item.status);
      })
      centerArr.indexOf(true) == -1 ? this.centerNavShow = false : this.centerNavShow = true
    }
  }
}
</script>
<style lang="scss">
.wrap{
  position:relative;
  background: none;
  .qwui-warning{
    position:fixed;
    height:36px;
    width:100%;
    text-align: center;
    background-color:rgba(255,232,232,1);
    z-index: 2;
    .waring-text{
      display:inline-block;
      color:rgba(255,102,110,1);
      font-size:14px;
      line-height: 14px;
      margin-top:11px;
    }
  }
  .qwui-client_main{
    .repeatTips{
      position:absolute;
      top:0;
      right:0;
      margin-top:25px;
      padding-right:15px;
      height:50px;
      font-size:12px;
      color:#FF574D;
      .repeatTipsIcon{
        display:inline-block;
        width: 15px;
        height: 17px;
        background: url('../../../../../assets/images/crm/ic_arrow.png') no-repeat center;
        background-size: 97%;
        vertical-align: bottom;
      }
    }
    /*照片附件*/
    .qwui-client_attachment{
      position:relative;
      background-color: #fff;
      .img-text{
        padding: 14px 0 0 15px;
        display: inline-block;
        font-size:16px;
        font-family:PingFangSC-Regular;
        color:rgba(51,51,51,1);
      }
    }
    .qwui-client_attachment::after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      border-bottom: 1px solid #e5e5e5;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }


    /*可通过后台启用更多自定义字段*/
    .custom_bar{
      position: relative;
      width: 100%;
      padding: 10px 0 20px 15px;
      background-color: #f5f5f5;
      font-size:13px;
      font-family:PingFangSC-Regular;
      color:rgba(187,187,187,1);
    }
    .qw-client_inform{
      height:44px;
      font-family:PingFangSC-Regular;
      color:rgba(51,51,51,1);
      font-size:16px;
      position: relative;
      background: #fff;
      .qwui-user_cell_input{
        float:right;
      }
      .qwui-inform_text{
        padding:10px 15px;
        margin-top:10px;
      }
    }
    .qw-client_inform:after, .separate_bar:after{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ddd;
      color: #ddd;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
    .separate_bar{
      position: relative;
      height: 10px;
      background-color: #f5f5f5;
    }
    .qwui-f_add_image_list:after {
      border-top:none !important;
    }


    /*子组件下滑线清除*/
    .qwui-client_detail .qwui-title_detaildata:nth-last-of-type(2) .qwui-border_bottom::after{
      border-bottom:0;
    }
    .qwui-client_location .qwui-title_detaildata:nth-last-of-type(2) .qwui-border_bottom::after{
      border-bottom:0;
    }
    .qwui-client_communication .qwui-title_detaildata:nth-last-of-type(2) .qwui-border_bottom::after{
      border-bottom:0;
    }
    .vux-popup-picker-value{
      float:right;
      color:#333;
    }
    .qwui-client_communication{
      .vux-cell-value {
        font-size:16px;
        line-height:37px;
        font-family:PingFangSC-Regular;
        color:#333;
      }
      .weui-cells:after{
        border-bottom: none;
      }
    }

    .qwui-separate_bar{
      &:before, &:after{
        transform-origin: 0 0;
      }
    }
  }
}
</style>
