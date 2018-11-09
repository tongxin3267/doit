<template>
	<div class="wrap" ref="wrap">
		<div class="form-bg">
			<div class="form_title_box">
				<!--标题信息-->
				<div class="form-title-read">{{formTitle}}</div>

				<div class="mt10">
					<span  class="form-creat-time">创建时间:</span>
					<span  class="form-creat-time">{{createTime}}</span>
				</div>
			</div>
			<div class="form-detail-box" v-if="detail_content">
				<div  class="form-detail-content"  v-html="detail_content"  :class="{'form-detail-content-height':showToggle&&!showAllMsg}"></div>
				<!--模糊效果-->
				<div class="form-detail-content-blur" v-if="showToggle&&!showAllMsg"></div>
				<div  v-if="showToggle" @click="toggleMsgfn" class="form-detail-content-toggle">{{toggleMsg}} <span :class="{'toggle-up': showAllMsg,'toggle-down':!showAllMsg}"></span></div>
			</div>
		</div>

		<formBase @change="fieldChange" v-on:historyTitle="paramHistoryData"/>
		<!--上一页下一页-->
		<!--负责人和相关人内容-->
		<list-comment v-if="showComment" :listcomment="listComment"></list-comment>
		<child-view></child-view>
		<!--预览图片组件-->
		<previewImages :urls="previewImageUrl"></previewImages>
		<!--个人信息-->
		<user_info></user_info>
		<!--轨迹历史-->
		<showHistory v-if="showHistoryBox" v-on:closeHistory="hideHistory" :history="history"></showHistory>
		<!--外部单底部logo-->
		<div class="openFooterContent">
			<a href="http://wbg.do1.com.cn/" target="_blank">
				<img src="../../../../assets/images/newsmallLogo.png" alt="">
				微信办公，用企微云平台
			</a>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import childView from '../childView'
	import formBase from '../formBase.vue'
	//html转换为图片
	import html2canvas from 'html2canvas'
	//修改数据的函数
	import {getDefaultData} from '../data/analysisData'
	import {equation} from '../data/equation'
	//表单验证
	import flow_button from '@/components/button/flow_button'
	import listComment from '@/components/detail/list_comment'
	import chatComment from '@/components/detail/chat_comment'
	import user_info from '@/components/detail/user_info_card';//个人信息
	import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';

	import previewImages from "@/components/detail/previewImages";
	import EventBus from '@/utils/eventBus';

	import {
		openDetailGetFroms,
		render_field,
		setReadonly,
		setFieldRead,
		setFieldShowHide,
		loadScript
	} from '../../js/getData'
	import {getHistory} from '../../api/list'
	//轨迹组件
	import showHistory from './showHistory.vue'
	import audit_flow_api from '@/components/flow/api/getData';

	export default {
		components: {
			formBase,
			flow_button,
			childView,
			chatComment,
			listComment,
			user_info,
			showHistory,
			previewImages,
		},
		data() {
			return {
				agent:'form',
				id: this.$route.query.id,
				dataBase: dataBase,
				formTitle: '',
				content: '',
				detail:null,
				listComment: { //评论
					get: {  //获取
						url: "/portal/portalFormAction!listComment.action",
						pageIndex: 1,//当前页面
						pageIndexName: 'page',
						data: {
							id: "",
							size: 10,
							commentStatus: "1",//1只看评论，2显示全部
							page: 1,
						},
						hasMore: false
					},
					send: { //发送
						url: "/portal/portalFormAction!commitComment.action",
						contentObject: 'commentPO.content',//传送的内容字符串
						data: {
							userIds: '',
							id: '',
							readStatus: '',
							status: '',
							type: 1,
							flowDpId: '',
							signImg: '',
							size: 10,
						}
					},
					delete: { //删除
						url: "/portal/portalFormAction!deleteComment.action",
						commentId: "id",//需要传的id字段
						data: {}
					},
					comments: [] //评论数据列表
				},
				//单的数据
				itemMap: '',
				//单的属性
				stopTime: '',
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
				firstClick:true,//第一次点击轨迹展示
				showHistoryBox:false,
				orbitList:[],
				history:{
					title:'',
					eachOrbitList:[]
				},
				orbitItemKeyList:[],
				firstClick:true,
				isCanAt:0,
				isHasPrintTemplate:0,
				isShowFoot:'block',
				previewImageUrl:[],                                                   //需要预览的图片列表
				showComment:false,
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
		},
		computed: {
			...mapState({
				FlowAudit: state => state.detail.FlowAudit,     // 详情信息
				FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
			}),
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
			...mapActions([
				"getApprove",   // 自由流程获取转审人员
				"getNodeListInfo" //获取节点选择信息
			]),
			// 处理人标题
			startAuditTitle(item) {
				if(this.startAuditList.length>1) {
					return item.vo.nodeName+' 处理人'
				}else {
					return '当前处理人'
				}
			},
			atThisPersonUtil(user){                                            // 查看个人头像信息
				if(user){
					EventBus.$emit("atThisPersonUtil",user);
				}
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
				openDetailGetFroms(id).then(function (result) {
					_.hideLoading()
					if (result.code == "0") {
						//判断是否是并行，是就查询并行接口获取节点列表
						if (result.data.detail){
							_this.$store.commit('updateListName',result.data)
							//				//判断是否有省市区的数据
							var url = result.data.distpicker_data
							loadScript(url).then(res => {
							  _this.showDetailPage(result)
							});
						}
						console.log(result)
					} else {
						_.alert('提示', result.desc);
					}
				});

			},
			showDetailPage(result){
				//表单的初始化
				let _this=this
				var id = this.id;
				var data = result.data.fields;
				var itemMap = result.data.itemMap;
				var store = _this.$store;
				var controlPO = result.data.controlPO;
				store.commit('setFormDetail', controlPO);
				store.commit('updateDetailData', result.data)
				//评论的显示代码
				_this.listComment.comments = result.data.comments?result.data.comments:[];
				_this.listComment.send.data.id = id;
				_this.listComment.get.data.id = id;
				_this.detail_content = result.data.detailsPO.content;
				if (result.data.commentCount > 10) {
					_this.listComment.get.hasMore = true;
				}
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
				_this.showComment = controlPO.isSearchComment === '1'? true:false;
				_this.formFieldControlList(result.data.formFieldControlList);
			},
			toggleMsgfn() {
				this.showAllMsg = !this.showAllMsg;
				this.toggleMsg = this.showAllMsg ? '收起': '展开显示全部' ;
			},
			formFieldControlList(data){
				if(!data) return;
				var map = {}
				data.forEach((item)=>{
					map[item.itemKey] = item.isRead?true:false;
				});
				setFieldShowHide(this.$store,map)
			},

	//获取修改轨迹的数据
			paramHistoryData(id,title){
				if(this.firstClick) {
					this.firstClick = false;
					var _this = this;
					var query = {
						id:this.$route.query.id,
						fieldItemKeys:this.orbitItemKeyList.join(',')+',',
					}
					_.showLoading();
					getHistory(query).then((res)=>{
						_.hideLoading();
						if(res.code != '0'){
							this.firstClick = true;
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
			}
		},
	}

</script>

<style scoped>
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
    .form-creat-time{
      margin-right: 10px;
    }
    .mt10{
      margin-top: 10px;
    }
</style>
