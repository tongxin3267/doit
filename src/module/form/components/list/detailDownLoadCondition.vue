<template>
    <div class="downLoad-condition">
        <div class="header">
            <div class="title">下载条件</div>
            <div class="close-btn" @click="close"></div>
        </div>
        <div class="main" :style="{height: mainHeight}">
            <div class="form-control">
                <label class="control-label">数据范围</label>
                <ul class="data-scope clearfix">
                    <li class="option" :class="{active: index == currIndex}"
                        v-for="(item, index) in dataScope"
                        :key="item.text" @click="currIndex = index">{{item.text}}</li>
                </ul>
            </div>
            <div class="form-control">
                <label class="control-label">创建日期</label>
                <date-time
                    v-model="startTime"
                    class="time"
                    clear-text="清空"
                    @on-clear="clearStartTime">
                    <input
                        class="input"
                        type="text"
                        placeholder="请选择"
                        v-model="startTime" disabled>
                </date-time>
                <span class="blank">~</span>
                <date-time
                    v-model="endTime"
                    class="time"
                    :start-date="resetLimitDate"
                    clear-text="清空"
                    @on-clear="clearEndTime">
                    <input
                        class="input"
                        type="text"
                        placeholder="请选择"
                        v-model="endTime" disabled>
                </date-time>
            </div>
            <div class="pullOut-comment">
                导出评论
                <div class="qwui-user_cell_switch">
                    <input type="checkbox" class="qwui-user_cell_input" @click="pullOut">
                </div>
            </div>
        </div>
        <flow-button :buttondata="buttonConfig"></flow-button>
        <dialog-mask-bottom :dialogConfig="dialogListConfig" ></dialog-mask-bottom>
    </div>
</template>

<script>
import dateTime from 'vux/src/components/datetime';
import flowButton from '@/components/button/flow_button';
import { isExistRunTask, downloadMx } from '../../api/list'
import dialogMaskBottom from '@/components/base/dialog_mask_bottom';

export default {
    name: 'downLoadCondition',
    props: {
        type: Number,
        id: String,
        keyWord: String
    },
    components: {
        dateTime,
        flowButton,
        dialogMaskBottom
    },
    data() {
        return {
            mainHeight: window.innerHeight - 45 - 60 + 'px',
            dialogListConfig: {
                show: false,
                title: '',
                btnConfig: []
            },
            dataScope: [
                { text: '全部', value: '0' }, 
                { text: '我创建的', value: '3' }, 
                { text: '我负责的', value: '1' }, 
                { text: '我相关的', value: '2' }
            ],
            currIndex: 0,
            startTime: '',
            endTime: '',
            resetLimitDate: '',
            buttonConfig:{  //操作按钮
                primaryList: [{ type: "primary", name: '下载', callBack: this.startDownLoad }],
                defaultList: [{ type: "default", name: '取消', callBack: this.close }],
                style: { class: "active" }
            },
            pullOutComment: 0
        }
    },
    computed: {
        searchValue() {
            return {
                'keyWord': this.keyWord,
                'searchValue.definitionVersionsId': this.id,
                'searchValue.status': '',
                'searchValue.searchType': this.dataScope[this.currIndex].value,
                'searchValue.isExportComment': this.pullOutComment,
                'searchValue.startTime': this.startTime,
                'searchValue.endTime': this.endTime
            }
        }
    },
    methods: {
        clearStartTime () {
            this.startTime = '';
        },
        clearEndTime () {
            this.endTime = '';
        },
        reset() {
            this.startTime = "";
            this.endTime = "";
            this.resetLimitDate = "";
        },
        pullOut() {
            this.pullOutComment = this.pullOutComment ? 0 : 1 
        },
        close() {
            this.$emit('close')
        },
        startDownLoad() { // 点击下载按钮
            console.log(this.searchValue);
            let startTime = this.startTime,
                endTime = this.endTime;
            if(startTime == "" || endTime == "") {
                return _.alert('提示', '日期筛选不能为空');    
            }
            
            // 判断时间是否大于60天
            let startDate = new Date(startTime),
                endDate = new Date(endTime),
                dateDeffer = endDate.getTime() - startDate.getTime(),
                dayDeffer = dateDeffer / (24 * 60 * 60 * 1000);
            if (Math.floor(dayDeffer) > 62) {
                return _.alert('提示', "筛选日期区间仅允许两个月以内");
            }
            
            let searchTypeValue = '',
                searchType = this.dataScope[this.currIndex].value;
            if(this.type == 0) {
                if (searchType == 0) {
                    searchTypeValue = "全部";
                } else if (searchType == 1) {
                    searchTypeValue = "我负责的";
                } else if (searchType == 2) {
                    searchTypeValue = "我相关的";
                } else if (searchType == 3) {
                    searchTypeValue = "我创建的";
                } else {
                    return _.alert('提示', "选择的数据类型有误，请刷新页面重新选择");
                }
            }
            _.alert('提示', "您确定下载 “ " + startTime + "至" + endTime + searchTypeValue + " ” 数据吗？", 
                {   primaryBtn: { name: '确定', callBack: this.isExistRunTask},
                    defaultBtn: { name: '取消', callBack: null}
                });
        },
        isExistRunTask() { // 后台是否存在正在下载中的明细数据
            isExistRunTask(this.searchValue).then(res => {
                if (res.code != 0) {
                    _.alert("提示", res.desc);   
                }
                if (res.data.fileName) {
                    _.alert('提示', "已找到相同查询条件的下载：【" + res.data.fileName + "】是否重新下载？", 
                    {   primaryBtn: { name: '确定', callBack: this.downloadMx},
                        defaultBtn: { name: '取消', callBack: null}
                    });
                } else {
                    this.downloadMx();
                }
            })
        },
        downloadMx() {
            _.showLoading("加载中", true);
            downloadMx(this.searchValue).then(res => {
                _.hideLoading();
                if (res.code != 0) {
                    _.alert("提示", res.desc);
                }
                this.close();
                _.alert("提示", "明细文件生成中，稍后将推送到<br>应用主界面，消息可能会有延时<br>请耐心等待");
            })
        }
    }

}
</script>

<style scoped>
.downLoad-condition {
    position: fixed;
    top: 0;
    z-index: 11;
    width: 100%;
    background-color: #f5f5f5;
}
@media screen and (min-width: 1024px) {
    .downLoad-condition {
        width: 740px;
        margin: auto;
    }
}
.header {
    position: relative;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    background: #fff;
    padding-left: 15px;
}
.header:before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e6e6e6;
}
.close-btn {
    float: right;
    width: 45px;
    height: 100%;
    text-align: center;
    cursor: pointer;
}
.close-btn:after {
    background: url(../../../../assets/images/CSSSprites.png) no-repeat;
    content: '';
    width: 13px;
    height: 13px;
    position: absolute;
    background-position: -30px 0;
    top: 15px;
    right: 15px;
}
.main {
    padding: 0 15px;
}
.pullOut-comment {
    margin-top: 15px;
    font-size: 13px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #ddd;
    border-left: none;
    border-right: none;
    color: #999;
}
.control-label {
    display: block;
    padding: 10px 0;
    color: #999;
    font-size: 13px;
}
.option {
    float: left;
    padding: 0 15px;
    margin-right: 7px;
    height: 35px;
    line-height: 35px;
    color: #333;
    font-size: 14px;
    border: 1px #ddd solid;
    border-radius: 3px;
    margin-top: 5px;
    list-style: none;
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
}
.option.active {
    position: relative;
    color: #0D68C6;
    border: 1px #0D68C6 solid;
}
.option.active:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    background: url(../../../../assets/images/icon-checked.png) no-repeat;
    background-size: 16px 16px;
}
.time {
    flex: 4;
}
.blank {
    display: inline-block;
    line-height: 36px;
    flex: 0.5;
    text-align: center;
}
.input {
    display: inline-block;
    width: 45%;
    height: 36px;
    padding: 0 5px;
    box-sizing: border-box;
    outline: none;
    border: none;
    line-height: 36px;
    border-radius: 2px;
    font-size: 14px;
    color: #333;
    background-color: #fff;
}
.qwui-user_cell_switch{
    float: right;
    position: relative;
    top: 50%;
    font-size: 0;
    transform: translateY(-50%);
}
.qwui-user_cell_input{
    position: relative;
    width: 40px;
    height: 22px;
    border: 1px solid #dfdfdf;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    cursor: pointer;
    appearance: none;
    transition: background-color 0.1s, border 0.1s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.qwui-user_cell_input:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 38px;
    height: 20px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.qwui-user_cell_input:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.qwui-user_cell_input:checked{
    border-color: #4C84C4;
    background-color: #4C84C4;
}
.qwui-user_cell_input:checked:before{
    -webkit-transform: scale(0);
    transform: scale(0);
}
.qwui-user_cell_input:checked:after{
    -webkit-transform: translateX(18px);
    transform: translateX(18px);
}
</style>

