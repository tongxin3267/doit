
import searchBar from '@/components/base/search_box'
import loadMore from '../base/load_more'

export const mixinList = { // 展示列表中公用的部分
    data() {
        return {
            statusClassList: {
                '已关闭': 'gray',
                '退审': 'red',
                '已审批': 'green',
                '审批中': 'blue',
                '未关闭': 'blue'
            }
        }
    },
    methods: {
		setPagerNum(index){
			//点击项的页码
			this.$store.state.formBase.pageData.paramPagerNum = index+1;
			sessionStorage.setItem('pageData',JSON.stringify(this.$store.state.formBase.pageData));
		},
        noFind(e) {
            e.onerror = null;
            e.srcElement.src = require('@/assets/images/icon_person.png');
        },
        statusClass(task, is_close, is_over) {
            let status = this.showStatus(task, is_close, is_over);
            if(status == '') {
              return 'none'
            }
            return this.statusClassList[status];
        },
        isTask(task){ // 表单类型  0：普通弹， 1：任务单， 2：审批单， 3：外部单
            var text = ['普通单', '任务单', '审批单', '外部单'];
            return text[task];
        },
        showStatus(task, is_close, is_over) { // 表单显示状态
			if (task == 2 || task == 3) {
				if (is_over == "-1") {
                    return '已关闭';
                } else if (is_over == "0") {
                    return '退审';
                }
				if (is_close == "1") {
                    return '已审批';
                } else {
                    return '审批中';
                }
			} else if (task == 1) {
				if (is_over == "-1") {
                    return '已关闭';
                } else {
                    return '未关闭';
                }
			} else {
				return ''
			}
        },
        timeStr(createTime){ // 以月-日的形式获取时间，例如：.05-09
			if(createTime != null && createTime != 'null' && createTime != ''){
				try{
				    createTime = new Date(createTime.substr(0,10)).Format("MM-dd");
				} catch(e){

                }
			}
			return createTime;
        },
        currentNodestr(currentNode){ // 当前节点
            if(currentNode){
              return '当前节点：'+currentNode;
            }
            return '';
        },

    }
}

export const mixinTab = { // 表单的各个Tab中公用的方法
    components: {
		searchBar,
		loadMore
    },
    data() {
        return {
            searchBar:{ //头部搜索框
				show: true,
				keyWord: '',
				rightSpan:{
                    show: true,
                    callback: null
				}
            },
            setting: {
				page: 1,
				keyWord: '',
				pageSize: 20
			},
            busy: true,
			loading: false,
            advancedSearchShow: false,
            isSearch: false,
			searchValue: {},
			cacheSearchValue: {},
            recordText: '',
			recordTitle: ''
        }
    },
    computed:{
		showrecord(){
			this.list = this.list || [];
			return this.list.length == 0 ? true : false;
        }
	},
    methods: {
        cache(key) { // 保存高级搜索条件到sessionStorage，实现条件缓存
			var _this = this;
			window.onbeforeunload = () => { // 页面退出前，缓存高级搜索条件
			 	_this.setStore(key, this.searchValue);
			}
			if(this.getStore(key)) {
				this.isSearch = true;
				this.searchValue = this.getStore(key); //  根据缓存获取到高级搜索的搜索条件
			} else {
                this.searchValue = {};
            }
		},
        loadMore(){  // 加载更多
			this.setting.page++;
			this.loading = true;
            this.busy = true;
			this.initList(true);
		},
        setList(res, isLoadMore) { // 设置列表数据
			this.loading = false;
			_.hideLoading();
			if(res.code != "0") {
				return _.alert('提示', res.desc);
			}
			this.busy = this.setting.page == res.data.maxPage;
			this.list = isLoadMore && this.list.length > 0 ? this.list.concat(res.data.pageData) : res.data.pageData;
			this.$store.state.formBase.pageData.paramPageCount = res.data.totalRows;
			sessionStorage.setItem('pageData',JSON.stringify(this.$store.state.formBase.pageData));
		},
        showMsgFromSearchBar(keyWord){
			if(keyWord == this.setting.keyWord) {
				return
			}
			this.list = [];
            this.setting.page = 1;
            this.setting.keyWord = keyWord;
			this.isSearch = false;
			this.$refs.advancedSearch.reset();
            this.initList();
		},
        advancedSearchClose() {
            this.advancedSearchShow = false;
        },
		//设置翻页的请求数据
		setPageData(searchValue){
			var pageData = this.$store.state.formBase.pageData;
			pageData.paramIsTask = searchValue['workOrderSearchVO.isTask']||'';
			pageData.paramTitle = searchValue['workOrderSearchVO.formTitle']||'';
			// pageData.paramSearchType = ''
			pageData.paramSeniorSearch = 1;
			pageData.paramCreateaEndTime = searchValue['workOrderSearchVO.createaEndTime']||'';
			pageData.paramCreateaStartTime = searchValue['workOrderSearchVO.createaStartTime']||'';
			pageData.paramAuditStatus = searchValue['workOrderSearchVO.auditStatus']||'';
			pageData.paramAuditStartTime = searchValue['workOrderSearchVO.auditStartTime']||'';
			pageData.paramAuditEndTime = searchValue['workOrderSearchVO.auditEndTime']||'';
			pageData.paramDepartId = searchValue['workOrderSearchVO.departId']||'';
			pageData.paramCreatorId = searchValue['workOrderSearchVO.creatorId']||'';
			pageData.paramCommentStatus = searchValue['workOrderSearchVO.commentStatus']||'';
			sessionStorage.setItem('pageData',JSON.stringify(pageData));
		},

		advancedSearch(searchValue) {
			let newSearchValue = JSON.parse(JSON.stringify(searchValue)),
				deptStr = '',
				userStr = '';
			if(newSearchValue['workOrderSearchVO.departId']) {
				let depts =  newSearchValue['workOrderSearchVO.departId'].depts;
				depts && depts.forEach(function(item){
					deptStr += item.id + ',';
				})
				newSearchValue['workOrderSearchVO.departId'] = deptStr;
			}
			if(newSearchValue['workOrderSearchVO.creatorId']) {
				let users = newSearchValue['workOrderSearchVO.creatorId'];
				users && users.forEach(function(item){
					userStr += item.userId + ',';
				})
				newSearchValue['workOrderSearchVO.creatorId'] = userStr;
			}
			this.setting.page = 1;
            this.setting.keyWord = '';
            this.searchBar.keyWord = '';
			this.searchValue = newSearchValue;
			this.cacheSearchValue = searchValue;
            this.isSearch = true;
			this.setPageData(newSearchValue);
			this.busy = true;
			this.initList()
        },
        setStore(key, value) {
            value = JSON.stringify(value);
            sessionStorage.setItem(key, value);
        },
        getStore(key) {
            return JSON.parse(sessionStorage.getItem(key));
        }
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
