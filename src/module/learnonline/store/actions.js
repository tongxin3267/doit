// 根级别的actions
import {
  getLiveListData,
  getLiveDetailData,
  getLivePlayData,
  getMallListData,
  getMallDetailData,
  recordLiveTime,
  getLiveCommentData,
  sendLiveCommentData,
  getReplayData
} from '../api/getData';

const actions = {
  // 获取商城（发现）列表
  getMallList({ commit }) {
    return new Promise((resolve, reject) => {
      getMallListData({}, data => {
        commit('SET_MALL_LIST', data.fixCategoryList);
        resolve(data);
      })
    })
  },

  // 获取商城详情页数据
  getMallDetail({ commit }, id) {
    // 加return返回promise对象
    return new Promise((resolve, reject) => {
      getMallDetailData({detailId: id}, data => {
        commit('SET_MALL_DETAIL', data.subjectInfo);
        resolve();
      })
    });
  },

  // 获取直播列表
  getLiveList({ commit }) {
    const params = {
      "categoryId":"",
      "page": 1,
      "pageSize":10,
      "searchValue.isMust":0,
      "searchValue.order":1
    }
    getLiveListData(params, data => {
      commit('SET_LIVE_LIST', data);
    })
  },

  // 获取相应直播详情数据
  getLiveDetail({ commit }, id) {
    const params = { liveId: id }
    return new Promise((resolve, reject) => {
      getLiveDetailData(params, data => {
        commit('SET_LIVE_DETAIL', data.liveDetail);
        resolve();
      })
    })
  },

  // 进入直播间时获取的数据
  getLivePlay({ commit }, id) {
    const params = { id: id };
    return new Promise((resolve, reject) => {
      getLivePlayData(params, data => {
        commit('SET_LIVE_PLAY', data);
        resolve();
      })
    });
  },

  // 直播间记录时长
  recordLive({commit}, id) {
    const params = {
      liveId: id
    };
    return new Promise((resolve, reject) => {
      recordLiveTime(params, data => {
        resolve(data)
      })
    });
  },

  // 直播间获取评论
  getLiveComment({commit}, params) {
    return new Promise((resolve, reject) => {
      getLiveCommentData(params, data => {
        resolve(data);
      })
    });
  },

  // 直播间发送评论
  sendLiveComment({commit}, params) {
    return new Promise((resolve, reject) => {
      sendLiveCommentData(params, data => {
        resolve(data);
      })
    });
  },

  // 回放间获取的数据
  getReplay({commit}, id) {
    return new Promise((resolve, reject) => {
      getReplayData({liveId: id}, data => {
        commit('SET_REPLAY', data);
        resolve(data);
      }, (result) => {reject(result);})
    });
  },
}

export default actions
