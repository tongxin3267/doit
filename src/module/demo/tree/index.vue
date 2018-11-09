<template>
  <div class="treeListWrap">
    <qw-tree-list
      :treeListShow.sync="treeListShow"
      :options="options"
      :config="config"
      :currentId="currentId"
      :renderData="renderData"
      @showNextItem="showNextItem"
      @scrollFun="scrollFun"
      @returnBack="returnBack"
      @confirmSelected="confirmSelected"
      @showSelectedItem="showSelectedItem"
    >
    </qw-tree-list>
  </div>
</template>

<script>
  import QwTreeList from '@/components/tree/treeList'
  const config = {
    id: 'id',
    title: 'typeName',
    hasChildren: 'hasChildren',
    checkType: 'checkbox',
    headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/industry_type.png'
  }
  const data = [
      {
        "childrenNum": 0,
        "createTime": {
          "date": 23,
          "day": 3,
          "hours": 11,
          "minutes": 20,
          "month": 4,
          "seconds": 12,
          "time": 1527045612000,
          "timezoneOffset": -480,
          "year": 118
        },
        "creator": "test12",
        "ext1": "b122ea53-e525-4676-be14-72657adb0643",
        "ext2": "默默个人类别1",
        "ext3": "1",
        "hasChildren": true,
        "id": "b122ea53-e525-4676-be14-72657adb0643",
        "headPic": "http://shp.qpic.cn/bizmp/ck4hSGq23RjumeoGuXVhnNtXWaMV2EKKrgu7xbQGavrcMsFX5JYo0Q/100",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 0,
        "status": "",
        "typeCode": "momo",
        "typeName": "默默个人类别1"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 17,
          "day": 3,
          "hours": 15,
          "minutes": 34,
          "month": 4,
          "seconds": 34,
          "time": 1495006474000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "default",
        "ext1": "3d1f3b1274c24487a6ede15287c5e13e",
        "ext2": "VIP2客户",
        "ext3": "1",
        "hasChildren": false,
        "id": "3d1f3b1274c24487a6ede15287c5e13e",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 1,
        "status": "",
        "typeCode": "",
        "typeName": "VIP2客户"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 26,
          "day": 1,
          "hours": 9,
          "minutes": 16,
          "month": 2,
          "seconds": 15,
          "time": 1522026975000,
          "timezoneOffset": -480,
          "year": 118
        },
        "creator": "test12",
        "ext1": "29e92270-904f-449f-854b-5a629697d695",
        "ext2": "SVIP",
        "ext3": "1",
        "hasChildren": false,
        "id": "29e92270-904f-449f-854b-5a629697d695",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 1,
        "status": "",
        "typeCode": "123",
        "typeName": "SVIP"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 17,
          "day": 3,
          "hours": 15,
          "minutes": 34,
          "month": 4,
          "seconds": 34,
          "time": 1495006474000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "default",
        "ext1": "212199501eb84c6c950709999cf7eff0",
        "ext2": "普通客户",
        "ext3": "1",
        "hasChildren": false,
        "id": "212199501eb84c6c950709999cf7eff0",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 2,
        "status": "",
        "typeCode": "",
        "typeName": "普通客户"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 19,
          "day": 1,
          "hours": 14,
          "minutes": 56,
          "month": 5,
          "seconds": 38,
          "time": 1497855398000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "test12",
        "ext1": "0837431f-9fea-4832-8667-bcef99b63b30",
        "ext2": "阿东客户",
        "ext3": "1",
        "hasChildren": true,
        "id": "0837431f-9fea-4832-8667-bcef99b63b30",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 2,
        "status": "",
        "typeCode": "",
        "typeName": "阿东客户"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 27,
          "day": 1,
          "hours": 10,
          "minutes": 43,
          "month": 10,
          "seconds": 29,
          "time": 1511750609000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "test12",
        "ext1": "4390979c-d775-4990-abe5-78253c2ab3d6",
        "ext2": "VIP客户",
        "ext3": "1",
        "hasChildren": true,
        "id": "4390979c-d775-4990-abe5-78253c2ab3d6",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 2,
        "status": "",
        "typeCode": "",
        "typeName": "VIP客户"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 30,
          "day": 6,
          "hours": 16,
          "minutes": 54,
          "month": 8,
          "seconds": 14,
          "time": 1506761654000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "test12",
        "ext1": "bbc5dd6f-b564-4691-a855-6d4014f81467",
        "ext2": "测试0930",
        "ext3": "1",
        "hasChildren": false,
        "id": "bbc5dd6f-b564-4691-a855-6d4014f81467",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 2,
        "status": "",
        "typeCode": "222",
        "typeName": "测试0930"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 17,
          "day": 3,
          "hours": 15,
          "minutes": 34,
          "month": 4,
          "seconds": 34,
          "time": 1495006474000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "default",
        "ext1": "56adbd67ebc44a9dbc30d04ba15342aa",
        "ext2": "潜在客户",
        "ext3": "1",
        "hasChildren": false,
        "id": "56adbd67ebc44a9dbc30d04ba15342aa",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 3,
        "status": "",
        "typeCode": "",
        "typeName": "潜在客户"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 19,
          "day": 1,
          "hours": 14,
          "minutes": 57,
          "month": 5,
          "seconds": 9,
          "time": 1497855429000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "test12",
        "ext1": "61cd92eb-8df1-4eb2-9e88-74c539a36854",
        "ext2": "接入客户（非KA）",
        "ext3": "1",
        "hasChildren": false,
        "id": "61cd92eb-8df1-4eb2-9e88-74c539a36854",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 3,
        "status": "",
        "typeCode": "",
        "typeName": "接入客户（非KA）"
      },
      {
        "childrenNum": 0,
        "createTime": {
          "date": 17,
          "day": 3,
          "hours": 15,
          "minutes": 34,
          "month": 4,
          "seconds": 34,
          "time": 1495006474000,
          "timezoneOffset": -480,
          "year": 117
        },
        "creator": "default",
        "ext1": "9fca0f7f93d54d1096473f1c946ced92",
        "ext2": "其他",
        "ext3": "1",
        "hasChildren": false,
        "id": "9fca0f7f93d54d1096473f1c946ced92",
        "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
        "parentId": "0",
        "sendTarget": "",
        "sortNum": 4,
        "status": "",
        "typeCode": "",
        "typeName": "其他"
      }
    ]
  export default {
    name: "treeDemo",
    components: {
      QwTreeList,
    },
    data() {
      return {
        config: config,
        options: null,
        renderData: {},
        parentId:'',
        currentId:'',
        lock_roll: false,
        treeListShow: true,
      }
    },
    created() {
      this.options = data
      this.currentId=this.options[0].parentId
      this.renderData[this.currentId]=[]
      this.renderData[this.currentId].push(...data)
    },
    methods: {
      getData(id) {
        let self = this
        let data = [
          {
            "childrenNum": 0,
            "createTime": {
              "date": 23,
              "day": 3,
              "hours": 11,
              "minutes": 20,
              "month": 4,
              "seconds": 12,
              "time": 1527045612000,
              "timezoneOffset": -480,
              "year": 118
            },
            "creator": "test12",
            "ext1": "b122ea53-e525-4676-be14-72657adb0643",
            "ext2": "默默个人类别1",
            "ext3": "1",
            "hasChildren": true,
            "id": "1",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "b122ea53-e525-4676-be14-72657adb0643",
            "sendTarget": "",
            "sortNum": 0,
            "status": "",
            "typeCode": "momo",
            "typeName": "默默个人类别1"
          },
          {
            "childrenNum": 0,
            "createTime": {
              "date": 17,
              "day": 3,
              "hours": 15,
              "minutes": 34,
              "month": 4,
              "seconds": 34,
              "time": 1495006474000,
              "timezoneOffset": -480,
              "year": 117
            },
            "creator": "default",
            "ext1": "3d1f3b1274c24487a6ede15287c5e13e",
            "ext2": "VIP2客户",
            "ext3": "1",
            "hasChildren": false,
            "id": "2",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "b122ea53-e525-4676-be14-72657adb0643",
            "sendTarget": "",
            "sortNum": 1,
            "status": "",
            "typeCode": "",
            "typeName": "气味的方式的"
          },
          {
            "childrenNum": 0,
            "createTime": {
              "date": 26,
              "day": 1,
              "hours": 9,
              "minutes": 16,
              "month": 2,
              "seconds": 15,
              "time": 1522026975000,
              "timezoneOffset": -480,
              "year": 118
            },
            "creator": "test12",
            "ext1": "29e92270-904f-449f-854b-5a629697d695",
            "ext2": "SVIP",
            "ext3": "1",
            "hasChildren": false,
            "id": "3",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "b122ea53-e525-4676-be14-72657adb0643",
            "sendTarget": "",
            "sortNum": 1,
            "status": "",
            "typeCode": "123",
            "typeName": "SVIP"
          },
          {
            "childrenNum": 0,
            "createTime": {
              "date": 17,
              "day": 3,
              "hours": 15,
              "minutes": 34,
              "month": 4,
              "seconds": 34,
              "time": 1495006474000,
              "timezoneOffset": -480,
              "year": 117
            },
            "creator": "default",
            "ext1": "9fca0f7f93d54d1096473f1c946ced98",
            "ext2": "其他",
            "ext3": "1",
            "hasChildren": false,
            "id": "4",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "b122ea53-e525-4676-be14-72657adb0643",
            "sendTarget": "",
            "sortNum": 4,
            "status": "",
            "typeCode": "",
            "typeName": "广州地产"
          }
        ]
        return new Promise(resolve => {
          setTimeout(() => {
            self.options.push(...data);
            this.renderData[0].push(...data)
            self.lock_roll=true
            resolve();
          }, 2000);
        });
      },
      showNextItem(option) {
        let self = this
        let data = [
          {
            "childrenNum": 0,
            "createTime": {
              "date": 23,
              "day": 3,
              "hours": 11,
              "minutes": 20,
              "month": 4,
              "seconds": 12,
              "time": 1527045612000,
              "timezoneOffset": -480,
              "year": 118
            },
            "creator": "test12",
            "ext1": "b122ea53-e525-4676-be14-72657adb0643",
            "ext2": "默默个人类别1",
            "ext3": "1",
            "hasChildren": true,
            "id": "1",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "0",
            "sendTarget": "",
            "sortNum": 0,
            "status": "",
            "typeCode": "momo",
            "typeName": "默默个人类别1"
          },
          {
            "childrenNum": 0,
            "createTime": {
              "date": 17,
              "day": 3,
              "hours": 15,
              "minutes": 34,
              "month": 4,
              "seconds": 34,
              "time": 1495006474000,
              "timezoneOffset": -480,
              "year": 117
            },
            "creator": "default",
            "ext1": "3d1f3b1274c24487a6ede15287c5e13e",
            "ext2": "VIP2客户",
            "ext3": "1",
            "hasChildren": false,
            "id": "2",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "0",
            "sendTarget": "",
            "sortNum": 1,
            "status": "",
            "typeCode": "",
            "typeName": "气味的方式的"
          },
          {
            "childrenNum": 0,
            "createTime": {
              "date": 26,
              "day": 1,
              "hours": 9,
              "minutes": 16,
              "month": 2,
              "seconds": 15,
              "time": 1522026975000,
              "timezoneOffset": -480,
              "year": 118
            },
            "creator": "test12",
            "ext1": "29e92270-904f-449f-854b-5a629697d695",
            "ext2": "SVIP",
            "ext3": "1",
            "hasChildren": false,
            "id": "3",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "0",
            "sendTarget": "",
            "sortNum": 1,
            "status": "",
            "typeCode": "123",
            "typeName": "SVIP"
          },
          {
            "childrenNum": 0,
            "createTime": {
              "date": 17,
              "day": 3,
              "hours": 15,
              "minutes": 34,
              "month": 4,
              "seconds": 34,
              "time": 1495006474000,
              "timezoneOffset": -480,
              "year": 117
            },
            "creator": "default",
            "ext1": "9fca0f7f93d54d1096473f1c946ced98",
            "ext2": "其他",
            "ext3": "1",
            "hasChildren": false,
            "id": "4",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "parentId": "0",
            "sendTarget": "",
            "sortNum": 4,
            "status": "",
            "typeCode": "",
            "typeName": "广州地产"
          }
        ]
        return new Promise(resolve => {
          setTimeout(() => {
            self.options.length = 0
            self.options=[...data];
            self.renderData[option.id] = [...data]
            self.currentId = option.id
            self.parentId = option.parentId
            resolve();
          }, 2000);
        });
      },
      scrollFun(){
        if(!this.lock_roll){
          this.getData()
        }
      },
      // 返回上一级
      returnBack() {
        this.currentId = this.parentId
        this.options = [...this.renderData[this.parentId]]
      },
      confirmSelected(payload) {
      },
      showSelectedItem(payload) {
        console.log(payload)
      }
    }
  }
</script>

<style scoped>
  .treeListWrap {
    position: relative;
    width: 100%;
  }
</style>
