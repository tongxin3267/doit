<!--使用：	pos必传 undefined或object -->
	    <!--type类型 显示地图的类型 getPosition获取定位 showPosition展示定位  其他待定-->
		<!--组件绑定事件@positionData="function()"  返回数据data-->
		<!--data = {value:String,longitude:Number,latitude:Number}-->

<template>
	<div v-if="type !='getAddress'">
		<!--腾讯地图-->
		<div class="tencent-map">
			<div id="allMap"></div>
			<!--输入框 待修改-->
				<div class="latLng-msg" v-if="type ==='showPosition' && !noPos">
					<div class="msg-title fl">地址：</div>
					<div class="msg-content">
						<span>{{pos.value}}</span>
						<span class="lat-lng">经度 {{pos.longitude}} ，纬度 {{pos.latitude}}</span>
					</div>
				</div>
			<div class="map-control">
				<div class="map-search-div" v-if="type ==='getPosition'">
					<input ref="place" type="text" @input="getSuggestion($event)" class="map-search-input" v-model="address">
				</div>
				<div class="map-suggest-list">
					<div class="suggest-item" v-for="item in suggestList" :key="item.id" @click="$emit('changeAddress',item)"><p>{{item.title}}</p><p class="colorGray">{{item.address}}</p></div>
				</div>
					<flow-button :buttondata="buttonConfig"></flow-button>
			</div>
		</div>
	</div>
</template>
<script>
	import wx from 'weixin-js-sdk';
	import flowButton from '@/components/button/flow_button';

	export default {
		props:{
			'pos':{
				required:true,
			},
			'type':{
				type:String,
				default:'getPosition', //getPosition：获取定位  showPosition：显示定位 getAddress:获取地点不显示地图
			},
		},
		components:{
			flowButton,
		},
		data(){
			return {
				address:'',
				buttonConfig: { //操作按钮
					primaryList: [{type: "default", name: '确认', callBack: null}],
					defaultList: [{type: "default", name: '返回', callBack: null}],
					style: {class: ""}//按钮是否置底部 active :底部、"":相对定位
				},
				suggestList:[],
				addressData:{},
				timer: null,// 声明计时器
    		}
		},
		created(){
			var _this = this;
			if(this.type === 'showPosition'){
				this.buttonConfig.primaryList = [];
				this.buttonConfig.defaultList[0].callBack = function(){
					_this.$emit('closeMap')
				};
			}else{
				this.buttonConfig.defaultList = [];
				this.buttonConfig.primaryList[0].callBack = function(){
					if(_this.type != 'showPosition' && JSON.stringify(_this.addressData)!='{}') {
						_this.$emit ("positionData", _this.addressData);
					}
					_this.$emit('closeMap')
				};
			}
		},
		computed:{
			//判断父组件传过的数据是否包含所需的数据
			noPos(){
				return JSON.stringify(this.pos)=='{}' || this.pos == undefined || !this.pos.longitude || !this.pos.latitude
			}
		},
		mounted() {
			var _this = this;
			//判断当前是获取地点，显示地点
			if(this.type === 'showPosition'){
				if(this.noPos){
					this.buttonConfig.defaultList[0].callBack();
					return _.alert("提示","无法获取经纬度")
				}else{
					this.getLocation()
				}
			}else{
				this.getLocation(); //自动定位
			}
		},
		methods: {
//			初始化地图
			initMap(lat,lng) {
				var _this = this,markers=[];
				var map = new qq.maps.Map (document.getElementById ("allMap"), {
					// 地图的中心地理坐标。
					center: new qq.maps.LatLng(lat,lng),
					zoom: 14,
					scrollwheel: true,        //设置滚动缩放默认不允许
					zoomControl: true,
					panControl: false,
					zoomControlOptions: {
						position: qq.maps.ControlPosition.RIGHT  //设置地图控件位置靠近左侧
					},
				});
				//定义坐标图标
				var marker = new qq.maps.Marker ({
					position: new qq.maps.LatLng (lat, lng),
					animation: qq.maps.MarkerAnimation.DROP,
					map: map
				});
				markers.push(marker);
				//添加监听事件   获取鼠标单击事件
				qq.maps.event.addListener(map, 'click', function(event) {
					if(_this.type === "showPosition") return ;
					var marker = new qq.maps.Marker ({
						position: event.latLng,
						map: map
					});
					markers[ 0 ].setMap (null)
					markers = [];
					markers.push (marker);
					_this.getAddress(event.latLng).then(res =>{
						_this.renderAddress(res)
					})
				});
				//
				this.$on('changeAddress',function (item) {
					var address = item.province+item.city+item.district+item.title;
					var marker = new qq.maps.Marker ({
						position: new qq.maps.LatLng (item.location.lat, item.location.lng),
						map: map
					});
					markers[0].setMap (null)
					markers = [];
					markers.push (marker);
					//改变地图的中心位置
					map.panTo(new qq.maps.LatLng(item.location.lat, item.location.lng));
					var data = {
						value: address,
						longitude: item.location.lng,
						latitude: item.location.lat,
					}
					_this.address = address;
					_this.suggestList = [];
					_this.renderAddress(data);
				})
			},
			getLocation(){
				var _this = this;
				if(this.pos != undefined  &&this.type!='getAddress'){
					var lat = this.pos.latitude,
						lng = this.pos.longitude;
					this.address = this.pos.value;
					this.initMap(lat,lng)
				}else{
					if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
						//微信定位获取地址
						wx.getLocation({
							type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							success: function (res) {
								var lng = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
								var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
								var latLng = new qq.maps.LatLng(lat,lng);
								//定位校准
								qq.maps.convertor.translate(latLng, 1, function(result) {
									_this.getAddress (result[0]).then (res => {
										_this.renderAddress (res);
										if(_this.type ==='getAddress'){
											_this.buttonConfig.primaryList[0].callBack();
										}else{
											_this.initMap (res.latitude, res.longitude)
										}
									})
								})
							},
						});
					}else{
						//测试默认定位
						var data = {
							value: '北京市',
							longitude: 116.397128,
							latitude: 39.916527,
						};
						this.renderAddress (data);
						if(this.type ==='getAddress'){
							this.buttonConfig.primaryList[0].callBack();
						}else{
							this.initMap (res.latitude, res.longitude)
						}
					}
				}
			},
			//返回的数据
			renderAddress(data){
				this.addressData = data;
			},
			//格式化地址
			formatAddress(data){
				var address = data.province+data.city+ data.district;
						address+=data.streetNumber?data.streetNumber:data.street;
						return address;
			},
			//根据经纬度获取地址  //根据地址获取经纬度
			getAddress(latLngOrAddress) {
				var _this = this;
				var data = {};
				return new Promise (function (resolve, reject){
					//调用地址解析类
					var geocoder = new qq.maps.Geocoder({
						complete : function(result) {
							data.value = _this.formatAddress(result.detail.addressComponents)
							data.latitude = result.detail.location.lat;
							data.longitude = result.detail.location.lng;
							_this.address = data.value;
							resolve(data);
						}
					});
					typeof latLngOrAddress =='string'?geocoder.getLocation(latLngOrAddress):geocoder.getAddress(latLngOrAddress);
				})
			},
			//关键词推荐  有调用限制。
			getSuggestion({target}){
				var _this =this;
				clearTimeout(this.timer);
				this.timer = setTimeout(function () {
					var url = 'http://apis.map.qq.com/ws/place/v1/suggestion/'
					_.jsonp(
						url,
						{
							region:'',
							keyword:target.value,
							//key在之后抽出来公共管理
							key:'GDYBZ-6QPEF-ZY5JM-NLGQH-ZVLZE-YDBFB',
							output:'jsonp',
						},
					).then(function(res){
						_this.suggestList = res.data;
					})
				}, 1000);
			},
		},
	}
</script>
<style scoped>
	.tencent-map {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 12;
		background: #fff;
	}

	#allMap {
		width: 100%;
		height: 100%;
	}
	.map-control {
		position: absolute;
		left:0;
		right:0;
		bottom:0;
		background: #fff;
	}
	.map-search-div {
		background-color: #efeff4;
		padding: 8px;
	}
	.map-search-input {
		display: block;
		height: 30px;
		line-height: 30px;
		width: 100%;
		font-size: 14px;
		border-radius: 5px;
		border: 1px solid #dadbdf;
		background: #fff;
		padding: 0 5px;
		box-sizing: border-box;
		outline: none;
		-webkit-appearance: none;
	}
	.map-suggest-list {
		max-height:300px;
		overflow: scroll;
	}
	.suggest-item {
		height: 35px;
		margin-left: 8px;
		line-height: 15px;
		font-size: 12px;
		border-bottom: 1px solid #e5e5e5;
	}
	.colorGray {
		color:#999;
	}
	.latLng-msg{
		position: absolute;
		left:0;
		right:0;
		bottom:60px;
		width: 100%;
		padding: 20px 20px 20px 90px;
		font-size: 14px;
		line-height: 21px;
		color: #333;
		max-height: 160px;
		overflow: auto;
		box-sizing: border-box;
		background: rgba(255,255,255,0.8);
	}
	.msg-title{
		width: 70px;
		margin-left: -70px;
		color: #666;
	}
	.lat-lng {
		display: block;
		font-size: 12px;
		color: #999;
	}
	@media screen and (min-width: 1024px){
		.tencent-map {
			width: 740px;
			margin: auto;
		}
	}

</style>
