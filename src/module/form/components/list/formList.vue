<template>
	<div class="qw_list mb15">
		<div class="qwui-cardList" >
			<div
				class="qwui-cardList_item flexbox"
				v-for="item in list"
				:key="item.id">
				<router-link
					class="flexItem pr15"
					:to="{name: 'add', query: { id: item.definitionVersionsId}}">
					<h3>{{item.formName || item.title }}</h3>
					<p class="ellipsis">{{item.typeName || '其他'}}</p>
				</router-link>
				<i
					class="qwui-icon-operate showActionSheet"
					@click="showActionSheet(item.definitionVersionsId, item.isTask)"></i>
			</div>
		</div>
		<dialog-mask-bottom :dialogConfig="dialogBottomConfig"></dialog-mask-bottom>
	</div>
</template>

<script>
import { isCollect, collectForm } from '../../api/list'
import dialogMaskBottom from '@/components/base/dialog_mask_bottom.vue'


export default {
	props: ['list'],
	components: {
		dialogMaskBottom
	},
	data() {
		return {
			id: '',
			isTask: '',
			dialogBottomConfig: {
				show: false, //控制弹窗显示与否
				title: "", //头部标题，设置为空的话不显示
				btnConfig:[ //自定义弹框操作,可以设置回调函数
					{ title:"填写表单", callBack: this.addForm},//primary为true显示为红色，默认为灰色
					{ title:"填写明细数据", callBack: this.checkDetailData},
					{ title:"取消收藏", callBack: this.collectForm},
					{ title:"取消", callBack: this.hideActionSheet }
				]
			},
		}
	},
	created(){
	},
	methods:{
		showActionSheet(id, isTask) {
			this.id = id;
			this.isTask = isTask;
			isCollect(id).then(res => {
				var title = ''
				if(res.code == "1") {
					title = '收藏表单'
				} else if(res.code == '0'){
					title = '取消收藏'
				} else {
					return _.alert('提示', res.desc);
				}
						this.dialogBottomConfig.btnConfig[2].title = title;
						this.dialogBottomConfig.show = true;
			})
		},
		hideActionSheet() {
			this.dialogBottomConfig.show = false;
		},
		addForm() {
			this.hideActionSheet();
			this.$router.push({name: 'add', query: {id: this.id}})
		},
		checkDetailData() {
			this.hideActionSheet();
			this.$router.push({name: 'detailData', query: { id: this.id, isTask: this.isTask }})
		},
		collectForm() {
			var _this = this;
			collectForm(this.id).then(res => {
				if(res.code == "1") {
					_.tooltips_succeed("移除收藏成功")
				} else if(res.code == "0") {
					_.tooltips_succeed("收藏成功")
				} else {
					return _.alert('提示', res.desc);
				}
				_this.hideActionSheet();
			})
		}
	}
}
</script>

<style scoped>
  .mb15{
    margin-bottom: 15px;
  }
 .pr15{
   padding-right: 15px;
 }
</style>
