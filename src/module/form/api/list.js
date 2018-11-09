import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config.js'

// 表单个项的数量
export function initHead() {
    return axios({
        url: baseURL + '/portal/portalForm/getFormDiyInfo.do',
        method: 'POST',
        async: false
    })
}

// 外部单--外部单提醒
export function initOpen(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getMyOutFromList.do',
        method: 'POST',
        data: data
    })
}

// 外部单--我相关的
export function outerRelevant(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getMyRelevantOurFromList.do',
        method: 'POST',
        data: data
    })
}

// 我相关的 / 我提交的 / 草稿
export function initRelevant(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getWordOrderList.do',
        method: 'POST',
        data: data
    })
}

// 我相关的--高级搜索
export function relevantSearch(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findMyRelevantWordOrderList.do',
        method: 'POST',
        data: data
    })
}

// 待办
export function initTodo(data) {
    return axios({
        url: baseURL + '/portal/portalForm/auditFormList.do',
        method: 'POST',
        data: data
    })
}

// 待办--高级搜索
export function todoSearch(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findMyAuditFormList.do',
        method: 'POST',
        data: data
    })
}

// 我提交的--高级搜索
export function submitSearch(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findMySubmitWordOrderList.do',
        method: 'POST',
        data: data
    })
}

// 我提交的--批量检查是否可以删除
export function submitCheck(ids) {
    return axios({
        url: baseURL + '/portal/portalForm/ajaxBatchCheck.do',
        method: 'POST',
        data: { "ids": ids },
        dataType: 'json'
    })
}

// 我提交的--批量删除
export function submitDel(ids) {
    return axios({
        url: baseURL + '/portal/portalForm/ajaxBatchDelete.do',
        method: 'POST',
        data: { 'ids': ids },
        dataType: 'json'
    })
}

// 明细数据--其他表单
export function wordOrderMxList(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getWordOrderMxList.do',
        method: 'POST',
        data: data
    })
}

// 明细数据--外部单
export function outerMxList(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getMyOutFromMxList.do',
        method: 'POST',
        data: data
    })
}

// 获取最近使用的表单显示个数
export function getRecentlySize() {
    return axios({
        url: baseURL + '/portal/portalForm/getQueryRecentlySize.do',
        method: 'POST'
    })
}

// 保存最近使用的表单显示个数设置
export function setRecentlySize(data) {
    return axios({
        url: baseURL + '/portal/portalForm/setQueryRecentlySize.do',
        method: 'POST',
        data: {size: data}
    })
}


// 获取最近使用的表单
export function initRecently(data) {
    return axios({
        url: baseURL + '/portal/portalForm/queryRecently.do',
        method: 'POST',
        data: data
    })
}

// 获取分组
export function initGroup(data) {
    return axios({
        url: baseURL + '/portal/portalForm/ajaxSearchFormtype.do',
        method: 'POST',
        data: data
    })
}

// 获取表单
export function initForm(data) {
    return axios({
        url: baseURL + '/portal/portalFormAction!findFormList.action',
        method: 'POST',
        data: data
    })
}

// 收藏或取消收藏表单
export function collectForm(id) {
    return axios({
        url: baseURL + '/portal/portalForm/formCollection.do',
        method: 'POST',
        data: { id: id }
    })
}

// 查看某个表单是否已经收藏
export function isCollect(id) {
    return axios({
        url: baseURL + '/portal/portalForm/getFormCollectionInfo.do',
        method: 'POST',
        data: { id: id }
    })
}

//收藏或填单的明细数据
export function mxListDetailData(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getWordOrderMxList.do',
        method: 'POST',
        data: data
    })
}

//收藏
export function collection(data) {
	return axios({
		url: baseURL + '/portal/portalForm/getMyCollectionFromList.do',
		method: 'POST',
		data: data
	})
}

//select_form 表单关联选择
export function selectFormdata(data) {
	return axios({
		url: baseURL + '/portal/portalForm/formRefSearch.do',
		method: 'POST',
		data: data
	})
}

//表单详情翻页请求接口
export function changePage (data) {
	return axios({
		url:baseURL + '/portal/portalForm/getFormonePager.do',
		method:'POST',
		data:data
	})
}

//修改轨迹
export function getHistory (data) {
	return axios({
		url:baseURL + '/portal/portalForm/queryOrbit.do',
		method:'POST',
		data:data
	})
}
//外部单发送邮件
export function sendEmail (data) {
	return axios({
		url:baseURL + '/open/openForm/sendEmail.do',
		method:'POST',
		data:data
	})
}

//详情审批人修改保存
export function updateFormByToUser(data) {
	return axios({
		url:baseURL + '/portal/portalForm/updateFormByToUser.do',
		method:'POST',
		data:data
	})
}

// 是否存在相同条件的下载
export function isExistRunTask(data) {
    return axios({
        url: baseURL + '/portal/portalFormAction!isExistRunTask.action',
        method: 'POST',
        dataType: 'json',
        data: data
    })
}

// 下载明细数据
export function downloadMx(data) {
    return axios({
        url: baseURL + '/portal/portalFormAction!downloadOrdersMx.action',
        method: 'POST',
        data: data,
        dataTyep: 'json'
    })
}
