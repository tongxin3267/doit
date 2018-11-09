<template>
	<transition name="slide">
		<!--<div class="bg-popop-list" @click.stop="close()">-->
			<div class="popup-list" @click.stop>
				<div class="popup-list-item"
						 v-for="item in list" :key="item.id"
						 @click="changeIndex(item)"
						 :class="{colorGray:selectQuota[item._id]&&selectQuota[item._id].selectedNum>=item.quota}"
				>
					<i :class="{active:item._id === field.value}"></i>
					<span>{{item.value}}</span>
					<span v-if="selectQuota[item._id]&&selectQuota[item._id].selectedNum>=item.quota">(选项名额已空)</span>
				</div>
				<div class="help-block popup-list-item colorRed" v-if="help">{{ help }}</div>
			</div>
		</div>
	</transition>
</template>
<script>
	export default {
		props: [ 'field' ],
		data () {
			return {
				list:[],
				help:''
			}
		},
		created(){
			this.list = this.field.choices;
		},
		computed:{
			selectQuota(){
				return this.$store.state.formBase.selectQuota||{};
			}
		},
		methods: {
			close () {
				this.$emit ('listenShow',false)
			},
			changeIndex (item) {
				this.help = '';
				if(this.selectQuota[item._id]&&this.selectQuota[item._id].selectedNum>=item.quota) {
					this.help = '选项名额已空';
					return ;
				} ;
				this.$emit ('getItem', item);
				if(this.field.childChoices){
					this.list = this.field.childChoices
				}else{
					this.close ()
				}
			},
		},
	}
</script>
<style>


	.popup-list {
		position: fixed;
		width: 80%;
		height: 100%;
		top: 0;
		right: 0;
		padding-left: 10px;
		background: #fff;
		overflow: scroll;
	}

	.popup-list-item {
		width: 100%;
		padding: 10px;
		font-size: 15px;
		line-height: 23px;
		border-bottom: 1px solid #f7f7f7;
	}

	.popup-list-item i {
		display: inline-block;
		width: 16px;
		height: 18px;
		margin-right: 10px;
    background:url(../../../../assets/images/icon_form_single-unselected.png) no-repeat;
    background-size: 100%;
		vertical-align: text-bottom;
	}

	.popup-list-item i.active {
    background: url(../../../../assets/images/icon_form_single-checked.png) no-repeat;
    background-size: 100%;
	}

	.slide-enter-active, .slide-leave-active {
		transition: all .2s ease;
	}
	.slide-enter, .slide-leave-to {
		transform: translateX(100%)
	}
</style>
