<template>
  <div class="field-content">
    <!--竖版布局  line_row为2横1竖-->
    <div v-if="field.line_row!=2">
		<!--没有填写关联表单-->
		<div class="cf-tit-box clearfix readOnly" v-if="field.disabled?children.length == 0:false" >未填写</div>

		<div v-for="(item, index) in children" :key="item.id" class="childForm-item">
        <div class="cf-tit-box clearfix" @click="toggle(item)">
          <div class="fl"><span class="childForm-item-icon" :class="{ 'icon-open':!item.isMax,'icon-shrink':item.isMax }"></span> <span>    {{index+1+'.'+field.label}}</span></div>
          <div class="fr" v-if="!field.disabled"><span @click.stop="deleteItem(index)" class="childForm-item-icon icon-delete"></span></div>
        </div>
        <child-item ref="mychild" :childItem="item.fields" :index="index" v-show="item.isMax"></child-item>
      </div>
    </div>
      <div v-if="!field.disabled" class="childForm-item-add" @click="selectData">选择数据</div>
    <!--<span @click="addPerson">添加</span>-->
  </div>
</template>
<script>

  import childItem from '../childItem.vue'
  import {cloneDeep} from '../../js/getData'
  export default {
    components:{
      childItem
    },
    props:['field'],
    created(){
      var show = this.field.ref_cfg.show_fields_array;
      //关联表单为不可编辑是给表单内的字段设置为不可编辑
			//关联表单字段设置为只读
        show.forEach(item=>{
          if(item){
            item.disabled = true;
            item.readonly = true;
            if(item.notes =='请选择'||item.notes =='请输入'){
              item.notes = '';
            }
          }
        })
      this.resetChildView();
    },
    data(){
      return {
        children:[],
      }
    },
    methods:{
      //重新改变this.children的数据，相当于重新渲染(只做渲染，不改数据),初始化的时候执行和，横版的时候执行
      resetChildView(){
        var value = this.field.value = this.field.value || [];
        //根据value和children赋值this.children
        this.children.splice(0,this.children.length)
        for(var i=0;i<value.length;i++){
          //关联的字段的数据
          var show_fields = this.field.ref_cfg.show_fields_array;
          var children = this.field.children;
					this.resetChildren(children);
          var combine = show_fields.concat(children);
          var str = JSON.stringify(combine);
          var fields = JSON.parse(str);
          var map = value[i];
          for(var j=0; j < fields.length; j++){
            //初始化默认值
            fields[j].value = map[fields[j]._id];
          }
          this.children.push({isMax:true,fields:fields})
        }
				this.field.views = this.children;
      },
      deleteItem(index){
				var _this = this;
				_.alert('提示','确定删除此关联表单？',{
					primaryBtn:{name:"i18n.confirm", callBack:function(){
						_this.field.value.splice(index, 1);
						_this.children.splice(index, 1);
						//重新设置子表单数据
						_this.setValue();
						//1.删除对应的children，2.删除state的data，3.删除this.field的value
						//执行统计的方法
						_this.$refs.mychild[0].statistic();
					}},
					defaultBtn:{name:"取消", callBack:null},
				})
      },
      toggle(item){
        item.isMax = !item.isMax;
      },
      setValue(){
        this.$store.commit('setValue',{key:this.field._id,value:this.field.value});
      },
      //只是对children的数据的删除和添加操作
      selectData(){
        //将当前的人员给到选人控件
        var _this = this;
        dataBase.selectForm.show = true;
        dataBase.selectForm.data.refItemKey = this.field._id;
        dataBase.selectForm.ref_cfg = this.field.ref_cfg;
        dataBase.selectForm.confirm = function(data){
          _this.field.value = data.selectedList;
          data.selectedList.forEach(item => {
            item.value = item.id+'_'+item[_this.field.ref_cfg.main_field];
          })
          _this.resetChildView();
          _this.setValue();
        }
        dataBase.selectForm.selectList = this.field.value
      },
			resetChildren(children){
				children.forEach(item =>{
					item.validations = item.validations || []
					item.readonly = item.validations.indexOf('uniqueness')!=-1?true:false;
					item.history = false;
					item.disabled = this.field.disabled;
					item.show = true;//是否显示的监听绑定
					if(item.notes == '请选择'||item.notes == '请输入'){
						item.notes = '';
					}
					//有最少长度时是添加必填
					if(item.minimum_length != '0' ){
						item.validations.push('presence');
					}
					item.help = '';
					//两级下拉框添加数据childChoices
					if (item._type == 'CascadeDropDown') {
						item.childChoices = [{value: '请选择'}];
					}
					//当子表单多行文本的字数无限制时，限制为2000
					if(item.maximum_length === 0){
						item.maximum_length = 2000;
					}
					//存在默认值时
				});
			},
    }
  }
</script>
