<template>
	<transition name="slide">
			<div class="submitSucceed">
				<div class="submitSucceed_main">
					<canvas v-show="false" id="qrcode"></canvas>
					<div class="submitSucceed_icon"></div>
					<div class="mt20 submitSucceed_msg">表单提交成功，感谢您的参与</div>
					<div class="mt10 mb20 colorGray"><span @click="$emit('editAgain')">再次填写</span></div>
					<div class="mt50" v-if="succeedData.isSearchForm"><span class="btn_result" @click="showResult">查看填单结果</span></div>
					<div class="post-emial mt10"  v-if="true||succeedData.isSearchForm"><span @click="dialogShow = true">将结果发送至邮箱</span></div>
				</div>
				<dialog-group :title="'发送结果页面到邮箱'"
											:show="dialogShow"
											@cancel="cancelDialog"
											@confirm="confirmDialog"
											cancelText="取消"
											confirmText="确定">
					<div class="dialogItem">
						<input type="text" placeholder="请输入正确的邮箱" v-model="email">
						<p class="colorRed">{{help}}</p>
					</div>
				</dialog-group>
			</div>
	</transition>
</template>
<script>
	import QRCode from 'qrcode';
	import dialogGroup from '@/components/base/dialog/dialog-group';
	import {sendEmail} from '@/module/form/api/list';

	export default {
		props:{
			succeedData:{
				type:Object,
			}
		},
		components:{
			dialogGroup
		},
		data(){
			return {
				dialogShow:false,
				help:"",
				email:'',
				src:'',
			}
		},
		created(){
			console.log(this.succeedData)
		},
		mounted(){
			this.qrcode()
		},
		methods:{
			showResult(){
				this.$router.push({name: 'openDetail', query: {id:this.succeedData.openDetailId||''}})
			},
			//取消发送
			cancelDialog(){
				this.dialogShow = false;
			},
			//确认发送
			confirmDialog(){
				if(this.checkEmail(this.email)){
					this.help = '';
					var data={
						id:this.succeedData.openDetailId,
						emailAddress:this.email,
						src:this.src,
					}
					sendEmail(data).then((res)=>{
						if (res.code == "0") {
							this.dialogShow = false;
							_.alert('提示','发送成功，请查看邮箱');
						}else{
							_.alert('提示', res.desc);
						}
					}).catch(res =>{
						_.alert('提示','发送失败');
					})
				}else{
					this.help='邮箱格式不正确'
				}
			},
			//邮箱验证
			checkEmail(value){
					var reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
					if (reg.test(value) === false) {
						this.help = '输入的格式不正确或者输入了换行符'
						return false;
					}else{
						return true
				}
			},
			qrcode () {
				var qrcode = document.getElementById('qrcode');
				var url = window.location.origin + window.location.pathname +'#/open/detail?id='+this.succeedData.openDetailId;
				QRCode.toCanvas(qrcode, url, (error) => {
					if (error) {
						console.log(error)
					} else {
						console.log('success')
					}
				})
				this.convertCanvasToImage(qrcode);
			},
			convertCanvasToImage(canvas) {
				var image = new Image();
				image.src = canvas.toDataURL("image/png");
				this.src= image.src
			},
		}
	}
</script>

<style scoped>
	.submitSucceed {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: #fff;
		z-index:8;
	}
	.submitSucceed_main {
		position: absolute;
		top: 45%;
		width: 100%;
		text-align: center;
		transform: translateY(-50%);
	}
	.submitSucceed_main span{
		cursor: pointer;
	}
	.submitSucceed_icon {
		background: url('../../../../assets/images/submitSucceed.png') no-repeat center top;
		height: 77px;
		background-size: 77px 77px;
	}
	.submitSucceed_msg {
		font-size: 18px;
		color: #666;
	}
	.btn_result {
		padding: 0 20px;
		height: 40px;
		line-height: 40px;
		color: #32cd32;
		font-size: 16px;
		text-decoration: none;
		border-radius: 2px;
		border: 1px solid #32cd32;
		display: inline-block;
		box-sizing: border-box;
	}
	.post-emial {
		color: #32cd32;
	}
	.slide-enter-active, .slide-leave-active {
		transition: all .2s ease;
	}
	.slide-enter, .slide-leave-to {
		transform: translateX(100%)
	}

	.dialogItem{
		position: relative;
		display: block;
		margin-bottom:20px;
		font-size: 14px;
		color: #333;
	}
	.dialogItem input {
		width: 100%;
		height: 40px;
		padding:0 5px;
		line-height: 40px;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		box-sizing: border-box;
	}
  .mt10{
    margin-top: 10px;
  }
  .mt20{
    margin-top: 20px;
  }
  .mb20{
    margin-bottom: 20px;
  }
</style>
