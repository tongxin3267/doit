<template>
	<div class="wrap formtype"
					:infinite-scroll-immediate-check="false"
					v-infinite-scroll="loadMore"
					infinite-scroll-disabled="busy"
					infinite-scroll-distance="10">
		<div class="qwui-nav_box_fixed">
			<search-bar
				:searchinput="searchBar"
				@listenToSearchBox="showMsgFromSearchBar" ></search-bar>
		</div>
		<div
			class="recentlyUsed"
			v-show="!showRecord">
			<p class="itemTip">最近使用表单<a class="fr" @click="showRecentSize">显示设置</a></p>
			<form-list :list="formList"></form-list>
		</div>
		<p
			class="itemTip mt15"
			v-show="!showRecord">全部分组</p>
		<group-list :list="groupList"></group-list>
        <load-more
			:busy="busy"
			:loading="loading"
			:showrecord="showRecord"
			:record-title="recordTitle"
			:record-text="recordText"
			@childevent="loadMore">
		</load-more>
		<dialog-group :title="'最近使用显示个数'"
									:show="dialogShow"
									@cancel="cancelDialog"
									@confirm="confirmDialog"
									cancelText="取消"
									confirmText="确定">
			<cell :inline-desc="recentlySize" primary="content">
				<range v-model="recentlySize" :min="1" :max="10" :step="1"></range>
			</cell>
		</dialog-group>

	</div>
</template>

<script>

import searchBar from '@/components/base/search_box.vue';
import loadMore from './base/load_more.vue'
import formList from './list/formList'
import groupList from './list/groupList'
import { initRecently, getRecentlySize, setRecentlySize, initGroup } from '../api/list'
import dialogGroup from '@/components/base/dialog/dialog-group';
import Range from 'vux/src/components/range';
import Cell from 'vux/src/components/cell';
export default {
	components:{
		searchBar,
		formList,
		groupList,
		loadMore,
        dialogGroup,
		Cell,
		Range
	},
	data(){
		return {
			searchBar:{ //头部搜索框
				show: true,
				keyWord: '',
				moreFunction: {
					show: true,
					option: [
						{
							name: '分组',
							placeholder: '搜索分组',
							value: 'formtype'
						},
						{
							name: '名称',
							value: 'formlist'
						}
					]
				}
			},
			formList: [],
			groupList: [],
			recordTitle: '',
			recordText: '',
			busy: true,
			loading: false,
			dialogShow:false,//是否显示最近使用个数设置框
			setting: {
				page: 1,
				pageSize: 10,
				keyWord: ''
			},
			recentlySize: 2
		}
	},
	computed:{
		showRecord(){
			this.groupList = this.groupList || [];
			return this.groupList.length == 0 ? true : false;
        }
	},
	created() {
		let _this = this;
		getRecentlySize().then((res) => {
			this.initFormList(res.data.size)
		})
		this.initGroupList();
	},
	methods:{
		loadMore(){
			this.setting.page++;
			this.loading = true;
            this.busy = true;
			this.initGroupList(true);
		},
		showMsgFromSearchBar(keyWord, value){
			if(value == "formlist") {
				this.$router.push('/formlist');
			}
			if(keyWord == this.setting.keyWord) {
				return
			}
			this.list = [];
            this.setting.page = 1;
            this.setting.keyWord = keyWord;
            this.initGroupList();
		},
		initFormList(size) {
			_.showLoading()
			initRecently(size).then((res) => {
				_.hideLoading();
				if(res.code != "0") {
					return _.alert('提示', res.desc);
				}
				this.formList = res.data.data;
				this.recentlySize = this.formList.length;
			})
		},
		initGroupList(isLoadMore) {
			let _this = this,
				searchValue = this.setting;
			searchValue.type = '';
			searchValue.status = '';
			_.showLoading();
			initGroup(searchValue).then((res) =>  {
				_this.setGroupList(res, isLoadMore);
			})
		},
		setGroupList(res, isLoadMore) {
			_.hideLoading();
			this.loading = false;
			if(res.code != "0") {
				return _.alert('提示', res.desc);
			}
			this.busy = this.setting.page == res.data.maxPage;
			this.groupList = isLoadMore ? this.groupList.concat(res.data.pageData) : res.data.pageData;
		},
		showRecentSize(){
			//更新进度按钮
			this.dialogShow=true;
		},
		cancelDialog() {//取消
			this.dialogShow=false;
		},
		confirmDialog() {//确定
			var _this=this;
			setRecentlySize(_this.recentlySize).then(function(){
				_this.initFormList();
				_this.dialogShow=false;
			});
		},
		getPosition(node) {
			var left = node.offsetLeft; //获取元素相对于其父元素的left值var left
			var top = node.offsetTop,
				current = node.offsetParent; // 取得元素的offsetParent
			　 // 一直循环直到根元素
			　　
			while (current != this.$refs.progressBar) {　　
				left += current.offsetLeft;　　
				top += current.offsetTop;　　
				current = current.offsetParent;
			}
			return {
				"left": left,
				"top": top
			};
		},
	},
	watch: {
        'setting.keyWord': {
			handler(val) {
				this.recordTitle = '找不到相关记录';
				this.recordText = '';
				if(val == '') {
					this.recordText = '';
					this.recordTitle = '';
				}
			},
			deep: true
        }
    }
}

</script>

<style scoped>
.formtype {
    margin-top: 43px;
}
.formtype .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
}
.itemTip {
  margin-top: 15px;
	font-size: 14px;
	padding: 0 15px 10px;
	color: #999;
	line-height: 1;
}
.itemTip a {
	color: #586C94;
}
.fr {
	float: right;
}
.title {
	text-align: center;
}
.overMask {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.2);
}
.recentSize {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 90%;
	background-color: #fff;
	border-radius: 5px;;
}
.recentSize .title {
	color: #333;
	padding: 15px 10px 5px 10px;
	font-size: 17px;
}
.recentSize .content {
	padding: 15px;
	margin-bottom: 10px;
	display: flex;
	color: #666;
}
.recentSize .content .progressNum {
	text-align: center;
	flex: 1;
	font-size: 17px;
}
.recentSize .content .progressBar {
	margin: 10px 0;
	height: 4px;
	flex: 9;
	position: relative;
}
.progressBar .currProgress {
	position: absolute;
	top: 0;
	left: 0;
	background-color: #2f7dcd;
	height: 4px;
}
.progressBar .circle-icon {
	display: inline-block;
	position: absolute;
	top: -13px;
	width: 26px;
	height: 26px;
	background-color: #fff;
	border-radius: 50%;
	box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.4);
	transform: translateX(-50%);
	cursor: pointer;
}
.progressBar .progress {
	background-color: #b6b6b6;
	height: 4px;
}
.recentSize .btn {
	display: flex;
	height: 42px;
	font-size: 16px;
	line-height: 42px;
	border-top: 0.5px solid #ccc;
}
.recentSize .btn .cancle, .recentSize .btn .confirm {
	flex: 1;
	text-align: center;
	cursor: pointer;
}
.recentSize .btn .cancle {
	color: #666;
	border-right: 0.5px solid #ccc;
}
.recentSize .btn .confirm {
	color: #467db9;
}
  .mt15{
    margin-top: 15px;
  }
</style>
