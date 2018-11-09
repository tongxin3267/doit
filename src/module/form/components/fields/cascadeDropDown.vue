<template>
  <div class="field-content">
		<div class="drop-field">
			<select class="drop-down drop-down1"
							:class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
							:disabled="field.disabled || field.readonly"
							@change="setValue($event, field)">
				<option v-for="choice in field.choices" :selected="choice._id == key" :value="choice._id">{{(choice.value==='请选择'&&field.disabled)?'':choice.value}}</option>
			</select>
		</div>
    <div class="drop-field">
			<select class="drop-down drop-down2"
							:class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
							:disabled="field.disabled || field.readonly"
							@change="setChildValue($event, field)">
				<option v-for="choice in childChoices" :selected="choice.value == val" :value="choice.value">{{(choice.value==='请选择'&&field.disabled)?'':choice.value}}</option>
			</select>
		</div>
  </div>
</template>
<script>
	import {field_validation} from './validation.js'
  export default {
    props:['field'],
    data(){
      return{
        key:'',
        val:'',
        first:''
      }
    },
    created(){
      this.field.choices.unshift({
        value:'请选择',
        _id:''
      })
      var field = this.field;
      if(!field.value){
        this.val = '请选择';
      }else{
        var value = field.value;
        var arry = value.split(':');
        this.key = arry[0].split('_')[0];
        this.val = arry[1];
      }
    },
		computed:{
			childChoices(){
				this.field.childChoices = [{value:'请选择'}];
				if(this.key){
					for( var item of this.field.choices){
						if(item._id == this.key){
							for(var obj of item.sub_choices){
								this.field.childChoices.push(obj)
							}
							break;
						}
				}
				return this.field.childChoices
			}else{
				return this.field.childChoices;
				}
			},
		},
    methods:{
      setValue({target},field){
        var isVal = field.value ? true : false;
        var key = field._id;
        var value = target.value;
        var first = '';
        if(value){
          for( var item of field.choices){
            if(item._id == value){
              this.first = first = item.value;
              break;
						}
          }
        }
        this.key = value;
        this.val = '';
        var result = value+ '_'+first+':'
				if(!first){
					result = ''
				}
        this.$emit('change',{key:key,value:result});
        if(isVal){
          field_validation(field);
        }
      },
      setChildValue({target},field){
        var key = field._id;
        this.val = target.value !="请选择"?target.value:'';
        var result = this.key+'_'+this.first+':'+this.val;
        this.$emit('change',{key:key,value:result});
        field_validation(field);
      }
    }
  }
</script>
<style scoped>
	.field-content .drop-down1{
		border-bottom-right-radius:0;
		border-bottom-left-radius:0;
		border-bottom: 1px dashed #e5e5e5;
	}
	.drop-down2 {
		border-top: none;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	.drop-field{
		position: relative;
	}
  select {
    background: #fff;
  }
 	.drop-field:after{
		content: '';
		width: 16px;
		height: 13px;
		position: absolute;
		right: 12px;
		top: 17px;
		background: url(../../../../assets/images/icon_form_subform-shrink.png) no-repeat;
    background-size: 100%;
	}
</style>
