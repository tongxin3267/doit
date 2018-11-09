// 根级别mutations
const mutations = {
  // 设置商城列表页数据
  SET_MALL_LIST(state, data) {
    state.mallListData = data;
  },
  // 设置商城详情页数据
  SET_MALL_DETAIL(state, data) {
    let chapterList = data.chapterEnclosureListVOList;
    // 设置章节的显示隐藏变量
    let length = chapterList.length;
    for(let i = 0; i < length; i++) {
      chapterList[i].isShow = true;
    }
    state.mallDetailData = data;
  },
  // 清除商城详情页数据
  CLEAR_MALL_DETAIL(state, data) {
    state.mallDetailData = {
      subject: {},
      teacherRefPOList: {},
    };
  },
  // 设置直播列表页数据
  SET_LIVE_LIST(state, data) {
    state.liveListData = data;
  },
  // 设置直播详情页数据
  SET_LIVE_DETAIL(state, data) {
    state.liveDetailData = data;
  },
  // 设置直播页数据
  SET_LIVE_PLAY(state, data) {
    state.livePlayData = data;
  },
  // 清除直播详情页的数据
  CLEAR_LIVE_DETAIL(state) {
    state.liveDetailData = {
      teacherPO: {},
    };
  },
  // 设置回放页数据
  SET_REPLAY(state, data) {
    state.replayData = data;
  },
  // 设置搜索信息
  SET_SEARCH_VALUE(state, obj) {
    state.searchVal.keyWord = obj.keyWord;
    state.searchVal.searchType = obj.searchType;
  }
}

export default mutations
