# 新增
## 初始
### 查询模板
`portal/moveapproveAction!getMoveTemplate.action`

### 查询审批设置 
`portal/moveapproveAction!configInfo.action`
```
获取orgID
```

## 切换申请类型时
### 查询相关人
`portal/moveapproveAction!getccPersonListByTemplateId.action`
### 查询节点信息和流程列表（非自由流程时）
`portal/flow/flowAction!ajaxSearchFlowList.action`
* 结果 
1. `list: []` 没有可用流程
2. `list.length>0`  多个固定流程

## 用户提交时
* 如果是分支流程
需要查询下一节点信息`portal/flow/flowBranchAction!findBranchFlowNextNodeInfo.action`，选择处理人
* 如果不是分支流程，需验证 
1. 如果是自由流程: 必须选审批人、审批人不可以是自己
1. 如果是固定流程: ① 有可用的固定流程；② 有选择固定流程
1. 如果是分支流程：

## 多个固定流程时，切换审批流程


## 获取审核人节点信息
条件：
`/portal/flow/flowParallel/ajaxGetFlowAuditUser.do`







