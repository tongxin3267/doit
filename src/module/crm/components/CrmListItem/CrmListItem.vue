/**
  * @param itemData(默认:{})：列表项参数
  *          {
  *              id: item.id,  // 列表id
  *              top: item.clientName,  // 头部栏标题
  *              showDel: true,  // 是否显示删除按钮
  *              showTab: false,  // 是否显示状态标签
  *              tabClass: '',  // 状态标签的类名 status_gray、status_blue、status_green、status_red、status_orange
  *              tabName: '',  // 状态标签名称
  *              selectEvent: null,  // 选择选项的回调函数
  *              mid: [  // 中间栏配置
  *                  {
  *                      title: '客户类别：',  // 中间栏项名称
  *                      value: item.typeNames  // 中间栏项值
  *                  }
  *              ],
  *              bottom: {
  *                  isShowAvator: true,  // 是否显示头像和创建人信息
  *                  msg: {
  *                      avatorUrl: item.headPic,  // 头像路径
  *                      avatorName: item.personName  // 创建人名称
  *                  },
  *                  data: [
  *                      {
  *                          title: '更新时间：',  // 底部栏项名称
  *                          value: item.updateTime  // 底部栏项值
  *                           titleColor: '#999',  // 标题颜色
  *                           fontSize: '14px',  // 字体大小
  *                           valueColor: '#666'  // 值字体颜色
  *                      }
  *                  ]
  *              },
  *              callBackVal: {}  // 返回自己想要返回的数据(不填写即没有)
  *          }
  * @example
  *     <crm-list>
  *         <crm-list-item :itemData="itemData"></crm-list-item>
  *     </crm-list>
  */
<template>
    <div class="crm_list_item" @click="goDetail">
        <label 
            :for="`crm_checkBox${itemIdx}`" 
            class="crm_label_box" 
            @click.stop 
            v-show="oneLine"
        ></label>
        <div class="check_wrap" v-if="itemData.canSelect">
            <input 
                type="checkbox" 
                class="icon_check"
                :checked="value"
                @click.stop="selectToggle($event)"
                :id="`crm_checkBox${itemIdx}`"
            />
        </div>
        <div :class="[canSelect? 'w90p' : 'w100p']">
            <div class="list_item_top" :class="{ellipsis:isEllipsis}">
                <span 
                    v-if="itemData.showTab" 
                    class="contract-status" 
                    :class="itemData.tabClass"
                >{{itemData.tabName}}</span>
                {{itemData.top}}
            </div>
            <div class="list_item_mid">
                <div
                    class="mid_inner"
                    v-for="(item,idx) in itemData.mid"
                    :key="idx"
                    :style="{'font-size': item.fontSize? item.fontSize : 'inherit'}"
                >
                    <span :style="{color: item.titleColor? item.titleColor : 'inherit'}">{{item.title}}</span>
                    <span :style="{color: item.valueColor? item.valueColor : 'inherit'}">{{item.value}}</span>
                </div>
            </div>
            <div class="list_item_bottom">
                <div class="item_msg_wrap" v-if="itemData.bottom.isShowAvator">
                    <img class="list_item_avator" 
                        :src="!itemData.bottom.msg.avatorUrl || itemData.bottom.msg.avatorUrl == '0'? defaultAvator : itemData.bottom.msg.avatorUrl"
                    >
                    <span class="avator_name">{{itemData.bottom.msg.avatorName}}</span>
                </div>
                <div 
                    v-for="(item,idx) in itemData.bottom.data" 
                    :key="idx"
                    class="mr15"
                    :style="{'font-size': item.fontSize? item.fontSize : 'inherit'}"
                >
                    <span :style="{color: item.titleColor? item.titleColor : 'inherit'}">{{item.title}}</span>
                    <span :style="{color: item.valueColor? item.valueColor : 'inherit'}">{{item.value}}</span>
                </div>
            </div>
            <div 
                class="list_del_wrap"
                :class="{right_del:rightDel}" 
                v-if="itemData.showDel || false" 
                @click.stop="delItem"
            >
                <div class="list_del">
                    <i class="list_del_icon"></i><span v-if="!rightDel">删除</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import avator from '@/assets/images/touxiang02.png';
export default {
    name: 'CrmListItem',
    props: {
        // 列表项配置
        itemData: {
            type: Object,
            default: {}
        },

        // 标题是否自动省略
        isEllipsis: {
            type: Boolean,
            default: false
        },

        // 删除图标是否在列表项右边
        rightDel: {
            type: Boolean,
            default: false
        },

        // 是否可以选择选项
        canSelect: {
            type: Boolean,
            default: false
        },
        
        // checkbox框的值
        value: {
            type: [String, Boolean, Number]
        },

        // 列表项的索引值
        itemIdx: {
            type: Number
        },

        // 是否点击一整行可以触发选择框
        oneLine: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            // 默认头像
            defaultAvator: avator,

            testValue: ''
        }
    },
    methods: {
        // 跳转详情
        goDetail () {
            this.$emit('click');
        },

        // 删除列表项
        delItem () {
            this.$emit('delEvent');
        },

        // 点击选择框
        selectToggle (e) {
            this.$emit('input', e.target.checked)
        }
    }
}
</script>
<style lang="scss">
@import './CrmListItem.scss';
</style>


