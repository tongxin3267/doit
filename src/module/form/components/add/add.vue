<template>
	<div class="wrap">
		<div class="form-bg">
			<div class="form_title_box">
				<!--<div contenteditable="true" v-model="formTitle"></div>-->
				<div class="form-title-read" v-show="!updateTitle">
					<span>{{formTitle}}</span>
					<span class="icon-title-edit"
						  v-show="isUpdateTitle"
						  @click="editTitle">
					</span>
				</div>
				<div v-show="updateTitle" class="form-title-edit">
					<div class="title_edit_textarea" contenteditable="true"
						 @blur="saveFormTitle($event)"
						 @input="countLength($event)"
						 v-model="formTitle" >
						{{formTitle}}
					</div>
					<p class="font-count" :class="{colorRed:titleLength == 100}">{{titleLength}}/100</p>
				</div>
			</div>
			<div class="form-detail-box" v-if="content">
				<div class="form-detail-content"
					 :class="{'form-detail-content-height':showToggle&&!showAllMsg}">
					<p id="content" v-html="formatContent(content)"></p>
				</div>
				<!--模糊效果-->
				<div class="form-detail-content-blur"
					 v-if="showToggle&&!showAllMsg">
				</div>
				<div @click="toggleMsgfn"
					 v-if="showToggle" class="form-detail-content-toggle">{{toggleMsg}}
					<span :class="{'toggle-up': showAllMsg,'toggle-down':!showAllMsg}">
					</span>
				</div>
			</div>
		</div>
		<div style="text-align: center;" v-if="!isShowFields">
			<img src="../../../../assets/images/form_flow_filed.png" style="max-height: 80px;">
		</div>
		<formBase v-if="isShowFields" @change="fieldChange"/>
		<!--附件列表-->
		<add-file-list v-if="mediaList && mediaList.length"
									 agent="form"
									 customClass="file_list_len"
					   			 :filesList="mediaList"
									 :deleteFile="isFile?true:false"
					         :downLoad="true">
			<div slot="title" class="file_title">附件({{mediaList.length}})</div>
		</add-file-list>
		<add-img-list class="uploadFile"
									v-if="imgUploadPicList && imgUploadPicList.length"
									:imageList="imgUploadPicList"
									:disabled="false">
		</add-img-list>
		<div class="uploadFile">
			<!--上传附件-->
			<file_detail v-if="isFile"
									 agent="form"
									 :filesList="mediaList"
									 @updateFileList="showMsgFromFileDetail">
			</file_detail>
			<!--上传图片-->
			<add-img v-if="isPic" agent="form" :orderId="orderId" :camera="chooseImageTypes"
							 :imageList="imgUploadPicList"
							 @updateImageList="setImgUploadValue"
							 listType="'picture-card'">
			</add-img>
		</div>

		<div v-if="!isOpen">
			<!--流程列表-->
			<flow_list v-if="isFreeFlow==2"></flow_list>
			<!--负责人的内容-->
			<user_selected_group v-show="isRelatives && !isOpen"

								 title="负责人"
								 :loadLast="loadLastConfig.toPersonList"
								 @confirmPick="confirmToPick">
				<user_selected_item slot="user_selected_item"
									:List="toPersonList"
									:isEdit="editToPerson"
									title="负责人"
									@showPersonList="showPersonList"
									@showUserSelectedBox="toPersonListShowBox"
									:isRemove="editToPerson"
									@removeSelected="removeToPerson">
				</user_selected_item>
			</user_selected_group>
			<!--选择处理人-->
			<div v-if="FlowAuditUser.length">
				<user_selected_group
					v-if="item && item.startAuditList.show"
					v-for="(item,index) in FlowAuditUser"
					:key="item.id"
					:title="startAuditTitle(item.nodeName)"
					:mustChoose="true"
					:loadLast="loadLastConfig.auditPersonList"
					@confirmPick="confirmPick">
					<user_selected_item
						v-if="flowNodeItemKeysShow"
						@showUserSelectedBox="FlowAuditUserShowBox(index)"
						:isEdit="item.startAuditList.isCanEdit"
						slot="user_selected_item"
						:List="item.startAuditList.userSelected"
						:title="startAuditTitle(item.nodeName)"
						@showPersonList="showPersonList"
						@removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
						:isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
					</user_selected_item>
					<div class="qwui-user_cell_title" slot="qwui-user_select_person_open"
         		v-show="item.startAuditList.flowNodeItemKeys&&item.startAuditList.allUser.length===0">
      			<p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>
    			</div>
				</user_selected_group>
			</div>
			<!--相关人员的内容--->
			<!--选择相关人-->
			<user_selected_group v-show="isRelevants && !isOpen"
								 title="相关人"
								 :loadLast="loadLastConfig.ccPersonList"
								 @confirmPick="confirmCCPick">
				<user_selected_item :isRemove="editCCPerson"
														:isEdit="editCCPerson"
														title="相关人"
														@showPersonList="showPersonList"
														@showUserSelectedBox="ccPersonListShowBox"
														slot="user_selected_item"
														:List="ccPersonList"
														@removeSelected="removeCCPerson">
				</user_selected_item>
			</user_selected_group>
		</div>


		<!--匿名提交-->
		<div class="anonymous-ubmit" v-if="isAnonymous">
			<label @click="taggleAnonymous">
				<span class="qwui-checkbox-form"><i :class="{active:isAnonymousValue==1}"></i></span>匿名提交
			</label>
		</div>

		<!--底部操作按钮-->
		<flow_button :buttondata="buttonConfig"></flow_button>
		<div v-if="!isOpen">
			<!--<user_choose v-if="dataBase.selectConfig.show"></user_choose>-->
			<select_crm v-if="dataBase.selectCrm.show"></select_crm>
			<childView></childView>
			<!--处理人范围选人-->
			<user_selected_ranglist :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
									:selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
									:checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
									:config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
									:defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
									:checked="FlowAuditUserIds(appointUserIndex)"
									@FlowAuditUserResult="FlowAuditUserResult"
									v-if="FlowAuditUserBoxShow">
			</user_selected_ranglist>
			<!--选择节点处理人-->
			<choose_nodeList v-if="nextNodeListShow" @saveNodeAuditUserJson="submitedData" @showPersonList="showPersonList"></choose_nodeList>
		</div>

		<!--外部单底部logo-->
		<div class="openFooterContent" v-show="isOpen">
			<a href="http://wbg.do1.com.cn/" target="_blank">
				<img src="../../../../assets/images/newsmallLogo.png" alt="">
				微信办公，用企微云平台
			</a>
		</div>

		<!--外部单提交成功-->
		<open-commit-success v-if="succeedWin" @editAgain="editAgain" :succeedData="succeedData"></open-commit-success>

		<!--个人信息-->
		<user-info></user-info>

		<!--人员列表组件-->
		<user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>
	</div>
</template>

<script>

	import img_detail from '@/components/add/upload/add_img'
	import file_detail from '@/components/add/upload/add_file'
	import childView from '../childView'
	import formBase from '../formBase.vue'
	import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
	import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
	import userInfo from '@/components/detail/user_info_card';//个人信息
	import openCommitSuccess from './openCommitSuccess.vue'   //外部单提交成功界面
	//修改数据的函数
	import {getDefaultData} from '../data/analysisData'
	import {equation} from '../data/equation'
	import {form_validation,filterData} from '../../js/validation'
	//选人的导入
	import related_person_detail from '../../../../components/add/user_select_icon_right';
	import user_choose from '@/components/base/user_or_dept_select.vue' //js导入
	import flow_button from '@/components/button/flow_button';
	import select_crm from '../base/select_crm.vue'
	//流程的组件的导入
	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
	import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
	import choose_nodeList from '../../components/chooseNodeList'
	import flow_list from "@/components/flow/flow_list";
	import {getFrom, render_field,getOldGivenList,saveFormData,removeFormData,getFormData,setFieldShowHide,loadScript, getMember} from '../../js/getData'
	import Vue from 'vue'
	import audit_flow_api from '@/components/flow/api/getData'
	import addFileList from '@/components/add/upload/addFileList'
	import AddImg from '@/components/add/upload/add_img';
	import AddImgList from '@/components/add/upload/imgList';
	import user_show from '@/components/detail/user_show'
	export default {
		components: {
			formBase,
			user_choose,
			related_person_detail,
			flow_button,
			childView,
			select_crm,
			user_selected_item,
			user_selected_group,
			img_detail,
			file_detail,
			user_selected_ranglist,
			choose_nodeList,
			flow_list,
			openCommitSuccess,
			userInfo,
			addFileList,
			AddImgList,
			AddImg,
			user_show
		},
		data() {
			return {
				dataBase: dataBase,
				submitURL:'',
				queryType:'',
				formTitle: '',
                newFormTitle:'',
				content: '',
				//提交表单需要的数据
				id: '',
				definition_id: '',
				isFreeFlow: '',
				isTask: '',
				isBranchNode: false,
				orderId: '',       //图片水印参数
				definitionVersionsId:'',
				chooseImageTypes: [],//手机端图片上传参数
				status: '',
				instanceTitleTemplate: '',
				instanceTitle: '',
				isUpdateTitle: true,//标题是否能更新
				updateTitle: false,
				isAnonymous: '',//是否匿名提交
				buttonConfig: { //操作按钮
					primaryList: [{type: "primary", name: '立即提交', callBack: null}],
					defaultList: [{type: "default", name: '保存为草稿', callBack: null}],
					style: {class: ""}//按钮是否置底部 active :底部、"":相对定位
				},
				isAnonymous:false,//匿名提交
				isAnonymousValue:'',//匿名提交数据
				isPic:false,//是否上传图片
				isFile:false,//是否上传文件
				isFileMust:false,//是否一定要上传文件
				ccPersonList:[],//相关人
				toPersonList:[],//负责人
				editToPerson:false,
				editCCPerson:false,
				isRelevants:false,
				isRelatives:false,
				loadLastConfig: {
					ccPersonList: {
						type: '1',
						show: false,
						name: '加载上次',
						isGetVal: false,
					},
					toPersonList: {
						type: '0',
						show: false,
						name: '加载上次',
						isGetVal: false,
					},
					auditPersonList:{
						type: '0',
						show: false,
						name: '加载上次',
						isGetVal: false,
					}
				},
				//图片数据
				imgUpload: {
					picList: [],
				},
				//文件数据
				fileUpload: {
					mediaList: 1,
					url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
				},
				mediaList:[],

				showAllMsg:false,
				toggleMsg:'展开显示全部',
				showToggle:false, //是否展开收起全部的按钮
				titleLength:0,
				stopClick:false,   //禁止保存草稿和提交 按钮多次点击
				isOpen:false,   //是否是外部单
				succeedWin:false,//显示外部单提交成功框
				succeedData:{     //外部单提交成功传输的数据
					openDetailId:'', //提交成功的id
					isSearchForm:false, //提交成功的id
				},
				imgUploadPicList:[],
				showPerson:false,                                                   //是否展开所有选中人员列表
				userselectTitle:'',
				userSelectList:[],
				limitPreview:false,                                                //限制弹个人信息弹窗
			}
		},
		computed: {
			...mapState({
				FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow, // 是否显示选人弹窗
				nextNodeListShow: state => state.userSelected.nextNodeListShow, // 是否显示选择下一个节点
				FlowAuditUser: state => state.userSelected.FlowAuditUser, // 处理人信息
				//ccPersonList: state => state.userSelected.ccPersonList, // 相关人信息
				flowChioseNodeAuditUser: state  => state.userSelected.flowChioseNodeAuditUser, // 当前节点指定处理人的处理人信息
				flowChioseNodeAuditUserJson: state => state.userSelected.flowChioseNodeAuditUserJson, // 当前节点指定处理人的处理人json
				choiseFlowUserJson: state => state.userSelected.choiseFlowUserJson, // 已选的处理人json(后台允许上一节点指定处理人:固定流程 人员id|人员id
																					// 分支流程 {节点id:人员id|人员id,节点id:人员id|人员id})
				flowDpIdJson: state => state.userSelected.flowDpIdJson, // 并行节点，多部门，选择的部门({节点id:部门id,节点id:部门id})
				flowList: state => state.userSelected.flowList, // 流程列表
				flowId: state => state.userSelected.flowId, // 已选的流程id
				currentNodeId: state => state.userSelected.currentNodeId, // 当前节点id
				nextNodeId: state => state.userSelected.nextNodeId, // 下一节点id
				parallelNextNodeIds: state => state.userSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开
				appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
				appointUserIndex:state => state.userSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
			}),
			...mapGetters([
				"FlowAuditUserIds",   // 已选择的处理人id
			]),
			isShowFields(){
				return this.isFreeFlow==2&&!this.queryType?this.flowId==""?false:true:true
			},
			schema(){
				return this.$store.state.formBase.schema;
			},
			// 人员控件关联下一步处理人组件显示
			flowNodeItemKeysShow() {
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					if(this.FlowAuditUser[0].startAuditList.allUser.length === 0){
						return false
					}else{
						return true
					}
				}else if(this.FlowAuditUser[0].startAuditList){
					return true;
				}else{
					return false;
				}
			},
		},
		created() {
			var EventBus = new Vue();
			this.$root.EventBus = EventBus;
			this.$store.commit('reset');
			var _this = this;
			this.initForm();
			this.buttonConfig.primaryList[0].callBack = function () {
				_this.submited();
			};
			this.buttonConfig.defaultList[0]?this.buttonConfig.defaultList[0].callBack = function () {
				_this.saveDraft();
			}:'';
			// 重置数据
			this.$store.commit('resetFlowData');
			this.$store.commit('resetDetailData');
		},
		updated() {
			var content = document.getElementsByClassName('form-detail-content')[0]
			if(content){
				var contentH = content.offsetHeight;
				if(contentH > 129){
					content.style.setProperty('padding-bottom', '0px');
					this.showToggle = true;
				}
			}
		},
		methods: {
			...mapMutations([
				"removeFlowAuditUser",        // 删除处理人
				"updateNextNodeList",         // 更新下个节点列表
				'saveChoiseFlowUserJson',     // 自由选择处理人信息
			]),
			...mapActions([
				"updateFlowUserSelected",     // 更新已选处理人
			]),
			startAuditTitle:function(nodeName) {
				return nodeName ? nodeName+'处理人' : '处理人'
			},
			// 选择处理人弹窗
			FlowAuditUserShowBox(index) {
				this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
				// 如果是指定范围选人
				if(this.FlowAuditUser[index].startAuditList.assignRange) {
					this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
				}else {
					var _this = this;
					dataBase.selectConfig.show = true;
					dataBase.selectConfig.signIndex = 'users';
					dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
						_this.$store.commit('updateUserSelected',data.user.data)
					}
					dataBase.selectConfig.selectList.users.userSelected = this.FlowAuditUser[index].startAuditList.userSelected;
				}
			},
			// 人员控件获取字段名
			isItemKeys(keys){
				var str = '';
				if(keys){
					this.$store.state.formBase.schema.forEach((item)=>{
						if(keys.indexOf(item._id)>=0){
							str+=item.label+'，';
						}
					})
				}
				return str.substring(0,str.length-1);
			},
			// 选择处理人后
			FlowAuditUserResult(payload) {
				this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: false})
				// 如果是多部门，则请求部门负责人
				this.updateFlowUserSelected(payload)
			},
			showMsgFromImgDetail(imgurl){
				console.log(imgurl);
//				this.commitDraft.draftFormData['imageUrls'] = '';
//				this.commitDraft.draftFormData['imageUrls'] = this.arrayToString(imgurl, 1);
			},
			setImgUploadValue(val){
				this.imgUploadPicList = val;
			},
			showMsgFromFileDetail(mediaId){
				this.mediaList.concat(mediaId);
			},
			taggleAnonymous(){
				if(this.isAnonymousValue){
					this.isAnonymousValue = '';
					this.buttonConfig.primaryList[0].name = '立即提交';
				}else{
					this.isAnonymousValue = 1;
					this.buttonConfig.primaryList[0].name = '匿名提交';
				}
			},
			fieldChange(val){
				var formData = this.$store.state.formBase.data;
				if(!this.queryType && JSON.stringify(val) != '{"key":"","value":""}'){
					saveFormData(JSON.stringify(formData));
				}
				var fieldArry = this.$store.state.formBase.fieldArry;
				var templateObj = this.$store.state.formBase.templateObj;
				var typeMap = this.$store.state.formBase.typeMap;
				var choiceMap = this.$store.state.formBase.choiceMap;
				if(fieldArry.indexOf(val.key)!=-1) {
					templateObj[ '{' + val.key + '}' ] = val.value;
					//下拉框
					if (typeMap[ val.key ] == 'DropDown') {
						templateObj[ '{' + val.key + '}' ] = choiceMap[ val.value ] || '';
					}
				}
				if(JSON.stringify(templateObj)=='{}') return ;
					var ctitle = this.instanceTitleTemplate;
					this.schema.forEach(item =>{
						for(var k in templateObj) {
							if('{'+item._id+'}'===k && item.show){
								ctitle = ctitle.replace(new RegExp(k,"g"),templateObj[k]);
							}
						}
					})
					ctitle = ctitle.replace(new RegExp('\\{(.*?)\\}','g'),'');
					ctitle = ctitle.replace(new RegExp('&nbsp;','g'),'').substring(0,100);
					this.formTitle = ctitle;
					this.newFormTitle = this.formTitle;
			},
			initForm() {
				var _this = this;
				console.log(this.$route.query.id)
				console.log(this.$route.query)
				var id = this.$route.query.id;
				this.queryType = this.$route.query.type;
				if(this.queryType === 'edit'){
					this.submitURL = _.baseURL + '/portal/portalForm/updateFroms.do';
					document.title = '编辑表单'
				}
				else{
					this.submitURL = _.baseURL + '/portal/portalForm/addFroms.do';
				}
				if(this.$route.path === "/open/add"){
					this.queryType = 'open'
					this.buttonConfig.defaultList=[];
					this.isOpen = true;
					this.submitURL = _.baseURL + '/open/openForm/addFroms.do'
				}
				this.id = id;
				_.showLoading()
				getFrom(this.queryType,id).then(function (result) {
					_this.stopClick = false;
					if (result.code == "0") {
						//判断是否有省市区的数据
						var url = result.data.distpicker_data
						loadScript(url).then(res => {
							_.hideLoading()
						//初始化表单数据
						var schema = result.data.fields;
						var detailsPO = result.data.detailsPO;
						var controlPO = result.data.controlPO;
						_this.content = detailsPO.content;
						_this.definition_id = result.data.id;
						_this.definitionVersionsId = detailsPO.definitionVersionsId;
						_this.orderId = result.data.isImgWatermark ? _this.definitionVersionsId : '';//图片水印传参 ：orderId
						_this.chooseImageTypes = controlPO.formPhotoSet && "0" == controlPO.formPhotoSet ? ['album','camera'] : ['camera'];//手机端图片上传控制
						var defaultData = Object.assign(result.data.default,result.data.itemMap);
						//获取缓存数据
						var cacheData = getFormData();
						if(cacheData){
							defaultData = Object.assign(defaultData,JSON.parse(cacheData));
						}
						if (result.data.isNewVersions) {
							_.alert("提示", "该表单已发布新版本，请确定你填写的数据");
						}
						//外部单的数据
						if(result.data.controlPO.isSearchForm === '1')
							_this.succeedData.isSearchForm = true;
						//表单标题不可编辑
						if (controlPO.isUpdaeTitle == 0) {
							_this.isUpdateTitle = false;
						}
						if(controlPO.isAnonymous == '1'){
							_this.isAnonymous = true;
						}
						if(controlPO.isPic == '1'){
							_this.isPic = true;
						}
						if(controlPO.isFile == '1'){
							_this.isFile = true;
							_this.isFileMust = controlPO.isFileMust||false;
						}
						var mediaList = result.data.mediaList;
						_this.mediaList = mediaList;
						if(result.data.picList && result.data.picList.length>0){
							var list = [];
							result.data.picList.forEach((item,index)=>{
								list.push({src:item.picPath});
							})
							_this.imgUploadPicList = list;
						}
						_this.fileUpload.mediaList = 2;
						//如果表单未开始填写
						if (result.data.timebefore) {
							_.alert("提示", "表单开始填写时间：" + controlPO.startTime);
							return;
						}
						var quota = result.data.quota;
						var store = _this.$store;
						render_field(store, schema, defaultData);
						//setFormDetail
						store.commit('setFormDetail', controlPO);
						store.commit('setSelectQuota', quota);
						var resultData = {
							controlPO: result.data.controlPO,
							detailsPO: result.data.detailsPO,
							isImgWatermark:result.data.isImgWatermark
						}
						store.commit ('updateDetailData', resultData);

						//表单标题模板代码
						var instanceTitleTemplate = result.data.instanceTitleTemplate;
						_this.instanceTitleTemplate = instanceTitleTemplate;
						var typeMap = _this.$store.state.formBase.typeMap;
						var choiceMap = _this.$store.state.formBase.choiceMap;
						var fieldArry = [];
						var templateObj = {};
						if(instanceTitleTemplate){
							var arry = instanceTitleTemplate.match(/{[^}]+}/g);
							if(arry&&arry.length>0){
								arry.forEach(function(item){
									var key = item.substring(1,item.length-1);
									fieldArry.push(key);
									var defaultvalue = defaultData[key]||'';
									templateObj[item] = defaultvalue;
									if(typeMap[key] == 'DropDown'){
										templateObj[item] = choiceMap[defaultvalue]||'';
									}
								});
							}else{
								if(_this.queryType === 'edit'){
									instanceTitleTemplate = result.data.instanceTitle || result.data.detailsPO.formName;
								}else{
									instanceTitleTemplate = instanceTitleTemplate || result.data.detailsPO.formName;
								}
								if(controlPO.isBuildTitle) {
									_this.formTitle = instanceTitleTemplate.replace(new RegExp('&nbsp;','g'),'');
									_this.newFormTitle = _this.formTitle;
								}
							}
						}else if(controlPO.isBuildTitle) {
							_this.formTitle = result.data.instanceTitle;
							_this.newFormTitle = _this.formTitle;
						}
						store.commit('setTemplateObj',templateObj);
						store.commit('setFieldArry',fieldArry);
						if(fieldArry.length>0){
							var ctitle = instanceTitleTemplate;
							for(var k in templateObj){
								ctitle = ctitle.replace(new RegExp(k,"g"),templateObj[k]);
							}
							var ctitle = ctitle.replace(new RegExp('&nbsp;','g'),'').substring(0,100);
							_this.formTitle = ctitle;
							_this.newFormTitle = _this.formTitle;
						}
					//	外部单则不执行流程代码
						if(_this.isOpen){
							_this.formFieldControlList(result.data.formFieldControlList);
							_this._addField()//外部单field1...fieldn功能
							return;
						}
						//相关人和负责人

						//允许修改相关人
						if(controlPO.isRelevants=="1"){
							_this.isRelevants = true;
							_this.ccPersonList = result.data.relevantList || result.data.receiveList || [];
							if(controlPO.isDisableRelevants=="0"){
								_this.editCCPerson = true;
								//新增时显示加载上一次开关
								_this.loadLastConfig.ccPersonList.show = true;
							}
						}
						//不是审批单的负责人显示,审批单的负责人是审批人
						_this.isTask = controlPO.isTask;
						if(controlPO.isTask != 2 && controlPO.isTask != 3){
							//隐藏审批单的处理人，如果是普通单和任务单就显示
							_this.FlowAuditUser.length = 0;
							if(controlPO.isRelatives=="1"){
								_this.isRelatives = true;
								_this.toPersonList = result.data.givenList||result.data.inchargesList||[]
								if(controlPO.isDisableRelatives=="0"){//允许添加负责人的属性
									_this.editToPerson = true;
									//新增时显示加载上一次开关
									_this.loadLastConfig.toPersonList.show = true;
								}
							}
						}
						_this.isFreeFlow = controlPO.isFreeFlow;
						if(controlPO.isTask == 2 && controlPO.isFreeFlow == "1"){
							//负责人进入编辑页面不显示处理人编辑入口
							if(result.data.controlPO.isDisableRelatives != '0'){
								_this.FlowAuditUser[0].startAuditList.isCanEdit = false;
							}else{
								_this.FlowAuditUser[0].startAuditList.isCanEdit = true;
								//新增时显示加载上一次开关
								_this.loadLastConfig.auditPersonList.show = true;
							}
						}
						//审批单，判断是什么流程,isFreeFlow=="1"自由流程isFreeFlow=="2"固定流程 isFreeFlow=="3"分支流程
						if(controlPO.isTask == 2 && controlPO.isFreeFlow=="1"){
							console.log('审批单')
							_this.$store.commit('resetFlowAuditUser');
							//修改自由流程的审批人员的store
							if(controlPO.isRelatives=="1"){
								var auditPerson = result.data.givenList||result.data.inchargesList||[];
								_this.$store.commit('updateUserSelected',auditPerson);
							}

							}
							if ((controlPO.isTask == 2 && controlPO.isFreeFlow != "1") || controlPO.isTask == 3) {
								_this.searchFlowList ();
							}
						})
					} else {
							let btnConfig={
								primaryBtn:{name:"i18n.confirm", callBack: null},
								defaultBtn:{name:"", callBack:null},
							};
						if(result.code=='22107'){//设置项不允许普通单/任务单的负责人重新提交表单
							btnConfig.primaryBtn.callBack = function (){
								_this.$router.push({name: 'detail', query: { id: _this.id}});
							}
						}else{
							btnConfig.primaryBtn.callBack = function (){
								_this.$router.go(-1);
							};
						}
						_.alert("i18n.notice", result.desc,btnConfig);
					}
				});
			},
			//外部单field1...fieldn功能
			_addField(){
				var fields = this.schema;
				var fieldValue = this._getRouterField();
				for(var i = 0;i<fields.length;i++){
					if(fields[i]._type == "TextField"){
						for(var j = 0;j<fieldValue.length;j++){
							if(fields[i].value == undefined){
								fields[i].value = fieldValue[j];
								delete fieldValue[j];
							}
						}
					}
				}
			},
			//获取外部单链接中的参数field的值
			_getRouterField(){
				var fields = [];
				var routerParms = this.$route.query;
				for(var attr in routerParms){
					if(attr.includes("field")){
						fields.push(routerParms[attr])
					}
				}
				return fields;
			},
			//提交表单按钮
			submited() {
				if(this.stopClick) return;
				this.status = '1';
				let checkUser = true;
				if (this.getFormData()) {
					// isTask：2审批单 / 3外部单
					if (this.isTask == 2 || this.isTask ==3) {
						var data = {
							creator: this.dataBase.config.userId,
							checkUser:checkUser,
							isFree: this.isFreeFlow == '2'? '0': this.isFreeFlow,
							flowListLength: this.flowList.length,
							flowId: this.flowId,
							FlowAuditUser: this.FlowAuditUser,
							isBranchNode: this.isBranchNode,
							appointNodeAndUserVOList: this.appointNodeAndUserVOList,
							appointCallback: this.appointCallback,
							branchNodeCallback: this.branchNodeCallBack,
							showUserBoxCallback: this.showFlowAuditUserBox
						}
						audit_flow_api.isCheckFlow(data, this.submitedData);
					} else {
						this.submitedData();
					}
				}
			},
			saveDraft() {
				if(this.stopClick) return;
				this.status = '0';
				console.log(this.$store.state.formBase.data)
				//草稿不需要验证单的信息
				this.submitedData();
			},
			stringUserIds(array) {
				let ids = array.map((value)=>{
					return value.userId;
				})
				return ids;
			},
			formFieldControlList(data){
				if(!data) return
				var map = {};
				var _this = this;
				data.forEach((item)=>{
					//外部单的控制
					if(_this.isOpen){
						map[item.itemKey] = item.isRead?true:false;
					}else{
						map[item.fieldId] = item.isRead?true:false;
					}
				});
				setFieldShowHide(this.$store,map)
			},
			submitedData() {
				var _this = this;
				this.stopClick = true;
				var itemMap = filterData(this.$store);
				var relatives = this.stringUserIds(this.ccPersonList).join(',');
				var incharges;
				var chooseFlowUser;
				var flowDpId ;
				var flowChioseNodeAuditUserJson;
				// isTask：2审批单 / 3外部单
				if (this.isTask == 2 || this.isTask == 3) {
					if (this.isFreeFlow == 3) {
						if (this.FlowAuditUser.length) {
							this.$store.commit("saveChoiseFlowUserJson");
							chooseFlowUser = this.choiseFlowUserJson;
							flowDpId = this.flowDpIdJson;
						}
					} else {
						if (this.FlowAuditUser.length) {
							var userSelected = this.FlowAuditUser[0].startAuditList.userSelected;
							var userIds = [...this.stringUserIds(userSelected)];
							if (this.isFreeFlow == 1) {
								incharges = userIds.join(',');
							} else {
								chooseFlowUser = userIds.join('|');
								if (this.FlowAuditUser[0].audtiFlag == "2") {
									flowDpId = userSelected[0].deptId;
								}
							}
						}
					}

					if (this.appointNodeAndUserVOList.length) {
						flowChioseNodeAuditUserJson = JSON.stringify(this.flowChioseNodeAuditUserJson);
					}
				} else {
					var ids = this.toPersonList.map((value)=>{
						return value.userId;
					})
					incharges = ids.join(',');
				}
				var data = {};
					if(this.isOpen){
						data = 	{
							id: this.id,
							definition_id: this.definition_id,
							status: 1,
							longitude:'',
							latitude:'',
							formTitle: this.newFormTitle,
							instanceTitle:this.newFormTitle,
							instanceTitleTemplate:this.instanceTitleTemplate,
							itemMap: itemMap,
							imageUrls: this.imgUploadPicList.map(item=>item.src).join(','),
							mediaIds: this.mediaList.map(item=>item.id).join(','),
							isAnonymous: this.isAnonymousValue
						}
					}else{
						data={
							id: this.id,
							definition_id: this.definition_id,
							status: this.status,
							formTitle: this.newFormTitle,
							instanceTitle: this.newFormTitle,
							instanceTitleTemplate:this.instanceTitleTemplate,
							isAnonymous: this.isAnonymousValue,
							flowId: this.flowId,
							flowDpId: flowDpId,
							nextNodeId: this.nextNodeId,
							currentNodeId: this.currentNodeId,
							relatives:relatives,
							incharges:incharges,
							itemMap: itemMap,
							imageUrls: this.imgUploadPicList.map(item=>item.src).join(','),
							mediaIds: this.mediaList.map(item=>item.id).join(','),
							flowChioseNodeAuditUserJson: flowChioseNodeAuditUserJson,
							chooseFlowUser: chooseFlowUser
						}
					}
				_.showLoading('正在提交');
				_.ajax({
					url: this.submitURL,
					type: "POST",
					data: data,
					success: function (result) {
						_.hideLoading()
						console.log(result)
						if (result.code == "0") {
							removeFormData();
							if(_this.isOpen){
								_this.succeedData.openDetailId = result.data.tbFormWorkOrderPOId;
								return _this.succeedWin = true;  //是外部单则打开提交成功页面
							}
							if(_this.status == '0'){
								_this.$router.push({name: 'draft'});
							}else if(_this.status == '1'){
								_this.$router.push({name: 'submited'});
							}
						} else {
							_this.stopClick = false;
							_.alert('提示', result.desc);
						}
					}
				});
			},
			validations() {
				var schema = this.$store.state.formBase.schema;
				return form_validation(schema);
			},
			getFormData() {
				return this.validations();
			},
			editTitle() {
				this.updateTitle = true;
				this.titleLength = this.formTitle.length?this.formTitle.length:0;
			},

			// 选择相关人
			ccPersonListShowBox(){
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'users';
				dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
					_this.ccPersonList = data.user.data;
				}
				dataBase.selectConfig.selectList.users.userSelected = this.ccPersonList;
			},

			toPersonListShowBox(){
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'users';
				dataBase.selectConfig.selectList.users.callBack.confirm = function(id,data){
					_this.toPersonList = data.user.data;
				}
				dataBase.selectConfig.selectList.users.userSelected = this.toPersonList;
			},
			// 加载自由流程的审批人
			confirmPick(type, isGet) {
				var _this = this;
				if (isGet) {
					getOldGivenList({"type" : type}).then(function(result){
						if(result.code=="0"){
							var ccOrTolist = result.data.ccOrTolist;
							if(ccOrTolist && ccOrTolist.length>0 && "0" == type){
								_this.$store.commit('updateUserSelected',ccOrTolist);
							}
						}
					});
				} else {
					this.$store.commit('updateUserSelected',[]);
				}
			},
			confirmToPick(type, isGet){
				var _this = this;
				if(isGet){
					getOldGivenList({"type" : type}).then(function(result){
						if(result.code=="0"){
							var ccOrTolist = result.data.ccOrTolist;
							if(ccOrTolist && ccOrTolist.length>0 && "0" == type){
								_this.toPersonList = ccOrTolist;
							}
						}
					});
				}else{
					this.toPersonList.splice(0,this.toPersonList.length);
				}
			},
			confirmCCPick(type, isGet){
				var _this = this;
				if(isGet){
					getOldGivenList({"type" : type}).then(function(result){
						if(result.code=="0"){
							var ccOrTolist = result.data.ccOrTolist;
							if(ccOrTolist && ccOrTolist.length>0 && "1" == type){
								_this.ccPersonList = ccOrTolist;
							}
						}
					});
				}else{
					this.ccPersonList.splice(0,this.ccPersonList.length);
				}
			},
			//删除负责人
			removeToPerson(payload){
				this.toPersonList.splice(payload.index,1);
			},
			// 删除相关人
			removeCCPerson(payload) {
				this.ccPersonList.splice(payload.index,1);
			},
			toggleMsgfn() {
				this.showAllMsg = !this.showAllMsg;
				this.toggleMsg = this.showAllMsg ? '收起': '展开显示全部' ;
			},
			countLength({target}){
				this.titleLength = target.innerText.length
				if(target.innerText.length > 100){
					target.blur()	;
					this.titleLength = 100;
					target.innerText=target.innerText.slice(0,100)
				}
			},
			saveFormTitle({target}){
				this.newFormTitle = target.innerText;
			},
			showFlowAuditUserBox() {
				this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true});
			},
			showPersonList(title,list){
				this.userselectTitle = title;
				this.userSelectList = list;
				this.showPerson = true;
				this.limitPreview = true
			},
			// 自由选择处理人，显示选人弹窗
			appointCallback(){
				this.$store.commit("updateUserSelectedData", {type: "nextNodeListShow", data: true});
			},
			// 处理人员控件所选人员
			flowNodeItemKeysDate(flowNodeItemKeys){
				if(flowNodeItemKeys){
                    var ItemKeys = []
                    ItemKeys = flowNodeItemKeys.split('|');
					this.$store.commit('updateFlowNodeItemKeys', flowNodeItemKeys);
					let users = [];
					let userItem = [];
					for(let i=0; i<ItemKeys.length; i++){
						var person = this.$store.state.formBase.data[ItemKeys[i]] || [];
						userItem.push(...person);
						if(userItem){
							userItem.forEach(item =>{
								let arry = item.split('_');
								users.push(arry[0])
							});
						}
					}
					let ids = users.unique().join(',');
					ids && getMember(ids, (res) => {
						this.$store.commit('updateItemKeysSelected',res);
					});
				}
			},
			branchNodeCallBack(){
				var _this = this;
				var data = {
					templateRefId: this.definition_id,
					currentNodeId: this.currentNodeId,
				};
				let typeMap = this.$store.state.formBase.typeMap;
				let choiceMap = this.$store.state.formBase.choiceMap;
				let formData = JSON.parse(JSON.stringify(this.$store.state.formBase.data));
				let newData = {};
				for(let i in formData){
					//	不同的字段类型不同传参
					switch(typeMap[i]){
						case 'MEMBERCustomerField':		//	通讯录字段
						case 'DEPTCustomerField':			//	部门字段
						case 'CRMCustomerField':			//  CRM字段
							newData['searchValue.'+ i] = formData[i].join('|');
						break;
						case 'RadioButton':						// 单项选择
						case 'DropDown':							// 下拉框
							newData['searchValue.'+ i] = choiceMap[formData[i]]
						break;
						default:
							newData['searchValue.'+ i] = formData[i];
					}
				}
				data = Object.assign(data,newData)
				audit_flow_api.findBranchFlowNextNodeInfo(data, (result) => {
					// 判断下一节点是否是人员控件选择的处理人
					if(result.nodeInfo.length != 0){
						var flowNodeItemKeys = result.nodeInfo[0].flowNodeItemKeys;
						_this.flowNodeItemKeysDate(flowNodeItemKeys);
					}
					this.$store.commit('updateFlowAuditUser', result.nodeInfo);
					this.$store.commit('updateAppointNodeVOList', result.appointNodeAndUserVOList);
					this.$store.commit("updateNextNodeList", result.nextNodeList);
					this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: result.nextNodeId});
					this.$store.commit("updateUserSelectedData", {type: 'nextNodeListShow', data: true});
					this.$store.commit('updateUserSelectedData', {type: 'parallelNextNodeIds', data: result.parallelNextNodeIds});
				})
			},
			searchFlowList() {
				var _this = this;
				var flowId = this.queryType == "edit" ? _this.$route.query.id : "";
				var dataParam = {
					id: _this.definitionVersionsId,
					definitionId: _this.definition_id,
					isBranchFlow: _this.isFreeFlow == 3 ? true : false,
					flowId: flowId
				}
				var config = {
					isFreeFlow: _this.isFreeFlow,
				}
				// 固定、分支请求流程列表 /portal/flow/flowAction!ajaxSearchFlowList.action
				audit_flow_api.searchFlowList(dataParam, config, function (data) {
					// 判断下一节点是否是人员控件选择的处理人
					if(data.nodeInfo.length != 0){
						var flowNodeItemKeys = data.nodeInfo[0].flowNodeItemKeys;
						_this.flowNodeItemKeysDate(flowNodeItemKeys);
					}
					_this.$store.commit('updateFlowAuditUser', data.nodeInfo);
					_this.$store.commit('updateAppointNodeVOList', data.appointNodeAndUserVOList);
					_this.$store.commit('updateFlowList', data.flowList);
					_this.$store.commit('updateUserSelectedData', {type: 'flowId', data: data.flowId});
					_this.$store.commit("updateUserSelectedData", {type: 'currentNodeId', data: data.currentNodeId})
					_this.$store.commit("updateUserSelectedData", {type: 'nextNodeId', data: data.nextNodeId})
					_this.isBranchNode = data.isBranchNode;
					//表单字段的可见信息
					var firstFieldControlList = data.firstFieldControlList;
					if(firstFieldControlList){
						_this.formFieldControlList(firstFieldControlList);
					}
				});
			},
			editAgain(){
				this.$store.commit('reset');
				this.initForm();
				this.succeedWin = false;
			},
			//修改富文本中的图片地址
			formatContent(str){
				return str.replace(/@fileweb@\/compress/g,_.compressURL);
			}
		},
		watch:{
				'schema': {
					handler() {
						var val = {
							key:'',
							value:''
						}
						this.fieldChange(val)
					},
					deep: true
				},
		}
	}

</script>
<style scoped>
	.uploadFile{
		padding:5px 15px;
		background-color: #fff;
	}
	.openFooterContent {
		width: 100%;
		height: 16px;
		line-height: 16px;
		padding: 10px 0;
		text-align: center;
		font-size: 0;
	}
	.openFooterContent a {
		font-size: 12px;
		color: #999;
	}
	.openFooterContent img {
		margin-right: 5px;
		width: 15px;
		height: 15px;
		vertical-align: middle;
	}
  .anonymous-ubmit{
    margin:20px 0 5px 15px;
  }
</style>
