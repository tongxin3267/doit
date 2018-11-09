<template>
  <div class="f-item">
    <div class="f-add-user clearfix">
        <div class="f-add-user-list">
          <ul class="clearfix">
            <li v-for="item in userConfig.users">
              <a v-show="userConfig.canRemove" class="remove_icon" style="display: inline;"></a>
              <p class="img"><img :src="item.headPic" alt=""></p>
              <p class="name">{{item.personName}}</p>
            </li>
            <li class="ico-add" v-if="userConfig.isAdd"></li>
          </ul>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
//    props:['userConfig'],
    data(){
      return {
        userConfig:{
          canRemove:true,
          isAdd:true,
          users:[{
            "attribute": 0,
            "birthday": "",
            "childrenList": [],
            "corpId": "wx05ab253814890c89",
            "createTime": "2016-05-06 15:51:59",
            "departmentName": "",
            "deptId": "",
            "email": "",
            "entryTime": "2016-05-13 00:00:00",
            "headPic": "http://shp.qpic.cn/bizmp/ck4hSGq23Ria1f6HbTeHsZIjrDTSuYJcRGOUF7bVPCziaOb4ialoNqyqA/100",
            "id": "7bcac4fb11874f1187dd68af28820098",
            "isTop": 100000,
            "leaveTime": "",
            "lunarCalendar": "",
            "mobile": "18820042730",
            "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
            "personName": "林粤",
            "pinyin": "linyue",
            "position": "",
            "sex": "1",
            "shorMobile": "",
            "updateTime": "2018-03-06 17:36:52",
            "userId": "7bcac4fb11874f1187dd68af28820098",
            "userStatus": "2",
            "weixinNum": "ly929610242",
            "wxUserId": "linyue"
          },
            {
              "attribute": 0,
              "birthday": "",
              "childrenList": [],
              "corpId": "wx05ab253814890c89",
              "createTime": "2016-05-18 16:20:43",
              "departmentName": "",
              "deptId": "9a3db6f4e4c0938c2ff9fb7be1bbe0bd",
              "email": "",
              "entryTime": "2016-05-18 00:00:00",
              "headPic": "http://shp.qpic.cn/bizmp/ck4hSGq23RjibIJBZem3KymYsA055qQ58wujn2J7y8c7iawAGicVrQXkg/100",
              "id": "a99c69cf924247ddbf2e3ac43a1e0466",
              "isTop": 100000,
              "leaveTime": "",
              "lunarCalendar": "",
              "mobile": "1820010101",
              "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
              "personName": "覃荣邦",
              "pinyin": "tanrongbang",
              "position": "",
              "sex": "1",
              "shorMobile": "",
              "updateTime": "2018-03-06 17:38:28",
              "userId": "a99c69cf924247ddbf2e3ac43a1e0466",
              "userStatus": "2",
              "weixinNum": "qinrongbang",
              "wxUserId": "qinrongbang"
            },
            {
              "attribute": 0,
              "birthday": "2016-12-10",
              "childrenList": [],
              "corpId": "wx05ab253814890c89",
              "createTime": "2016-06-27 11:32:29",
              "departmentName": "",
              "deptId": "970241de2e8e0fd988d9a6f228589569",
              "email": "",
              "entryTime": "2014-12-13 00:00:00",
              "headPic": "http://shp.qpic.cn/bizmp/ck4hSGq23RgdZTyx8eY7eRagJPcG15uzPgB4EWMOgfGogZ59o74viaQ/100",
              "id": "efb4151179814b5f87bdcbbd02fce8a2",
              "isTop": 100000,
              "leaveTime": "2016-09-28 14:18:22",
              "lunarCalendar": "",
              "mobile": "18520396221",
              "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
              "personName": "谭文强1",
              "pinyin": "tanwenqiang1",
              "position": "",
              "sex": "1",
              "shorMobile": "",
              "updateTime": "2018-03-29 10:15:33",
              "userId": "efb4151179814b5f87bdcbbd02fce8a2",
              "userStatus": "2",
              "weixinNum": "tan823871571",
              "wxUserId": "tan_wq"
            },
            {
              "attribute": 0,
              "birthday": "2017-07-18",
              "childrenList": [],
              "corpId": "wx05ab253814890c89",
              "createTime": "2017-03-30 15:25:54",
              "departmentName": "",
              "deptId": "9b74378bc68e42bc806b4e2147ee3166",
              "email": "",
              "entryTime": "2017-03-30 00:00:00",
              "headPic": "http://shp.qpic.cn/bizmp/ck4hSGq23Ria3OicWceBZ2RV1DXPf2kdmynEurhtDtRSTDEbNsbHkK8Q/100",
              "id": "df03a970392b7072d4c783a217d27f8d",
              "isTop": 100000,
              "leaveTime": "",
              "lunarCalendar": "",
              "mobile": "16466555555",
              "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
              "personName": "蔡超",
              "pinyin": "caichao",
              "position": "",
              "sex": "1",
              "shorMobile": "",
              "updateTime": "2018-04-11 13:52:48",
              "userId": "df03a970392b7072d4c783a217d27f8d",
              "userStatus": "2",
              "weixinNum": "cc-liangmo",
              "wxUserId": "caichao"
            },
            {
              "attribute": 0,
              "birthday": "2017-08-23",
              "childrenList": [],
              "corpId": "wx05ab253814890c89",
              "createTime": "2015-03-02 16:18:58",
              "departmentName": "",
              "deptId": "9a3db6f4e4c0938c2ff9fb7be1bbe0bd",
              "email": "355244127@139.com",
              "entryTime": "2014-08-29 00:00:00",
              "headPic": "http://shp.qpic.cn/bizmp/ck4hSGq23RjumeoGuXVhnNtXWaMV2EKKrgu7xbQGavrcMsFX5JYo0Q/100",
              "id": "7f15f5b1-3d25-4ed7-a46a-42e1ca0ca225",
              "isTop": 973,
              "leaveTime": "2016-08-19 10:06:36",
              "lunarCalendar": "04-19",
              "mobile": "1631344127",
              "orgId": "b17efb43-292e-4cc9-ac5d-0b46bce059c4",
              "personName": "向德均",
              "pinyin": "xiangdejun",
              "position": "主管",
              "sex": "1",
              "shorMobile": "12355585",
              "updateTime": "2018-03-06 17:34:23",
              "userId": "7f15f5b13d254ed7a46a42e1ca0ca225",
              "userStatus": "2",
              "weixinNum": "dejun2190",
              "wxUserId": "do1qy_13631344127"
            }]
        }


      }
    },
    computed:{

    },

    methods:{

    }

  }
</script>
<style>
  .f-add-user-list li .img img {
    width: 45px;
    height: 45px;
  }
  img {
    max-width: 100%;
    vertical-align: middle;
  }
  .f-add-user-list {
    margin: 10px 0;
  }
  .f-add-user {
    background: #ffffff;
    padding: 0 0 0 15px;
  }
  .f-item {
    width: 100%;
    background: #fff;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
    position: relative;
  }
  .remove_icon {
    display: none;
    position: absolute;
    left: 34px;
    top: -6px;
    width: 16px;
    height: 16px;
    /*background: url(../images/remove02.png) no-repeat 0 0;*/
    background-size: 100% 100%;
  }
</style>
