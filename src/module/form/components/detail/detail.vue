<template>
	<div class="wrap" ref="wrap" v-windowscroll="scrollList" v-if="detail">
		<div class="form-bg">
			<div class="form_title_box">
				<!--标题信息-->
				<div class="form-title-read">
					<span>{{formTitle}}</span>
					<apply-status :applystatus="applystatus" v-show="applystatus.show"></apply-status>
				</div>
				<div class="mt10">
					<span class="form-title-span">{{createTime}}</span>
					<span class="form-title-span" :class="{colorblue:creatorColor}" @click="showPersonDetail">{{personName}}</span>
					<span class="form-title-span colorblue" v-show="isCreator" @click="goCopyForm">复制</span>
					<span class="form-title-span colorblue" v-show="isCanUpdate" @click="goEditForm">修改</span>
					<span class="colorblue" @click="printDetail">打印预览</span>
				</div>
			</div>
			<div class="form-detail-box" v-if="detail_content">
				<div ref="content" class="form-detail-content"   :class="{'form-detail-content-height':showToggle&&!showAllMsg}">
					<p id="content" v-html="formatContent(detail_content)"></p>
				</div>
				<!--模糊效果-->
				<div class="form-detail-content-blur" v-if="showToggle&&!showAllMsg"></div>
				<div  v-if="showToggle" @click="toggleMsgfn" class="form-detail-content-toggle">{{toggleMsg}} <span :class="{'toggle-up': showAllMsg,'toggle-down':!showAllMsg}"></span></div>
			</div>
		</div>

		<formBase @change="fieldChange" @historyTitle="paramHistoryData" @showSaveBtn="showSave = true"></formBase>
		<!--附件列表-->
		<add-file-list v-if="mediaList && mediaList.length"
									 agent="form"
					   			 customClass="file_list_len"
									 :filesList="mediaList"
									 :deleteFile="false"
									 :downLoad="true">
			<div slot="title" class="file_title">附件({{mediaList.length}})</div>
		</add-file-list>
		<add-img-list class="uploadFile"
									v-if="imgUploadPicList && imgUploadPicList.length"
									:imageList="imgUploadPicList"
									:disabled="true">
		</add-img-list>
		<!--上一页下一页-->
		<flow-button v-if="showSave" :buttondata="buttonConfig"></flow-button>
		<prev_next @refreshFrom="refreshFrom"></prev_next>
		<div style="position: relative;" :class="{'circulationDetails':isShowSerial}">
				<span class="qwui-serial_entrance" @click="getFlowSerial" v-show="isShowSerial"><i class="qwui-icon_serial"></i>流转明细</span>

				<!--审批人或负责人-->
				<user_selected_group
					v-if="showToPersons && userSelect.toPersonList.userSelected.length"
					:title="userSelect.toPersonList.title"
					:isEdit="false">
					<user_selected_item
						:List="userSelect.toPersonList.userSelected"
						:title="userSelect.toPersonList.title"
						:isEdit="false"
						@atThisPersonUtil="atThisPersonUtil"
						@showPersonList="showPersonList"
						slot="user_selected_item"></user_selected_item>
				</user_selected_group>

			  <!--当前处理人-->
				<user_selected_group
					v-for="(item,index) in startAuditList"
					:key="index"
					v-if="startAuditList && item.auditUserList.length"
					:title="startAuditTitle(item)"
					:isEdit="false">
					<user_selected_item
						:List="item.auditUserList"
						:title="startAuditTitle(item)"
						:isEdit="false"
						@atThisPersonUtil="atThisPersonUtil"
						@showPersonList="showPersonList"
						slot="user_selected_item">
					</user_selected_item>
				</user_selected_group>

				<!--下一步处理人-->
				<user_selected_group
					v-if="nextAuditListShow"
					v-for="(item,index) in FlowAuditUser"
					title="下一步处理人"
					:isEdit="false">
					<user_selected_item
						v-if="flowNodeItemKeysShow"
						slot="user_selected_item"
						title="下一步处理人"
						:List="isListShow"
						:isEdit="isEditShow"
						@atThisPersonUtil="atThisPersonUtil"
						@showUserSelectedBox="FlowAuditUserShowBox(index)"
						@showPersonList="showPersonList"
						@removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
						:isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
					</user_selected_item>
					<div class="qwui-user_cell_title" slot="qwui-user_select_person_open"
						v-show="item.startAuditList.flowNodeItemKeys && item.startAuditList.allUser.length === 0">
						<p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>
					</div>
				</user_selected_group>

				<!--相关人-->
				<user_selected_group
					v-if="userSelect.ccPersonList.userSelected.length"
					title="相关人" :isEdit="false">
					<user_selected_item
						:List="userSelect.ccPersonList.userSelected"
						:isEdit="false"
						title="相关人"
						@atThisPersonUtil="atThisPersonUtil"
						@showPersonList="showPersonList"
						slot="user_selected_item">
					</user_selected_item>
				</user_selected_group>

				<!--负责人和相关人内容-->
				<!--<user-select :userselect="userSelect"></user-select>-->
			</div>

				<!--处理人范围选人-->
				<user_selected_ranglist
					v-if="FlowAuditUserBoxShow"
					:options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
					:selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
					:checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
					:config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
					:defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
					:checked="FlowAuditUserIds(appointUserIndex)"
					@FlowAuditUserResult="FlowAuditUserResult">
				</user_selected_ranglist>

		<child-view></child-view>

		<!--评论列表-->
		<comment_list
			:commentList="commentList"
			:totalRow="listTotalRows"
			:dealListIcon="dealListIcon"
			:dealListContent="dealListContent"
			:dealListDelete="dealListDelete"
			@sendAddress="openMap"
			@onlyComment="onlySeeComment"
			@atThisPersonUtil="atThisPersonUtil"
			@commentListImagesURL="commentListImagesURL"
			@delete="deleteThisComment">
		</comment_list>
		<!--加载更多-->
		<Load_more :loading="loading"
				   :type="'commentList'"
				   :hasMore="hasMore"
				   @loadMoreClick="loadMoreList">
			<span v-if="!listTotalRows">还没有任何评论</span>
		</Load_more>

		<div v-if="!hasMore" style="height: 15px"></div>
		<div style="height: 50px;"></div>

		<!--选人-->
		<user_selected_Box :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_selected_Box>

		<approve_btn
			v-if="detail"
			:nodeId="flow.nodeId"
			:agent="agent"
			@showChatTool="chetButtonClick"
			@showPersonList="showPersonList"
			@sendContent="updateContent"
			@saveChange="saveChange">
		</approve_btn>

		<!--选择节点-->
		<qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

		<!--评论输入框组件-->
		<chatInput :show.sync="showChatTool"
							 :dataBase="dataBase"
							 :agent="agent"
							 :showAt="showAt"
							 :showDingWei="isMobile"
							 @sendAddress="getAddress"
							 @updateContent="updateContent"
							 @dealccPerson="backUserSelect"
							 @closeChat="showChatTool=false">
		</chatInput>

		<!-- 流转明细 -->
		<flow_serial :flowSerialData="flowSerialData" :isover="flow.isover" v-if="flowSerial.isShowFlowSerial"></flow_serial>

		<!--预览图片组件-->
		<previewImages :urls="previewImageUrl"></previewImages>

		<!--负责人、相关人详细列表-->
		<user-show :userselect="userSelect"></user-show>

		<!--个人信息-->
		<user_info></user_info>

		<!--轨迹历史-->
		<showHistory v-if="showHistoryBox" @closeHistory="hideHistory" :history="history"></showHistory>

		<!--人员列表组件-->
		<user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>
		<!--显示评论的地理位置-->
		<tencent-map v-if="showMap"
								 :pos="commentAddress"
								 :type="mapType"
								 @positionData="setAddress"
								 @closeMap="showMap = false"
		>
		</tencent-map>
	</div>
</template>

<script>
	import wx from 'weixin-js-sdk'
	import Vue from 'vue'
	import applyStatus from '@/components/part/apply_status';
	import childView from '../childView'
	import formBase from '../formBase.vue'
	import html2canvas from 'html2canvas'                  //html转换为图片
	import {isVipSilver,isVipGold} from '@/assets/js/vip-portal.js' 	//判断VIP
	import {getDefaultData} from '../data/analysisData'  	//修改数据的函数
	import {equation} from '../data/equation'	//表单验证
	import {form_validation, filterData} from '../../js/validation'
	import prev_next from './prev_next.vue'
	import flowButton from '@/components/button/flow_button'
	import userSelect from '@/components/detail/user_select'
	import user_info from '@/components/detail/user_info_card';//个人信息
	import userShow from '@/components/base/user_show';
	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
	import flow_serial from '@/components/flow/flow_serial'; // 流转明细
	import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
	import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
	import user_selected_Box from '@/components/base/user_or_dept_select.vue' //js导入
	import approve_btn from '../../components/approve_button';
	import previewImages from "@/components/detail/previewImages";
	import EventBus from '@/utils/eventBus';
	import qw_select_node from '@/components/flow/selectNode';
	import comment_list from '@/components/list/comment_list';
	import Load_more from '@/components/list/load_more';
	import chatInput from '@/components/detail/chatInput';
	import {
		commentListMore,
		addCommentList,
		deleteCommentList,
		detailGetFroms,
		render_field,
		setReadonly,
		setFieldRead,
		setFieldShowHide,
		setFieldEdit,
		commitComment,
		loadScript,
		setEditAgain
	} from '../../js/getData'
	import {getHistory,updateFormByToUser} from '../../api/list'
	//轨迹组件
	import showHistory from './showHistory.vue'
//	地图组件
	import tencentMap from '@/components/add/tencentMap.vue'
	import audit_flow_api from '@/components/flow/api/getData';
	import addFileList from '@/components/add/upload/addFileList'
	import AddImgList from '@/components/add/upload/imgList';
	import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
	import user_show from '@/components/detail/user_show'
	export default {
		components: {
			formBase,
			flowButton,
			childView,
			applyStatus,
			userSelect,
			user_info,
			userShow,
			prev_next,
			showHistory,
			flow_serial,
			user_selected_item,
			user_selected_group,
			approve_btn,
			user_selected_Box,
			previewImages,
			qw_select_node,
			comment_list,
			Load_more,
			chatInput,
			addFileList,
			AddImgList,
			user_selected_ranglist,
			user_show,
			tencentMap
		},
		data() {
			return {
				agent:'form',
				id: this.$route.query.id,
				definition_id:null,
				dataBase: dataBase,
				formTitle: '',
				instanceTitleTemplate:'',
				content: '',
				detail:null,
				applystatus: {
					active: false,
					class: "status_blue",
					name: "i18n.inProgress",
					show: false
				},
				mediaList:[],
				//负责人和相关人
				userSelect: {
					toPersonList: {
						title: "负责人",
						show: false,
						num: 0,
						userSelected: [],
					},
					ccPersonList: {
						title: "相关人",
						show: false,
						num: 0,
						userSelected: [],
					}
				},
				loading:false,
				hasMore:false,
				lock_roll:false,
				currentPage:1,
				commentStatus:"1",
				listTotalRows:0,
				commentList:[],                                                        //评论列表
				deleteListIndex:"",                                                     //需要删除的index
				detailPicList:[],                                                       //详情头部图片列表
				previewImageUrl:[],                                                     //需要预览的图片列表
				showChatTool:false,                                                      //显示评论输入框
				//单的属性
				stopTime: '',
				lastTime: '',															//加载上一页评论的时间
				createLeave: '',
				createTime: '',
				personName: '',
				creatorColor: true,
				isCreator: false,
				detail_content:'',//表单详细内容
				showAllMsg:false,
				toggleMsg:'展开显示全部',
				showToggle:false, //是否展开收起全部的按钮
				//展示轨迹的数据
				showHistoryBox:false,
				orbitList:[],
				history:{
					title:'',
					eachOrbitList:[]
				},
				orbitItemKeyList:[],
				showAt:true,
				currentFormId:'',//设置表单打印的字段
				isHasPrintTemplate:0,
				isShowFoot:'block',
				flow: {
					isBranchFlow: false,
					nodeId: '', //当前节点id
					creatorId:"",
					status: '', //审批状态
					isover:"",
					isAlreadyAudit:""
				},
				startAuditList:null,//当前审批人
				flowSerial: {
					isFirstRequest: true,
					isShowFlowSerial: false,
					list: [],
					isFreeFlow: ''
				},
				showToPersons:true,//是否显示审批人，非自由流程的审批单并且未审批完成时不显示
				buttonConfig: { //操作按钮
					primaryList: [{type: "primary", name: '保存', callBack: null}],
					defaultList: [],
					style: {class: ""}//按钮是否置底部 active :底部、"":相对定位
				},
				showSave:false, //保存按钮显示
				imgUploadPicList:[],
				showPerson:false,                                                   //是否展开所有选中人员列表
				userselectTitle:'',
				userSelectList:[],
				limitPreview:false,                                                //限制弹个人信息弹窗
				isTask:'',   //单的类型  2：审批单
				limitPreview:false,                                                //限制弹个人信息弹窗
				commitData:{},                  // 提交数据
				//地图数据
				showMap:false,
				commentAddress:undefined,
				mapType:''
			}
		},
		created() {
			var EventBus = new Vue();
			this.$root.EventBus = EventBus;
			this.$store.commit('reset');
			var _this = this;
			this.initForm();
			this.$store.commit('resetFlowData')
			this.$store.commit('resetDetailData')
			this.buttonConfig.primaryList[0].callBack = function () {
				_this.saveChange();
			};
		},
		computed: {
			...mapState({
				FlowAudit: state => state.detail.FlowAudit,     // 详情信息
				FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
				approveVo: state => state.detail.approveVo,       // 自由流程获取转审人员
				FlowAuditUserBoxShow: state => state.userSelected.FlowAuditUserBoxShow,
				appointUserIndex:state => state.userSelected.appointUserIndex,
				isChoise: state => state.userSelected.isChoise,
				audtiFlag: state => state.userSelected.audtiFlag,
				detailData: state => state.detail.detailData,
				controlPO: state => state.detail.detailData.controlPO,
			}),
			...mapGetters([
				'FlowAuditUserIds'
			]),
			flowSerialData: function () {
				return this.flowSerial;
			},
			// 下一步处理人是否显示
			// 是当前处理人且不可选、不是当前处理人、nextAuditList.length>0
			nextAuditListShow() {
				// 人员控件
				if(this.FlowAudit && this.FlowAudit.flowNodeItemKeys){
					return true;
				}
				let flag1 = this.FlowAudit && this.FlowAudit.nextAuditList.length>0
				let flag2 =  this.FlowAudit && !(this.FlowAudit.isChoise!=1 || this.FlowAudit.audtiFlag==2)
					&& this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId) > -1     // 是当前处理人
				let flag3 =  this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId)==-1    // 或不是当前处理人
				return flag1 && (flag2 || flag3)
			},
			// 人员控件关联下一步处理人组件显示
			flowNodeItemKeysShow() {
				// 如果下一步处理人由人员控件决定时
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					let flag1 = this.FlowAuditUser[0].startAuditList.allUser.length === 0
					let flag2 = this.FlowAudit && this.FlowAudit.vo && this.FlowAudit.vo.handleAccounts.indexOf(_.userId)==-1    // 或不是当前处理人
					if(flag1 && !flag2){
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
			// 下一步处理人是否能编辑
			isEditShow(){
				// 如果下一步处理人由人员控件决定时
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					return this.FlowAuditUser[0].startAuditList.isCanEdit;
				}else{
					return false;
				}
			},
			// 下一步处理人列表显示判断
			isListShow(){
				// 如果下一步处理人由人员控件决定时
				if(this.FlowAuditUser && this.FlowAuditUser[0].startAuditList.flowNodeItemKeys){
					return this.FlowAuditUser[0].startAuditList.userSelected
				}else{
					return this.FlowAudit.nextAuditList
				}
			},
			isCanUpdate(){
				return this.flow.isover === '2' && this.approveVo && this.approveVo.vo && this.approveVo.vo.userId.indexOf(_.userId) > -1 && this.controlPO.isCanUpdate == 0;
			},
			isShowSerial(){
				//审批单非自由流程或外部单显示流转明细入口 或者 是外部单且已经转为内部单时显示流转明细入口
				return (this.isTask == '2' && this.flowSerial.isFreeFlow != "1") || (this.isTask == '3' && this.detailData.openIsSubmit)
			},
			//判断是手机
			isMobile(){
				return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
			},
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
			]),
			...mapActions([
				"getApprove",   // 自由流程获取转审人员
				"getNodeListInfo", //获取节点选择信息
				"updateFlowUserSelected",     // 更新已选处理人
			]),
			//并行流程选择节点后进行处理
			selectNodeClick (item,data){
				this.flow.nodeId = item.nodeId
				this.showDetailPage(data)
			},
			// 处理人标题
			startAuditTitle(item) {
				if(this.startAuditList.length>1) {
					return item.vo.nodeName+' 处理人'
				}else {
					return '当前处理人'
				}
			},
			atThisPersonUtil(user){
				// 查看个人头像信息
				if(user){
					EventBus.$emit("atThisPersonUtil",user);
				}
			},
			showPersonList(title,list,type){
				this.userselectTitle = title;
				this.userSelectList = list;
				this.showPerson = true;
				if(type){
					this.limitPreview = true
				}else{
					this.limitPreview = false
				}
			},
			// 查询人员控件字段
			isItemKeys(keys){
				var str = '';
				if(keys){
					this.$store.state.formBase.schema.forEach((item) => {
						if(keys.indexOf(item._id) >= 0){
							str += item.label + '，';
						}
					})
				}
				return str.substring(0,str.length-1);
			},
			// 选择处理人弹窗
			FlowAuditUserShowBox(index) {
				this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})
				// 如果是指定范围选人
				if(this.FlowAuditUser[index].startAuditList.assignRange) {
					this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
				}else {
					let self = this
					let toPersonList = this.dataBase.selectConfig.selectList.toPersonList
					this.dataBase.selectConfig.signIndex="toPersonList"
					this.dataBase.selectConfig.show=true
					toPersonList.userSelected.length=0
					if(this.FlowAuditUser[index].startAuditList.userSelected.length) {
						toPersonList.userSelected.push(...this.FlowAuditUser[index].startAuditList.userSelected)
					}
					toPersonList.callBack.confirm=function (type, obj) {
						toPersonList.userSelected.length=0
						toPersonList.userSelected.push(...obj.user.data);
						self.$store.commit('resetFlowAuditUser')
						self.$store.commit('updateUserSelected',obj.user.data)
					}
				}
			},
			// 选择处理人后
			FlowAuditUserResult(payload) {
				let self = this
				this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: false})
				// 如果是多部门，则请求部门负责人
				this.updateFlowUserSelected(payload)
				let result = payload.result
				this.FlowAuditUser.forEach(function(value){
					if(value.audtiFlag == "2"){
						if (value.isChoise == "1") {
							self.commitData.flowDpId = payload.ids;
						} else {
							self.commitData.flowDpId = result.length ? payload.result[0].deptId:'';
						}
					}
				})
			},
			chetButtonClick(){
				this.showChatTool=true;
			},
			scrollList(){                                                // 滚动更多列表
				var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
				if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
					if(!this.lock_roll && this.hasMore){
						this.lock_roll=true;
						this.currentPage++;
						this.loadMoreList(status);
					}
				}
			},
			onlySeeComment(type){
				this.currentPage=1;
				this.commentList.length=0;
				this.commentStatus=type? "2":"1";
				if(!this.loading){
					this.loadMoreList();
				}
			},
			dealCommentList(data){
				this.loading=false;
				this.showCommentList(data.comments,data.hasMore);
			},
			showCommentList(data,hasMore){                                    // 处理返回的评论
				this.hasMore=hasMore;
				this.lock_roll=false;
				if(data && data.length>0){
					this.commentList.push(...data);
					this.listTotalRows=Number(this.commentList.length);
				}else{
					this.commentList.length=0;
					this.listTotalRows=0;
				}
			},
			commentListImagesURL(urls){
				console.log(urls)// 处理详情的全部图片src
				this.previewImageUrl=[];
//				this.previewImageUrl.push(...this.detailPicList);
				this.previewImageUrl.push(...urls);
			},
			loadMoreList(){                                               // 加载更多列表
				var data={
					id:this.id,
					size: 10,
					status: this.commentStatus
				};
			/*	if(this.commentStatus == 2){
					data.lastTime = this.lastTime
				}*/
				this.loading = true;
				data.page = this.currentPage;
				commentListMore(data,this.dealCommentList);
			},
			updateContent(data){                                              // 发送评论
				console.log(data)
				if(data){
					let msg={
						"content":data.content,
						"refId":this.id,
						"type":data.type,
						"status":data.status,
						"userId":_.userId
					};
					data.userIds? msg.userIds=data.userIds:"";

					var self=this;
					addCommentList(msg,function (result) {
						console.log(result)
						if(result.commentId){
							self.commentList.splice(0,0,{
								commentId:result.commentId,
								headPic:_.headPic,
								personName:_.personName,
								creator:_.userId,
								type:data.type,
								content:data.content,
								time:"刚刚",
								status:data.status,
							});
							self.listTotalRows++;
						}
					});
					if(data.status=="6"){
						window.location.reload();
					}
				}
			},
			deleteThisComment(data,index){                                 // 删除评论
				if(data){
					this.deleteListIndex=index;
					var self=this;
					deleteCommentList({commentId:data.commentId},function (result) {  // 删除成功
						self.commentList.splice(self.deleteListIndex,1);
						self.listTotalRows--;
					});
				}
			},
			getFlowAuditDetail: function (result) { //当前节点的详细信息
				var detail = result.data.detail;
				var dataParam = {
					refId: this.id,
					definitionId: detail.definitionId,
					isBranch: this.flow.isBranchFlow,
					nodeId: this.flow.nodeId,
					status: this.flow.isover
				};
				//固定流程和分支流程审批状态的数据显示
				let statusString = audit_flow_api.statusFormCheck(this.flow.creatorId, this.flow.status, this.flow.isover,this.flow.isClose);
				if(statusString){
					let status = _.append_status(statusString,true);
					this.applystatus = status;
					this.applystatus.show = true;
				}
				var _this = this;
				//固定流程和分支流程查询下一节的审批人和节点的信息
				audit_flow_api.getFlowAuditDetail(dataParam, (result) => {
					let data=result.data[0];
					this.startAuditList = [...result.data]
					let fieldContralList = data.fieldContralList;
					_this.fieldContralList(fieldContralList);
					if(setEditAgain(_this.$store)){
						_this.showSave = true;
					}
					//判断下一节点是否是人员控件选择的处理人
					var flowNodeItemKeys = data.flowNodeItemKeys
					if(flowNodeItemKeys){
						_this.$store.commit('updateFlowNodeItemKeys', flowNodeItemKeys);
						setTimeout(() => {
							var person = _this.$store.state.detail.FlowAudit.nextAuditList;
							var users = [];
							person.forEach(item =>{
								users.push({
									userId:item.userId,
									personName:item.personName,
									headPic:item.headPic,
								})
							});
								_this.$store.commit('updateItemKeysSelected',users);
						}, 0);
					}
					this.$store.commit('updateFlowAuditUser',result.nodeInfo)
					if(result.data.length===1){
						this.$store.commit('updateFlowAudit',data)
						this.$store.commit("updateAppointNodeVOList", data.appointNodeAndUserVOList)
						this.$store.commit('updateFlowChioseNodeAuditUser')
					}
				})
			},
			fieldContralList(data){
				var map = {};
				var editMap = {};
				data.forEach((item)=>{
					map[item.fieldId] = item.isRead?true:false;
					editMap[item.fieldId] = item.isUpdate?true:false;
				});
				setFieldShowHide(this.$store,map);
				setFieldEdit(this.$store,editMap);
			},
			//分享的代码
			share(shareVO){
				wx.onMenuShareTimeline({
						title: shareVO.shareTitle, // 分享标题
						link: shareVO.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
						imgUrl: shareVO.shareImg, // 分享图标
						success: function () {
							// 用户点击了分享后执行的回调函数
						}
				});
					wx.onMenuShareAppMessage({
					title: shareVO.shareTitle, // 分享标题
					desc: shareVO.shareContent, // 分享描述
					link: shareVO.shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: shareVO.shareImg, // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function () {
// 用户点击了分享后执行的回调函数
					}
				});
				wx.onMenuShareQQ({
					title: shareVO.shareTitle, // 分享标题
					desc: shareVO.shareContent, // 分享描述
					link: shareVO.shareUrl, // 分享链接
					imgUrl: shareVO.shareImg, // 分享图标
					success: function () {
// 用户确认分享后执行的回调函数
					},
					cancel: function () {
// 用户取消分享后执行的回调函数
					}
				});
			},
			fieldChange(val) {
				var formData = this.$store.state.formBase.data;
//			saveFormData(JSON.stringify(formData));
				var fieldArry = this.$store.state.formBase.fieldArry;
				var templateObj = this.$store.state.formBase.templateObj;
				var typeMap = this.$store.state.formBase.typeMap;
				var choiceMap = this.$store.state.formBase.choiceMap;
				if (fieldArry.indexOf(val.key) != -1) {
					templateObj['{' + val.key + '}'] = val.value;
					//下拉框
					if (typeMap[val.key] == 'DropDown') {
						templateObj['{' + val.key + '}'] = choiceMap[val.value] || '';
					}
					var ctitle = this.instanceTitleTemplate;
					for (var k in templateObj) {
						ctitle = ctitle.replace(new RegExp(k, "g"), templateObj[k]);
					}
					var ctitle = ctitle.replace(new RegExp('&nbsp;', 'g'), '').substring(0, 100);
					this.formTitle = ctitle;
				}
			},
			initForm() {
				var _this = this;
				var id = this.id;
				var id = this.id = this.$route.query.id;
				_.showLoading()
				detailGetFroms(id).then(function (result) {
					_.hideLoading()
					if (result.code == "0") {
						_this.instanceTitleTemplate=result.data.instanceTitleTemplate;
						_this.showToPersons=true
						_this.startAuditList=null;
						_this.$store.commit('resetFlowData')
						_this.$store.commit('resetDetailData')
						//判断是否是并行，是就查询并行接口获取节点列表
						if (result.data.detail && result.data.detail.currentNodeId.indexOf(',')!=-1){
							_this.$store.commit('updateListName',result.data)
							_this.getNodeListInfo({'refId':this.id,'callback': function (result){
									if (result.length>0){
										_this.flow.nodeId = result[0].nodeId
									} else {
										_this.flow.nodeId = data.detail?  data.detail.currentNodeId : ''
									}
								//				//判断是否有省市区的数据
									var url = result.data.distpicker_data
									loadScript(url).then(res => {
										_this.showDetailPage(result)
									});
								}})
						} else {
							//非并行流程
							_this.flow.nodeId = result.data.detail?  result.data.detail.currentNodeId : ''
							var url = result.data.distpicker_data
							loadScript(url).then(res => {
								_this.showDetailPage(result)
							});
						}
						console.log(result)

					} else {
							let btnConfig={
								primaryBtn:{name:"i18n.confirm", callBack:function () {
									_this.$router.go(-1)
								}},
								defaultBtn:{name:"", callBack:null},
							};
							_.alert("i18n.notice", result.desc,btnConfig);
					}
				});

			},
			showDetailPage(result){
				//表单的初始化
				let _this=this
				var id = this.id;
				this.definition_id = result.data.id;
				var data = result.data.fields;
				var itemMap = result.data.itemMap;
				var store = _this.$store;
				var controlPO = result.data.controlPO;
				this.isTask = controlPO.isTask;
				this.showAt = result.data.controlPO.isCanAt == "1" ? true : false;
//				_this.detailPicList.push(...result.data.mediaList)
				_this.mediaList = result.data.mediaList;
				if(result.data.picList && result.data.picList.length>0){
					var list = [];
					result.data.picList.forEach((item,index)=>{
						list.push({src:item.picPath});
					})
					_this.imgUploadPicList = list;
				}
				_this.lastTime=result.data.lastTime;
				//表单状态的数据
				_this.flow.status = result.data.detail.status;
				_this.flow.creatorId=result.data.detail.creator;
				_this.flow.isover=result.data.detail.isover;
				_this.flow.isClose = result.data.detail.isClose;
				_this.flow.isBranchFlow = controlPO.isFreeFlow == 3 ? true : false;
				_this.flowSerial.isFreeFlow = controlPO.isFreeFlow;
				_this.flow.status=result.data.detail.status;
				store.commit('setFormDetail', controlPO);
				var detailData = {
					detail: result.data.detail,
					detailsPO: result.data.detailsPO,
					controlPO: result.data.controlPO,
					createLeave: result.data.createLeave,
					isRecipient: result.data.isRecipient,
					approve: result.data.approve,
					openIsSubmit: result.data.openIsSubmit
				};
				store.commit('updateDetailData', detailData);
				//表单是审批单或者是外部单的时候执行
				// isTask：2审批单 / 3外部单
				if(controlPO.isTask == '2' || controlPO.isTask == '3'){
					//固定流程和分支流程的代码执行
					if (controlPO.isFreeFlow!= "1") {      // 非自由流程
						_this.getFlowAuditDetail(result);
						if (result.data.openIsSubmit == false) {
							_this.showSave = true;
							this.buttonConfig.primaryList[0].name = "转内部流程处理";
							this.buttonConfig.primaryList[0].callBack = function(){
								_this.$router.push({name: 'add', query: {id: _this.$route.query.id,type:'edit'}})
							}
						}
					}else {
						//自由流程的处理
						_this.getApprove(id);   // 自由流程获取转审人员
						let statusString = audit_flow_api.statusFormCheck(_this.flow.creatorId, _this.flow.status, _this.flow.isover,_this.flow.isClose);
						if(statusString){
							let status = _.append_status(statusString,true);
							this.applystatus = status;
							this.applystatus.show = true;
						}
					}
				}else if(controlPO.isTask == "1"){
					//修改状态数据
					if (_this.flow.isover == '-1') {//任务已经结束
						_this.applystatus.show = true;
						_this.applystatus.class = 'status_gray';
						_this.applystatus.name = '已关闭';
					}
				}
				//分享的代码
				var shareVO =result.data.shareVO;
				_this.share(shareVO);
				//打印的代码
				_this.currentFormId=result.data.detailsPO.definitionVersionsId;
				_this.isHasPrintTemplate = result.data.controlPO.isHasPrintTemplate;

				//评论列表处理
				this.hasMore = result.data.hasMore;
				this.showCommentList(result.data.comments, result.data.hasMore);
				_this.detail_content = _this.formatContent(result.data.detailsPO.content);  //对content数=数据中的url转换

				_this.orbitItemKeyList = result.data.orbitItemKeyList ||[];
				render_field(store, data, itemMap,_this.orbitItemKeyList);
				setReadonly(store);
				setFieldShowHide(store);
				setFieldRead(store);

				//单的属性
				var detail = _this.detail = result.data.detail;
				var ct = detail.createaTime;
				if (ct.substring(0, 10) == new Date().Format("yyyy-MM-dd")) {
					//当天发布的任务只显示时分
					_this.createTime = ct.substring(11, 16);
				} else {
					_this.createTime = ct;
				}
				_this.personName = detail.personName;
				var creator = detail.creator;
				if (creator == dataBase.config.userId) {
					_this.isCreator = true;
					_this.creatorColor = false;
				}
				_this.createLeave = result.data.createLeave;//提单人离职
				_this.formTitle = result.data.instanceTitle;
				var isover = result.data.detail.isover;//表单状态
				var isClose = result.data.detail.isClose;//1结束状态
				if (controlPO.stopTime != null && controlPO.stopTime != "") {
					this.stopTime = controlPO.stopTime;
				}
				//看单权限：1.提单人查看单2.负责人查看单3.相关人查看单
				//result.data.isRecipient false为相关人查看单
				var isRecipient = result.data.isRecipient;
				var openIsSubmit = result.data.openIsSubmit;
				var isCanUpdate = controlPO.isCanUpdate;//0允许重新编辑，1为不能重新编辑（普通单和任务单）
				if (controlPO.isTask == "3") {//外部单

				}
				//相关人和负责人
				//显示负责人
				var toPersons = result.data.inchargesList || [];
				//加载相关人
				var ccPersons = result.data.receiveList || [];
				_this.userSelect.toPersonList.userSelected.length=0;
				_this.userSelect.ccPersonList.userSelected.length=0;
				if (toPersons.length > 0) {
					_this.userSelect.toPersonList.num = toPersons.length;
					_this.userSelect.toPersonList.userSelected = [...toPersons];
					if(controlPO.isTask == '2' || controlPO.isTask == '3'){
						_this.userSelect.toPersonList.title = '审批人';
						//审批中并且非自由流程不显示所有审批人
						if (isover == "2" && controlPO.isFreeFlow != "1") {
							_this.showToPersons = false;
						}
					}
				}
				if (ccPersons.length > 0) {
					_this.userSelect.ccPersonList.num = ccPersons.length;
					_this.userSelect.ccPersonList.userSelected = [...ccPersons];
				}
				_this.$nextTick(()=>{
					_this.imgsClickFunc();
				})
			},
			getFlowSerial: function () { //获取流程流转明细
				let dataParam = {
					refId: this.id,
					isBranch: this.flow.isBranchFlow,
				}
				audit_flow_api.getParallelFlowSerial(dataParam, this.flowSerial, (result) => {
					this.flowSerial = result
				})
			},
			validations() {
				var schema = this.$store.state.formBase.schema
				return form_validation(schema);
			},
			getFormData() {
				return this.validations();
			},
			backUserSelect(obj) {
				//@人后把人添加为相关人,当@的人是审批人或者已经是相关人，不加到相关人
				let toPersonsIds = this.userSelect.toPersonList.userSelected.map(value=>{
					return value.userId;
				})
				toPersonsIds = toPersonsIds.join('|');
				let ccPersonsIds = this.userSelect.ccPersonList.userSelected.map(value=>{
					return value.userId;
				})
				ccPersonsIds = ccPersonsIds.join('|');
				obj.data.forEach(value=>{
					if(toPersonsIds.indexOf(value.userId)>-1 || ccPersonsIds.indexOf(value.userId)>-1){return}
					this.userSelect.ccPersonList.userSelected.splice(0,0,value);
				})
			},
			printDetail() {
				if(isVipSilver(interfaceCode.INTERFACE_CODE_FORM)){
					if (!isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
			     	this.isShowFoot = "none";
			       	var self=this;
			    	setTimeout(function () {
			    		self.myprint();
			    	},10)
					}else{
						var foreignid = this.id;
						var currentFormId = this.currentFormId;
						var isHasPrintTemplate = this.isHasPrintTemplate;
						window.location.href = _.baseURL + '/jsp/wap/form/customPrint_preview.jsp?id='+foreignid+'&printType=1&definitionVersionsId='+ currentFormId +'&hasPrintTemplate='+isHasPrintTemplate;
					}
				}else{
					_.alert("提示","打印功能仅限VIP用户使用","确定",function(){
						restoreSubmit();
					});
				 }
//				打印生成图片页面
			},
			myprint() {
				let print = document.querySelector(".wrap");
				html2canvas(print).then(canvas => {
					_.showLoading("打印中");
					this.convertCanvasToImage(canvas);
				});
				 let c_img = true;
				//将表单中的图片能够进行跨域处理
				 if(c_img){
					 let img = document.querySelectorAll(".wrap img");
					 for(var i = 0;i<img.length;i++){
						 let src = img[i].getAttribute("src");
						 if(src.indexOf(_.baseURL+"/jsp/wap/images/emoji")==-1){
							 src = encodeURIComponent(src);
							 let newsrc = _.baseURL+"/portal/errcode/errcodeAction!loadImage.action?imgUrl=" + src;
							 img[i].setAttribute('src',newsrc);
						 }
					 }
					 c_img = false;
				 }
				//画布转化成图片
			},
			convertCanvasToImage(canvas) {
		        var image = new Image();
	        	image.src = canvas.toDataURL("image/png");
		         if(image.src){
		        	localStorage.setItem("imageSrc",image.src);
		         	window.location.href=_.baseURL+"/jsp/wap/include/printDetail.jsp";
				 }
	         },
			showPersonDetail:function (){
				//判断提单人是否离职
				if(this.$store.state.detail.detailData.createLeave==true){
					_.alert('提示','此提单人已离职');
					return;
				}
				//判断是否是匿名提交
				if(this.$store.state.detail.detailData.controlPO.isAnonymous == 1)return;
				var data = {
					userId: this.detail.creator,
					personName:this.detail.personName,
					headPic:this.detail.headPic,
				};
				if(data.userId!=_.userId){
					this.atThisPersonUtil(data);
				}
			},
			goCopyForm() {
				this.$router.push({name: 'add', query: {id: this.$route.query.id,type:'copy'}})
			},
			goEditForm() {
				var schema = this.$store.state.formBase.schema;
				schema.map(item => {
						item.disabled = false;
				});
				this.showSave = true;
			},
			toggleMsgfn() {
				this.showAllMsg = !this.showAllMsg;
				this.toggleMsg = this.showAllMsg ? '收起': '展开显示全部' ;
			},
			//获取修改轨迹的数据
			paramHistoryData(id,title){
				if(this.orbitList ==false) {
					var _this = this;
					var query = {
						id:this.$route.query.id,
						fieldItemKeys:this.orbitItemKeyList.join(',')+',',
					}
					_.showLoading();
					getHistory(query).then((res)=>{
						_.hideLoading();
						if(res.code != '0'){
							return _.alert("提示",res.desc);
						}
						_this.orbitList = res.data.orbitList;
						_this.setHistory(id,title)
					})
				}else{
					this.setHistory(id,title)
				}
			},
			//隐藏轨迹
			hideHistory(){
				this.showHistoryBox = false;
			},
			setHistory(id,title){
				this.showHistoryBox = true;
				this.history.eachOrbitList = [];
				this.orbitList.forEach(item =>{
					if(id == item.itemKey){
						this.history.title = title;
						this.history.eachOrbitList.push(item);
					}
				})
			},
			//翻页重新加载页面数据
			refreshFrom(){
				this.commentList = [];
				this.currentPage = 1;
				this.detail = null;
				this.$store.commit('reset');
				this.initForm();
			},
			//修改富文本中的图片地址
			formatContent(str){
				return str.replace(/@fileweb@\/compress/g,_.compressURL);
			},
			imgsClickFunc(){
				if(!this.$refs.content) return;
				var imgs = this.$refs.content.getElementsByTagName('img');
				var contentPic = [];
				for(let i=0;i<imgs.length; i++){
					imgs[i].classList.add("previewImages")
					contentPic.push({picPath:imgs[i].src,});
				}
				this.previewImageUrl.unshift(...contentPic);
				this.commentListImagesURL(this.previewImageUrl);
				for(let i=0;i<imgs.length; i++){
					imgs[i].addEventListener('click',(event)=>{
						EventBus.$emit("previewImages",event.target.currentSrc);
					})
				}
			},
			//保存审批人修改
			saveChange(){
				if(!this.showSave) return ;
				var _this = this;
				if (!this.getFormData()) return ;
				var itemMap = filterData(this.$store);
				var queryData ={
					id: this.id,
					definition_id: this.definition_id,
					formEditType:1,
					formTitle: this.formTitle,
					instanceTitleTemplate:this.instanceTitleTemplate,
					instanceTitle: this.formTitle,
					itemMap: itemMap,
				};
				updateFormByToUser(queryData).then(res => {
					if(res.code == '0'){
						_this.showSave = false;
						setReadonly(_this.$store);
					}else{
						return _.alert('提示', res.desc);
					}
				})

			},
			dealListIcon(status){
				let icon = {
					'2': "qwui-meeting_icon icon_icon7"
				}
				return icon[status]? icon[status] : ''
			},
			dealListContent(status){
				return status!="2" ? true:false;
			},
			dealListDelete(item) {
				const status=item.status||item.commentStatus;
				const time=item.time;
				if(item.creator == _.userId &&
					(time=="刚刚"|| (time.indexOf("分钟前")!=-1 && parseInt(time.split("分钟前")[0])<30))){
					return  status=="1"||status=="9";
				}else{
					return false;
				}
			},
			//点击评论获取数据
			getAddress(){
				this.mapType = 'getAddress';
				this.showMap = true;
				_.showLoading('正在获取定位...')
			},
			setAddress(data){
				_.hideLoading()
				var address = data.value+"<input class='lat' style='display:none' value="+data.latitude+"><input class='lag' style='display:none' value="+data.longitude+">"
				var comment = {
					content:address,
					status:9,
					type:4  //4 地理位置
				}
				this.updateContent(comment);
				this.showChatTool=false
			},
			openMap(data){
				this.commentAddress = data;
				this.mapType = 'showPosition';
				this.showMap = true;

			}
		},
	}

</script>
<style scoped>
	.uploadFile{
		padding:5px 15px;
		background-color: #fff;
	}
	.circulationDetails{
		min-height: 50px;
		background-color: #fff;
		margin: 10px 0;
	}
  .form-title-span{
    margin-right: 10px;
  }
  .mt10{
    margin-top: 10px;
  }
</style>
