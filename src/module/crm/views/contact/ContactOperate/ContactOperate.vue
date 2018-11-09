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
            <div v-show="slotShow" class="wxContact" @click="wxContactList(item.value)">
              <p>
                <span class="wx_contact_icon"></span><span>微信联系人</span>
              </p>
            </div>
          </crm-operate-item>
          <div class="qwui-separate_bar"></div>
        </div>


        <!--客户区域地址行业-->
        <div class="qwui-client_location">
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
            :birthEditTimeVal="birthEditTimeVal"
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
        </div>


        <!--选人组件-->
        <user-add :userselect="dataBase.selectConfig" @selectPerson="selectPerson" @confirmPick="confirmPick"></user-add>
        <div class="qw-client_inform">
          <div class="qwui-inform_text">
            <span class="qw-bar_text">保存时通知负责人和相关人</span>
            <span class="qwui-user_cell_switch">
              <input type="checkbox" class="qwui-user_cell_input" @click="getLastPick(advise)">
            </span>
          </div>
        </div>
      </div>

      <!--底部操作按钮-->
      <flow_button :buttondata="clientDetail.buttonConfig"></flow_button>

    </div>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig"
    :userListUrl="userListUrl"
    :keyWordSearchUrl="keyWordSearchUrl"
    :letterSearchUrl="letterSearchUrl"
    v-if="dataBase.selectConfig.show"
    >
    </user_select>
    <!-- 所属客户 -->
    <contact-tree v-show="typeTreeShow"
    :belongData="belongData"
    @typeSelected="typeSelected"
    @belongClientStr="belongClientStr"
    @treeListShow='treeListShow'
    @typeIds="typeIds"
    :clientListId="clientListId"
    :tree-list-is-show="treeListIsShow"
    :client-list-data="clientListData"
    :typeId="typeId"
    :searchBoxShow.sync="searchBoxShow"
    ></contact-tree>
  </div>
</template>

<script>
import CrmOperateItem from '../../base/CrmOperateItem';
import userAdd from '@/components/add/user_select_build';
import ContactTree from './ContactTree';
import {  getAddClient,searchClientList,
getOldGivenList,
addUserTo,
getValidPhone, getClientUpdate,
getContactsItem, addContact, getContactHistoryInfo, updateContact
 } from '../../../api/contact/getData';
import {mapMutations} from 'vuex'
import img_detail from '@/components/add/add_img';
import file_detail from '@/components/add/add_file';
import time_detail from '../../base/time_detail';
import related_person_detail from '@/components/add/user_select_icon_right';
import advanced_setting from '@/components/add/advanced_setting';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import * as timeUtil from '@/assets/js/time-util';
import clientOperateData from './data';
// 存放所属客户的配置
const clientConfig = {
id: 'id',
title: 'clientName',
checkType: 'radio',
headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/icon_crm.png',
parentId:'parentId',
subTitle:'clientCode'
}
export default {
  name:'ContactOperate',
  components:{
    userAdd,
    ContactTree,
    img_detail,
    file_detail,
    time_detail,
    related_person_detail,
    advanced_setting,
    flow_button,
    user_select,
    CrmOperateItem
  },
  data(){
    return {
      editData:'', // 编辑页面后台返回的数据
      editCustomList: '',
      searchBoxShow:true,
      clientListId: '',
      customAllList: [], // 存放自定义字段
      fixedAllList: [], // 存放固定字段
      contactALlList: [], // 存放后台返回的固定字段和自定义字段
      contactData: [], // 存放页面渲染出来的固定字段和自定义字段
      belongClientId: [],
      typeData: [], // 所属客户列表
      getContactHistoryParams:{
          id:'15e6891d207b4d2e8d3dac7f6b1ea683'
      },
      belongData:[],
      typeListIds:[],
      userListUrl:'/portal/selectUserAction!ajaxGetUserListByOrgID.action',
      keyWordSearchUrl:'/portal/selectUserAction!searchByNameOrPhone.action',
      letterSearchUrl:'/portal/selectUserAction!searchFirstLetter.action',
      typeId:'',
      typesSelected:'',
      dataBase:dataBase,
      advise: false,  // 是否通知相关人按钮
      slotShow: true, // 客户重复提示
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
        pageSize:20,
        userOpenId:'',
        'tbCrmContactsInfoPO.id':'',
        'tbCrmContactsInfoPO.hasItem':1,
        'tbCrmContactsInfoPO.clientId': '', // 存放所属客户的Id
        'tbCrmContactsInfoPO.status': 1,
        'tbCrmContactsInfoPO.birthday': '2018-07-08',
        userOpenId:'',
        typeId:'',
        strItem:'1,2,9',
        typeIds:'',
        isClient:'',
        typeIsMust:0,
        file:'',
        toSelectId:0,
        ccSelectId:0,
        submitType: 0, // 通知负责人相关人
        // 详情页面传值，获取id
        page: 1,
        // 'tbCrmClientSearchVO.readStatus':0,
        incharges:'', // 传的是负责人id
        relatives:'', // 传的是相关人id
        itemJson:{
          "list":[]
        }
      },
      treeListIsShow: true,
      clientListData: [], // 所属客户列表
      isWarnShow: false, // 格式错误的顶部toast提示
      warnMsg: '',
      parentMsg: '',
      typeTreeShow: false,
      listenDistrictMust: '',
      districtShow: false, //区域显示
      nav: clientOperateData.client.clientDetail.nav,  //  头部输入框
      centerNav: clientOperateData.client.clientDetail.centerNav,  // 区域地址行业输入框
      communicationNav: clientOperateData.client.clientDetail.communicationNav,  // 通讯方式输入框
      clientDetail: clientOperateData.client.clientDetail,
      mainShow: true,
      timeVal: '',
      editTimeVal: '',
      birthEditTimeVal:'',
      timeItem: '',
      inchargesSelected: '',
      relativesSelected: '',
      userSelected: '',
      areaName: '',
      add: dataBase.draft.add, // 传入组件的详细数据
      timeData: [],
      area:[],
      add_nav:{ //数据详情头部信息
        // nav: 'i18n.homeworkType', //头部标题
        title:"",
        content:"",
      },
      routerName: '',  // 当前路由的名称
    }
  },
  created:function(){
    _.showLoading(this.$t('i18n.loading'),true);
    // 获取缓存
    this.routerName = this.$router.history.current.name;
    let storageValue = localStorage.getItem(this.routerName);
    let storageObj = storageValue? JSON.parse(storageValue) : {};
    this.init();
    // 请求列表请求
    getContactsItem((data) => {
      this.customAllList = data.newItemList;
      this.fixedAllList = data.basicList;
      this.contactALlList = this.contactALlList.concat(this.customAllList,this.fixedAllList);
      this.customList();
      this.fixedList();
      this.contactData = this.contactData.concat(this.nav,this.centerNav,this.communicationNav);
    }).then(() => {
        this.getHistoryContact();
    })
    console.log(this.editCustomList,2222)
    this.editCustomAllList();
   

    // 默认当前用户为负责人
    let params = {
        userId: window._.userId
    }
    addUserTo(params)
      .then(res => {
        let { user } = res.data;
        this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(user);
        this.params.incharges = params.userId;
      })
    // 若是编辑页面，赋值

  },
  methods: {
    ...mapMutations([
    'updateSelectValue',
    'handleGetData',
    'resetTreeConfigData',
    'changeConfig',
    ]),
    // 自定义字段方法处理 新增
    customList(customAllList){
      let placeholderName = '';   // 存放placeholder
      if(this.customAllList.length>0){
        this.customAllList.forEach((item) => {
          // 根据后台返回的type判断显示类型
          if(item.type == 1){
            item.type = 'input'
          }else if(item.type == 2){
            item.type = 'textarea'
          }else if(item.type == 0){
            item.type = 'select'
          }else{
            item.type = 'dateTime'
          }
          item.list.length>0 ? placeholderName = item.list[0].name : placeholderName = '请输入'+item.optionName; // 判断自定义字段的placeholder值，后台没返回则默认值
          item = Object.assign({}, item, { placeholder: placeholderName, maxLength:'250',value: '' })//处理视图更新，得重创对象接收
          this.communicationNav.push(item)
        })
      }
      //   将自定义字段赋到params.itemJson  新增
      this.customAllList.forEach((item) => {
          let obj = {
            fieldName: item.optionName,
            fieldValue: item.value,
            fieldId: item.id,
            id: item.id
          }
          this.params.itemJson.list.push(obj);
      })
    },
    editCustomAllList(){
      //   将自定义字段赋到params.itemJson  编辑
      // if(this.$route.query.contactId){
        console.log(this.editCustomList)
        // this.editCustomList.forEach((item) => {
        //   let obj = {
        //     fieldName: item.optionName,
        //     fieldValue: item.value,
        //     fieldId: item.id,
        //     id: item.id
        //   }
        //   this.params.itemJson.list.push(obj);
        // })
      // }
    },
    // 固定字段方法处理
    fixedList(fixedAllList){
      fixedAllList = this.fixedAllList;
      let fixedLists = [];
      fixedLists = fixedLists.concat(this.nav,this.centerNav,this.communicationNav.slice(0,4));
      fixedAllList.forEach((item) => {
        fixedLists.forEach((nitem) => {
          if(item.optionName == nitem.optionName || item.optionName == '姓名'){
            nitem.isMust = item.isMust;
            item.status == '1' ? nitem.status = true : nitem.status = false;
          }
        })
      })
    },
    // 树状组件传过来的str值
    belongClientStr(val){
        this.nav.forEach((item) => {
        if(item.editName == 'clientName'){
            item.value = val;
        }
        })
    },
    // 树状组件传过来的id
    typeSelected(val){
      this.typeData = val;
      this.params['tbCrmContactsInfoPO.clientId'] = val;
    },
    // 客户查重跳转
    wxContactList(item){
      this.$router.push({ name:"checkList",params:{keyword:item}});
    },
    // 按确认键
    treeListShow(val){
      this.mainShow = !val;
      this.typeTreeShow = val;
    },
    // 图片参数
    showMsgFromImgDetail(imgurl){
      this.params['imageUrls'] = '';
      this.params['imageUrls'] = imgurl.join(',');
    },
    // 校验数据
    validateData () {
      // 弹窗
      if(!this.isWarnShow){
        for(let i = 0;i<this.contactData.length;i++){
          if(this.contactData[i].isMust == 1 && this.contactData[i].value == ''){
            _.alert("提示信息","请输入"+this.contactData[i].optionName);
            return false;
          }
        }
        // 假如centerNav的联系电话跟邮箱格式错，则红色toast
        for(let i = 0;i<this.centerNav.length;i++){
          if(this.centerNav[i].value != ''){ // 判断手机如果有value值就进行验证
            if(this.centerNav[i].name === 'tel'){
              let mobile = /^1[3|5|8]\d{9}$/ , phone = /^0\d{2,3}-?\d{7,8}$/;
              let tel = this.centerNav[i].value;
              if( mobile.test(tel) || phone.test(tel)){
                this.isWarnShow = false;
              }else{
                this.isWarnShow = true;
                setTimeout(() => {
                  this.isWarnShow = false;
                },1000);
                this.warnMsg = '请输入正确的联系方式';
                return false;
              }
            }else if(this.centerNav[i].name === 'mail'){
              var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              let mail = this.centerNav[i].value;
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
    // 固定字段跟自定义字段赋值到params
    contactListParams(){
      this.contactData.forEach((item) => {
        this.params[item.key] = item.value  //  固定字段赋值到params
        this.params.itemJson.list.forEach((pitem) => {
          if(item.optionName == pitem.fieldName){  //  自定义字段赋值到params
            if(item.list.length>0 && item.type == 'select' && item.value){
              pitem.fieldValue = item.value
            }else{
              pitem.fieldValue = item.value
            }
            pitem.fieldId = item.id
          }
          // 编辑页面自定义赋值的时候会传多一个id
          if(this.$route.query.contactId){
            // console.log(this.editData)
          }
        })
      })
      // 联系人id的赋值
      if(this.$route.query.contactId){
        this.params['tbCrmContactsInfoPO.id'] = this.editData.vo.id
      }
    },
    // 负责人赋值params
    incharges(){
      let inchargesSelected = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
      let toarr = [];
      inchargesSelected.forEach((item) => {
        toarr.push(item.userId);
      })
      this.params.incharges = toarr.join();
    },
    // 相关人赋值params
    relatives(){
      let relativesSelected = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
      let ccarr = [];
      relativesSelected.forEach((item) => {
        ccarr.push(item.userId);
      })
      this.params.relatives = ccarr.join();
    },
    getHistoryContact(){
        if(this.$route.query.contactId){
            getContactHistoryInfo(this.getContactHistoryParams,(data) => {
              this.editData = data; // 编辑所有数据赋值给editData
              this.editCustomList = data.itemList;
              console.log(1)
              // 编辑页面  固定自定义字段赋值
              for(let i=0;i<this.contactData.length;i++){
                  this.contactData[i].value = data.vo[this.contactData[i].editName] // 固定字段赋值
                  // 固定字段中的生日赋值
                  if(this.contactData[i].type == 'dateTime' && this.contactData[i].optionName == '生日'){
                    this.contactData[i].value = data.vo.birthday
                    this.birthEditTimeVal = data.vo.birthday
                  }
                  // 自定义字段赋值
                  for(let j=0;j<data.itemList.length;j++){
                      if(this.contactData[i].optionName == data.itemList[j].fieldName && this.contactData[i].optionName!='生日'){
                        this.contactData[i].value = data.itemList[j].fieldValue
                        // 自定义字段中的时间赋值
                        if(this.contactData[i].type == 'dateTime'){
                          this.editTimeVal = data.itemList[j].optionVal
                        }
                      }
                  }
              }
              // 负责人赋值
              data.vo.toPersons.forEach((item) => {
                  this.dataBase.selectConfig.selectList["toPersonList"].userSelected = [];
                  this.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(item)
              })
              // 相关人赋值
              data.vo.ccPersons.forEach((item) => {
                  this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = [];
                  this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(item)
              })
              // 照片赋值
              data.vo.picList.forEach((item) => {
                  this.add.imgUpload.picList.push(item)
              })
              // 附件赋值
              // data.mediaList.forEach((item) => {
              //     this.add.fileUpload.mediaList.push(item)
              // })
              if(data.vo.clientId){
                  this.typeData = data.vo.clientId
              }
            })
        }
    },
    // 保存并关闭
    keepClose(){
      this.contactListParams(); // params的赋值
      let isPass = this.validateData();
      if(!isPass) return;
      this.incharges();
      this.relatives();
      this.params.itemJson = JSON.stringify(this.params.itemJson);
      if(this.$route.query.contactId){
        console.log(this.params)
        updateContact(this.params,(data) => {
          console.log(data)
        })
      }else{
        addContact(this.params,(data) => {
            // console.log(data)
        })
      }
    //   // 发送请求并跳转旧页面
    //   // this.params.itemJson = JSON.stringify(this.params.itemJson);
    //   if(this.params['tbCrmClientInfoPO.phone'] && this.params['tbCrmClientInfoPO.phone'] != ''){
    //     getValidPhone(this.params,
    //     (data) => {
    //       if(data!='0'){ // 重复的时候
    //         this.telRepeatMsg = true
    //       }else{
    //         this.telRepeatMsg = false;
    //         this.params['tbCrmClientInfoPO.industry'] = this.params['tbCrmClientInfoPO.industryName'];
    //         if(this.$route.query.clientId){
    //           // 判断是编辑页面的时候typeIds的值
    //           this.typesSelected ? this.params.typeIds = this.typesSelected.join()
    //           : this.params.typeIds = this.typeId.join();
    //           // 编辑的时候公海隐藏


    //           // 编辑页面的行业列表传值
    //           this.industriesSelected ? this.params.industrys = this.industriesSelected.join()
    //           : this.params.industrys = this.industryId.join()
    //         //   getClientUpdate(this.params,(data) => {

    //         //   })
    //         // }else if(!this.telRepeatMsg){
    //         //   this.params.itemJson = JSON.stringify(this.params.itemJson);
    //         //   // 新增客户需要传的
    //         //   this.params.typeId = this.typesSelected.join();
    //         //   this.params.poolId = this.poolsSelected;
    //         //   this.params.industrys = this.industriesSelected.join();
    //         //   getAddClient(this.params,(data) => {
    //         //     // 将params里面的参数属性转化成数组形式进行遍历比较
    //         //     // location.href = `${_.baseURL}/jsp/wap/crm/client/client_list.jsp`;
    //         //     // // 清除缓存
    //         //     localStorage.removeItem(this.routerName);
    //         //   })
    //         }
    //       }
    //     })
    //   }
    },
    listenToChild(val){
      for(let i = 0;i<this.listenDistrictMust.list.length;i++){
        if(this.listenDistrictMust.list[i].type == '4'){
          this.listenDistrictMust.list[i].value = val;
        }
      }
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


    // 初始化
    init () {
      // 初始化负责人相关人组件参数
      this.resetSelectPerson();
      // 给两个按钮绑定事件
      this.clientDetail.buttonConfig.primaryList[0].callBack = this.keepClose;
      // 给操作项绑定事件
      this.nav[1].clickEvent = this.clientBelong;
    },


    listenToTime(timeVal,timeItem){
      this.timeItem = timeItem;
      this.timeItem.value = timeVal;
    },
    // 客户名称
    checkClientName(){
      this.keyword.clientName = this.nav[0].value;

    },
    // 选择所属客户
    clientBelong () {
      this.typeTreeShow = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(clientConfig)
      searchClientList(this.params,(data) => {
        this.handleGetData(data.pageData)
        this.belongData = data.pageData;
        this.updateSelectValue(this.typeData);
        this.treeListIsShow=true;
        this.searchBoxShow=true;
      })
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
    // 点击树状input打印当前id
    typeIds(val){
      this.params['tbCrmClientInfoPO.poolId'] = val.join();
      if(this.params['tbCrmClientInfoPO.poolId'] === 0){
        this.params['tbCrmClientInfoPO.poolId'] = ''
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
    .wxContact{
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 25px;
    padding-right: 15px;
    padding-left: 15px;
    font-size: 13px;
    color:rgba(70,125,185,1);
    border-left: 1px solid #dadada;
    .wx_contact_icon{
      background:url('../../../../../assets/images/crm/wx_contact.png') center no-repeat;
      background-size:13px 13px;
      width: 20px;
      height: 20px;
      vertical-align: bottom;
      display: inline-block;
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
