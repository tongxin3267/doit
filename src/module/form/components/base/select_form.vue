<template>
	<div class="qwui-crm_select">
		<div class="select-crm-content">

			<div :style="{height:contentHeight+'px'}" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false" class="clientList">
				<search_bar :searchinput="searchBar" v-on:listenToSearchBox="showMsgFromSearchBar" :fixed="true" ></search_bar>
				<div >
					<!--选中的列表-->
					<!--<div class="selected_user" v-show="formselected.selectedList.length>0">-->
					<!--<span class="item-selected" v-for="item in formselected.selectedList">-->
					<!--{{item[refCfg.main_field]}}-->
					<!--</span>-->
					<!--</div>-->
					<div v-for="item in list" class="qwui-user_item" :key="item.id">
						<div class="qwui-user_item_inner" @click="selectThis(item)">
							<div class="qwui-user_select_icon" :class="{active:formselected.idStr.indexOf(item.id)!=-1}"><i></i></div>
							<!--遍历显示的数据-->
							<div class="title description_title flexItem">
                                <div class="qwui-head-picbox" v-if="typeMap[refCfg.main_field] == 'ImageField'" >
								    <img  class="qwui-head-pic" v-for="pic in formatData(item,refCfg.main_field)" :key="pic.index" :src="pic" alt="" />
                                </div>
								<div v-else class="client-code">{{formatData(item,refCfg.main_field)}}</div>
								<div  v-for="items in refCfg.show_fields" :key="items.id">
                                    <div class="qwui-head-picbox" v-if="typeMap[items] == 'ImageField'">
                                        <img  v-for="pic in formatData(item,items)" :key="pic.index" class="qwui-head-pic" :src="pic" alt="" />
                                    </div>
									<div v-else v-show="true" class="client-code-sub">
										<span>{{fieldMap[items]}}</span>：<span>{{formatData(item,items)}}</span>
									</div>
									</div>
							</div>
						</div>
					</div>
				</div>
				<load-more :busy="busy" :loading="loading" :showrecord="showrecord" @childevent="loadMore"></load-more>
			</div>

			<!--底部按钮-->
			<div class="qwui-userOrDept_select_footer">
				<div class="qwui-userOrDept_select_footerBar">
					<div class="qwui-userOrDept_footer_flex"><a class="qwui-btn qwui-btn_default" @click="concel">取消</a></div>
					<div class="selected">
					</div>
					<div class="qwui-userOrDept_footer_flex"><a class="qwui-btn fr" @click="comfirm">确定</a></div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>

	import search_bar from '@/components/base/search_box.vue';
	import loadMore from '../base/load_more.vue'
	import { selectFormdata } from '../../api/list'


	export default {
		components:{
			search_bar,
			loadMore
		},
		data(){
			return {
				dataBase:dataBase,
				selectForm:dataBase.selectForm,
				url:_.baseURL+'/portal/portalForm/formRefSearch.do',
				list:[],
				refCfg:{
					main_field:'',
					show_fields:[],
				},
				formselected:{
					selectedList:[],
					idStr:'',
				},
				fieldMap:{},

				searchBar:{ //头部搜索框
					show:true,
					keyWord:'',
					rightSpan:{
						show:false,
						callback:null
					},
					moreFunction:{
						show:true,
						option:[
							{name:'全部',value:''}
						]
					}
				},
				data:null,
				contentHeight:'',
				page:1,
				maxPage:'',
				busy:false,
				currPage:1,
				maxPage:0,
				loading:false,
				pageSize:10,
				keyWord:'',
				itemKey:'',
				typeMap:{},
			}
		},
		computed:{
			showrecord(){
				this.list = this.list ||[];
				return this.list.length==0?true:false;
			},
			combineList() {
				return this.$store.state.formBase.schema
			},
		},
		created(){
			if(document.documentElement.clientHeight>0){
				this.contentHeight=document.documentElement.clientHeight;
			}else{
				this.contentHeight="auto";
			}
			this.selectStart(this.selectForm.selectList);
			//初始化映射关系
			var fieldMap = this.selectForm.ref_cfg.show_fields_array;
			this.setFieldMap(fieldMap);
			this.refCfg.main_field = this.selectForm.ref_cfg.main_field;
			this.selectForm.ref_cfg.show_fields.remove(this.refCfg.main_field);
			this.refCfg.show_fields = this.selectForm.ref_cfg.show_fields;
			this.initList();
		},
		methods: {
			selectThis(item){
				var id = item.id;
				var selectedData = this.formselected.selectedList;
				//删除人员
				if(this.formselected.idStr.indexOf(id)!=-1){
					this.formselected.idStr = this.formselected.idStr.replace(id+"|","");
					for(var t = 0;t<selectedData.length;t++){
						if(selectedData[t].id==id){
							selectedData.splice(t,1);
						}
					}
					//添加人员
				}else{
					this.formselected.idStr+=id+"|";
					selectedData.push(item);
				}
			},
			selectStart(data){
				for(var i=0;i<data.length;i++){
					this.formselected.selectedList.push(data[i]);
					this.formselected.idStr+=data[i].id+'|';
				}
			},
			//查询数据
			showMsgFromSearchBar(keyWord,value){
				this.page = 1;
				this.list = [];
				this.keyWord = keyWord;
				this.itemKey = value;
				this.initList();
			},
			loadMore(){
				this.page++;
				this.loading = true;
				this.busy = true;
				this.initList();
			},
			initList(){
				_.showLoading();
				var _this = this;
				var formDetail = this.$store.state.formBase.formDetail;
				var data = {
					definitionId:formDetail.definitionId,
					pageSize:10,
					page:this.page,
					refItemKey:this.selectForm.data.refItemKey,
					itemKey:this.itemKey,
					keyWord:this.keyWord,
				};
				selectFormdata(data).then((res)=>{
					_this.setList(res);
				})
			},
			setList(res) { // 设置列表数据
				this.loading = false;
				_.hideLoading();
				if(res.code != "0") {
					return _.alert('提示', res.desc);
				}else {
					this.page = res.data.currPage;
					this.busy = res.data.pageData.length < 10? true:false;
					this.list =  this.list.length > 0 ? this.list.concat(res.data.pageData) : res.data.pageData;
				}
			},
			//赋值fieldMap
			setFieldMap(field){
				var _this = this;
				field.forEach(item=>{
					_this.fieldMap[item._id] = item.label;
					_this.typeMap[item._id] = item._type;
					//初始化搜索框的内容option
					_this.searchBar.moreFunction.option.push({name:item.label,value:item._id});
				});
			},
			comfirm(){
				//回调的数据
				var currentId = dataBase.selectForm.data.refItemKey;
				var currentData = this.combineList.find(function (x) {
					return x._id === currentId;
				});
				var min = Number(currentData.minimum_length);
				var max = Number(currentData.maximum_length);
				var len = this.formselected.selectedList.length;
				if(min != 0 || max != 0){
					if(len < min || len > max){
						_.alert('提示',(min != 0 ? ('最少输入'+min+'项') : '')+((min != 0 && max != 0)? ('，') : '')+(max != 0 ? ('最多输入'+max+'项') : ''));return;
					}
				}
				this.dataBase.selectForm.confirm.call(this,this.formselected);
				this.concel();
			},
			concel(){
				this.dataBase.selectForm = {
					show:false,
					selectList:[],
					data:{
						formRef:'',
					},
					confirm:null,
				}

			},

			formatData(choiceMap,choiceItem){
				var fieldMap = this.selectForm.ref_cfg.show_fields_array;
                var formOptionMap = this.selectForm.ref_cfg.formOptionMap;
				for(let field of fieldMap ){
					if(field._id === choiceItem){
						//单选或下拉框
						if(field._type === 'RadioButton' || field._type === 'DropDown'){
							return formOptionMap[choiceItem][choiceMap[choiceItem]]
						}
						//多选
						else if(field._type === 'CheckBox'){
							var ids = choiceMap[choiceItem]?choiceMap[choiceItem].split(','):[];
							var value = []
							ids.forEach(id => {
								value.push(formOptionMap[choiceItem][id])
							})

							return value.join(' ');
						}
						//二级下拉框
						else if(field._type === 'CascadeDropDown'){
							var value = choiceMap[choiceItem]?choiceMap[choiceItem].split('_')[1]:'';
							return value;
						}
						//图片
						else if(field._type === 'ImageField'){
                            var imgs = choiceMap[choiceItem].split(','),pic = [];
                            imgs.forEach(img => {
                                pic.push(_.compressURL + img)
                            })
							return  pic;
						}
						else{
							return choiceMap[choiceItem]
						}
					}
				}
			},
		},
	}
</script>
<style scoped>
	.qwui-crm_select {
		position: fixed;
		z-index: 10;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		margin: auto;
		background: #fff;
	}
	/*********/
	.qwui-user_item {
		position: relative;
		font-size: 16px;
		line-height: 2.2;
		clear: both;
		background-color: white;
		overflow: hidden;
	}
	.qwui-user_item:before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 2;
	}
	.qwui-user_item .qwui-user_item_inner {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		padding: 10px 15px;
	}
	.qwui-user_item .avator {
		width: 40px;
		height: 40px;
		margin-right: 10px;
		min-width: 38px;
	}
	.qwui-user_item .avator img {
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}
	.description_title{
		line-height: 1.4;
		overflow: hidden;
	}
	.client-code{
		font-size: 15px;
		color: #333;
		line-height: 1.5;
	}
	.client-code-sub{
        max-height:32px;
		font-size:12px;
		color: #666;
        overflow: hidden;
        word-break: break-all;
	}
	.qwui-head-pic{
		display: inline-block;
		width: 48px;
		height: 48px;
        margin-right: 5px;
		border-radius: 4px;
		border: none;
	 }
	.select-crm-content{
		position: relative;
		width: 100%;
	}
	.clientList{
		position: relative;
		width: 100%;
		overflow-y: scroll;
	}
	.select-crm-footer{
		position: absolute;
		bottom: 0;
		padding: 0 3%;
		width: 94%;
		min-height: 50px;
		-webkit-box-sizing: content-box;
		box-sizing: content-box;
		background: #fff;
		z-index: 10;
	}
	.select-crm-footerBar{
		display: flex;
	}
	/*底部按钮*/
	.qwui-userOrDept_select_footer{
		position: absolute;
		bottom: 0;
		padding: 0 3%;
		width: 94%;
		min-height: 50px;
		box-sizing: content-box;
		background: #fff;
		z-index: 10;
	}
	.qwui-userOrDept_select_footer:before,.qwui-userOrDept_btn_tab:before{
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		border-top: 1px solid #e5e5e5;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	.qwui-userOrDept_select_footerBar{
		display: flex;
	}
	.qwui-userOrDept_footer_flex{
		flex: 1;
	}
	.qwui-userOrDept_select_footer .selected {
		text-align: center;
		flex: 2;
	}
	.qwui-userOrDept_select_footer .selected p:first-child{
		margin-top: 5px;
		font-size: 12px;
		color: #999;
	}
	.qwui-userOrDept_select_footer .selected p:last-child{
		font-size: 14px;
		color: #586c94;
		cursor: pointer;
	}
	.qwui-userOrDept_select_footer .qwui-btn {
		position: relative;
		margin-top: 10px;
		width: 60px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 17px;
		color: #fff;
		text-decoration: none;
		border-radius: 5px;
		display: block;
		cursor: pointer;
		background: #2F7DCD;
	}
	.qwui-userOrDept_select_footer .qwui-btn::after {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 200%;
		border: 1px solid #e5e5e5;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		box-sizing: border-box;
		border-radius: 10px;
	}
	.qwui-userOrDept_select_footer .qwui-btn_default {
		color: #333!important;
		background: #fbfafc!important;
	}
	.fr{
		float:right;
	}
	.selected_user {
		background: #fff;
		overflow-y: hidden;
		overflow-x: scroll;
		border-bottom: 1px solid #eeeeee;
		box-shadow: 0px 2px 5px #ccc;
	}
	.item-selected {
		margin-bottom: 5px;
		padding: 0 10px;
		height: 29px;
		line-height: 29px;
		color: #333;
		font-size: 15px;
		border: 1px #ccc solid;
		border-radius: 2px;
		background-color: #fff;
		display: inline-block;
		cursor: pointer;
	}
</style>
