



import {getChildDefault} from '../../js/getData'
const state = {
	//表单数据
	equation: [],//计算式po
	equationMatch: [],//有计算式的字段
	data: {},
	schema: [],
	statisticMap: {},//统计的数据字段
	templateObj:{},//表单标题的模板
	fieldArry:[],
	//子表单数据
	childSchema: [],
	childData: {},
	childView: {
		show: false,
		parentId: '',
		index: ''
	},
	selectQuota:{},
	typeMap:{},
	choiceMap:{},
	formDetail: null,
	relateIds:[],//被设置隐藏的关联的字段的ids
	relateMatch:[],//有设置隐藏的关联的字段的ids
	relateMap:{},
	relateAllMap:{},
	//表单详情页码数据
	pageData:{
		paramVersionsId:'',
		paramTitle: '',
		paramIsTask: '',
		paramSearchType: '',
		paramSeniorSearch: '',
		paramCreateaEndTime:'',
		paramCreateaStartTime:'',
		paramAuditStatus:'',
		paramAuditStartTime:'',
		paramAuditEndTime:'',
		paramPagerNum: '',
		paramPageCount: '',
		paramDepartId:'',
		paramCreatorId:'',
		paramCommentStatus:'',
	}
}

const getters = {

}

const mutations = {
		setSelectQuota(state, obj) {
			state.selectQuota = obj;
		},
		setFormDetail(state, obj) {
			state.formDetail = obj;
		},
		setValue(state, obj) {
			// 变更状态
			state.data[obj.key] = obj.value;
			state.schema.forEach(item => {
				if (item._id == obj.key) {
					item.value = obj.value
				}
			})
		},
		setChildValue(state, obj) {
			// 变更状态
			state.childData[obj.key] = obj.value;
			state.childSchema.forEach(item => {
				if (item._id == obj.key) {
					item.value = obj.value
				}
			});
		},

		setTypeMap(state, obj) {
			state.typeMap = obj;
		},
		setChoiceMap(state, obj) {
			state.choiceMap = obj;
		},
		setEquationMatch(state, obj) {
			state.equationMatch = obj;
		},
		setEquation(state, obj) {
			state.equation = obj;
		},
		setStatisticMap(state, obj) {
			state.statisticMap = obj;
		},
		setData(state, obj) {
			state.data = obj;
		},
		setSchema(state, obj) {
			state.schema = obj;
		},
		setChildSchema(state, obj) {
			state.childSchema = obj;
		},
		setRelateIds(state, obj){
			state.relateIds = obj;
		},
		setRelateMatch(state,obj){
			state.relateMatch = obj;
		},
		setRelateMap(state,obj){
			state.relateMap = obj;
		},
		setRelateAllMap(state,obj){
			state.relateAllMap = obj;
		},
		setPageData(state,obj){
			state.pageData = obj;
		},
		setTemplateObj(state,obj){
			state.templateObj = obj;
		},
		setFieldArry(state,obj){
			state.fieldArry = obj;
		},
		reset(state) {
			state.equation = [];
			state.data = {};
			state.schema = [];
			state.equationMatch = [];
			state.relateIds = [];
			state.relateMatch = [];
			state.relateMap = {};
			state.relateAllMap = {};
			state.statisticMap = {};
			state.templateObj = {};
			state.fieldArry = [];
			state.selectQuota = {};
		},
		//子表单的数据
		setChildView(state, obj) {
			state.childView = obj;
		},
		resetChildView(state) {
			state.childSchema = [],
				state.childView.parentId = null,
				state.childData = {},
				state.childView.index = null
		}

	}
const actions = {
	setChildSchema(context, obj) {
		getChildDefault(obj.param).then(function (result) {
			if (result.code == "0") {
				console.log(result)
				var data = result.data.default;
				obj.obj.defaultValue = data;
				//渲染默认值
				if (Object.getOwnPropertyNames(data).length > 0) {
					var str = JSON.stringify(context.state.childSchema);
					var schemaData = JSON.parse(str);
					var schema = schemaData.map(item => {
						item.value = data[item._id] || '';
						return item;
					})
					console.log(schema)
					context.commit('setChildSchema', schema)
				}

			}

		})

	}
}
export default {
	state,
	getters,
	mutations,
	actions
}
