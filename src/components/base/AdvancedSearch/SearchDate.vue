<template>
    <div class="date">
        <div class="origin" v-if="originShow" >
            <date-time
                v-model="startTime"
                class="time"
                clear-text="清空"
                @on-clear="clearStartTime"
                :format="field.format"
                @on-change="change()"
                year-row="{value}年" month-row="{value}月" day-row="{value}日"
                confirm-text="确认" cancel-text="取消">
                <input
                    class="SS_input"
                    type="text"
                    placeholder="请选择"
                    v-model="startTime" disabled>
            </date-time>
            <span class="SS_blank">~</span>
            <date-time
                v-model="endTime"
                class="time"
                :start-date="resetLimitDate"
                clear-text="清空"
                @on-clear="clearEndTime"
                :format="field.format"
                @on-change="change()"
                year-row="{value}年" month-row="{value}月" day-row="{value}日"
                confirm-text="确认" cancel-text="取消">
                <input
                    class="SS_input"
                    type="text"
                    placeholder="请选择"
                    v-model="endTime" disabled>
            </date-time>
        </div>
        <div class="diy" v-if="!originShow">
            <input
                class="SS_input time"
                type="text"
                placeholder="请选择"
                v-model="startTime"
                @click="showPicker('startTime')"
                readonly>
            <span class="SS_blank">~</span>
            <input
                class="SS_input time"
                type="text"
                placeholder="请选择"
                v-model="endTime"
                @click="showPicker('endTime')"
                readonly>
            <time-picker
                :data="field.dateValue"
                ref="startTime"
                @select="handleSelect(arguments, 'startTime')"
                :selected-index="startSelectedArr.length > 0 ? startSelectedArr : field.default"
                cancel-txt="取消" confirm-txt="确定"></time-picker>
            <time-picker
                :data="field.dateValue"
                ref="endTime"
                @select="handleSelect(arguments, 'endTime')"
                :selected-index="endSelectArr.length > 0 ? endSelectArr : field.default"
                cancel-txt="取消" confirm-txt="确定"></time-picker>
        </div>
    </div>
</template>

<script>
import dateTime from 'vux/src/components/datetime';
import * as timeUtil from '../../../assets/js/time-util';
import timePicker from '@/components/picker/index'

export default {
    name: 'dateField',
    components: {
        dateTime,
        timePicker
    },
    props: {
        searchValue: Object,
        setting: Array,
        field: Object
    },
    data() {
        return {
            startKey: this.field.key[0],
            endKey: this.field.key[1],
            startTime: '',
            endTime: '',
            resetLimitDate: '',
            startSelectedArr: [],
            endSelectArr: []
        }
    },
    computed: {
        originShow() {
            return this.field.dateType == 'DIY' ? false : true;
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            if(!this.searchValue[this.startKey]) {
                return
            }

            let startTime = '', // 显示的字符串
                endTime = '';

            if(this.field.dateType == 'DIY') {
                let startArr = this.searchValue[this.startKey].split('-'), // searchValue按'-'分隔以后的数组
                    endArr = this.searchValue[this.endKey].split('-'),
                    startSelectedArr = [], // 选中的数组
                    endSelectArr = [];

                this.field.dateValue.forEach((item, index) => {
                    item.forEach((itm, indx) => {
                        if(startArr[index] == itm.value) {
                            startTime += itm.text;
                            startSelectedArr.push(indx)
                        }
                        if(endArr[index] == itm.value) {
                            endTime += itm.text;
                            endSelectArr.push(indx)
                        }
                    })
                })
                this.startSelectedArr = startSelectedArr;
                this.endSelectArr = endSelectArr;
            } else {
                startTime = this.searchValue[this.startKey];
                endTime = this.searchValue[this.endKey];
            }
            this.startTime = startTime;
            this.endTime = endTime;
        },
        change() {
            this.searchValue[this.startKey] = this.startTime;
            this.searchValue[this.endKey] = this.endTime;
        },
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
        showPicker(type) {
            this.$refs[type].show();
        },
        handleSelect(args, type) {
            let time = '',
                searchValue = '',
                dateValue = this.field.dateValue;

            for(let i = 0; i < dateValue.length; i++) {
                time += args[2][i];
                searchValue += dateValue[i][args[1][i]].value;
                if(i != dateValue.length - 1) {
                    searchValue += '-';
                }
            }
            switch(type) {
                case 'startTime': this.startTime = time;
                                  this.searchValue[this.startKey] = searchValue;
                                  break;
                case 'endTime': this.endTime = time;
                                this.searchValue[this.endKey] = searchValue;
                                break;
            }
        }
    },
    watch: {
        startTime(val) {
            this.resetLimitDate = val.substring(0,10);
        },
        searchValue: {
            handler(val) {
                if(!val[this.startKey] && !val[this.endKey]) {
                    this.reset();
                }
            },
            deep: true
        }

    }
}
</script>

<style scoped>
.origin, .diy{
    display: flex;
}
.time {
    flex: 4;
}
.time input {
    width: 100%;
}
.date .SS_blank {
    flex: 0.5;
}
.SS_blank {
    display: inline-block;
    line-height: 36px;
    width: 10%;
    text-align: center;
}
.SS_input {
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
.weui-cell {
    padding: 0;
}
</style>
