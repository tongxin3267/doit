<!--选择相关人和负责人组件（加号图标列表）-->
<template>
  <div class="qwui-user_select_box">
    <div class="qwui-user_select_charge" v-if="item && item.title" v-for="(item,index) in selectDataList">
      <div class="qwui-user_select_title display_flex">
        <div class="qwui-user_cell_title">{{item.title}}{{userNum(item)}}</div>
        <div class="qwui-user_cell_fr" v-if="item.loadLast.show">
          {{item.loadLast.name?item.loadLast.name:""}}
          <div class="qwui-user_cell_switch">
            <input type="checkbox" class="qwui-user_cell_input" @click="getLastPick(index)">
          </div>
        </div>
      </div>
      <div class="qwui-user_select_item">
        <div class="qwui-user_select_list">
          <ul>
            <li v-for="(deptList,i) in item.deptSelected" v-if="item.deptSelected && item.deptSelected.length>0">
              <a class="qwui-remove_icon" @click="removeThisDept(deptList.id,i,index)"></a>
              <p class="img qwui-dept_no_images"></p>
              <p class="qwui-user_select_person">{{deptList.departmentName||deptList.deptName}}</p>
            </li>

            <li v-for="(list,i) in item.userSelected"
                v-if="(i<limitLength && !item.deptSelected)||
                 ((item.deptSelected && item.deptSelected.length<=limitLength && i<limitLength-item.deptSelected.length))||
                   statusValue[index]">
              <a class="qwui-remove_icon" @click="removePerson(list.userId,i,index)" v-if="item.isOptional"></a>
              <p class="img" :class="{'active':list.headPic=='0'||list.headPic==''}">
                <img v-if="list.headPic!='0' && list.headPic!=''" :src="list.headPic" alt=""/>
              </p>
              <p class="qwui-user_select_person">{{list.personName}}</p>
            </li>
            <li class="qwui-user_select_add" @click="selectUserClick(item.userName)" v-if="item.isOptional"></li>
          </ul>
        </div>
        <!--)-->
        <div class="qwui-user_select_person_open"
             v-if="item.userSelected && (item.userSelected.length>4 || (item.deptSelected && (item.deptSelected.length+item.userSelected.length)>4))"
             @click="showAllPerson(index)">
          <span>
            {{statusValue[index]? $t('i18n.collapse'):$t('i18n.expand')}}
            {{item.userSelected.length +' '+ $t('i18n.members')}}
            {{item.deptSelected && item.deptSelected.length>0? ' , '+item.deptSelected.length +' '+ $t('i18n.department'):''}}
          </span>
          <a class="click_icon" :class="{'click_icon_up': statusValue[index]}"></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'userSelect',
    props:{
      userselect:Object,
      isUseLoadLast:Object
    },
    data() {
      return {
        limitLength:4,//限制4个数据
        statusValue:{'toPersonList': false,'ccPersonList':false},//用来控制选人后列表的 收起/展开
        isGetValue:{'toPersonList': false,'ccPersonList':false},//用来控制 加载上次 按钮 false为取消
        defaultHeadPic: require('../../assets/images/touxiang02.png')//没有头像时的默认头像
      }
    },
    created:function(){
      this.userselect.show=false;
    },
    computed:{
      selectDataList(){
        return this.userselect.selectList;
      }
    },
    methods:{
      defaultHeadpic(val) {
        if(!val){
          return DEFAULTPIC[this.selectType]
        }
        return val
      },
      //加载上次,传回一个string("toPersonList" 或者 "ccPersonList"),和一个布尔值(按钮 打开 或者 关闭)
      getLastPick:function (string) {
        this.isGetValue[string] = !this.isGetValue[string];
        this.$emit("confirmPick",string, this.isGetValue[string]);
      },
      //打开选人界面
      selectUserClick(type){
        if(this.userselect.selectList["toPersonList"]){
          this.userselect.selectList["toPersonList"].callBack.confirm = this.confirmSelect;
        }
        if(this.userselect.selectList["ccPersonList"]){
          this.userselect.selectList["ccPersonList"].callBack.confirm = this.confirmSelect;
        }
        this.$emit('selectUserClick',type)  //回调事件给父组件，让父组件判断是选择哪种类型的操作
        if(type=="relatives"){
          _.openSelectUser("ccPersonList");
        }else{
          _.openSelectUser("toPersonList");
        }
      },
      //确定选择
      confirmSelect(el,obj){
        this.$emit("selectPerson",el,this.dealString(obj));
      },
      userNum:function(item){
        let deptNum = item.deptSelected ? item.deptSelected.length : 0
        let userNum = item.userSelected ? item.userSelected.length : 0
        let num = Number(userNum)+ Number(deptNum)
        return '('+num+')';
      },
      //删除选中的人员
      removePerson(userId,index,signIndex){
        var data= this.userselect.selectList[signIndex];
        if(data.userSelected[index].userId==userId){
          data.userSelected.splice(index,1);
        }
        this.sendDelectAfter(data,signIndex);
      },
      //删除选中的部门
      removeThisDept(id,index,signIndex){
        var data= this.userselect.selectList[signIndex];
        if(data.deptSelected[index].id==id){
          data.deptSelected.splice(index,1);
        }
        this.sendDelectAfter(data,signIndex);
      },
      //删除后把数据传回父组件
      sendDelectAfter(data,signIndex){
        var obj={
          user:{data:[],idStr:""},
          dept:{data:[],idStr:""}
        };
        if(data.userSelected.length>0) {
          for (var i = 0; i < data.userSelected.length; i++) {
            obj.user.data.push(data.userSelected[i]);
            obj.user.idStr += data.userSelected[i].userId + '|';
          }
        }
        if(data.deptSelected && data.deptSelected.length>0) {
          for (var i = 0; i < data.deptSelected.length; i++) {
            obj.dept.data.push(data.deptSelected[i]);
            obj.dept.idStr += data.deptSelected[i].id + '|';
          }
        }
        this.$emit("selectPerson",signIndex,this.dealString(obj));
      },
      //处理字符串方法
      dealString(obj){
        var strUser=obj.user.idStr.charAt(obj.user.idStr.length-1);
        var strDept=obj.dept.idStr.charAt(obj.dept.idStr.length-1);
        if(strUser.endsWith("|")){
          obj.user.idStr = obj.user.idStr.substring(0, obj.user.idStr.lastIndexOf("|"));
        }
        if(strDept.endsWith("|")){
          obj.dept.idStr = obj.dept.idStr.substring(0, obj.dept.idStr.lastIndexOf("|"));
        }
        return obj;
      },
      showAllPerson:function (index) {
        this.statusValue[index] = !this.statusValue[index];
      },
    }
  }
</script>
<style>
  .display_flex{
    display:flex
  }
.qwui-user_cell_fr{
display: flex;
text-align: right;
color: #999;
}
.qwui-user_cell_title{
  flex: 1;
  color: #999;
  line-height: 20px;
}
.qwui-user_cell_switch{
  flex: 1;
  padding-left: 10px;
  font-size: 0;
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
