let testData = {
    crm:{
        headData:{
            show:true,
            nav:[
                {class:"ic_sea", text:"公海池", url:"poolList", name:"", value:""},
                {class:"ic_customer", text:"客户", url:"clientList", name:"notReadClientNum", value:""},
                {class:"ic_contact", text:"联系人", url:"contactList", name:"notReadContactsNum", value:""},
                {class:"ic_visit", text:"拜访", url:"visitList", name:"notReadVisitNum", value:""},
                {class:"ic_bussiness", text:"商机", url:"businessList", name:"notReadBusinessNum", value:""},
                {class:"ic_agreenment", text:"合同", url:"contractList", name:"notReadContractNum", value:""},
                {class:"ic_data", text:"数据看板", url:"/jsp/wap/crm/client/data_board.jsp", name:"", value:""},
                {class:"ic_check", text:"查重", url:"checkList", name:"", value:""}
                ],
            addnav:[
                {class:"ic_customer", text:"客户", url:"clientOperate", num:""},
                {class:"ic_contact", text:"联系人", url:"/jsp/wap/crm/contact/contact_add.jsp", num:""},
                {class:"ic_visit", text:"拜访", url:"/jsp/wap/crm/outsideworkinfo/outsideworkinfo_add.jsp?appId=1", num:""},
                {class:"ic_bussiness", text:"商机", url:"/jsp/wap/crm/business/business_add.jsp", num:""},
                {class:"ic_agreenment", text:"合同", url:"/jsp/wap/crm/contract/contract_add.jsp", num:""},
            ],
        }
    }
}

export default testData;