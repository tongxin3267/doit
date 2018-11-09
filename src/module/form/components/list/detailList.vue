<template>
  <div class="qwui-cardList">
        <router-link
            class="qwui-cardList_item flexbox ku_arrow"
            v-for="(item,index) in list"
            :key="item.id"
            tag="div"
            :to="{name: 'detail', query: { id: item.id}}">
            <div class="flexItem pr15">
                <h3>{{item.instanceTitle}}</h3>
                <p v-html="renderText(item)"></p>
            </div>
        </router-link>
    </div>
</template>

<script>
import { mixinList } from './list'
export default {
	mixins: [mixinList],
	props: ['list'],
	methods: {
		renderText(item) {
			let timeStr = this.timeStr(item.createaTime),
				statusClass = this.statusClass(item.isTask, item.isClose, item.isover),
				showStatus = this.showStatus(item.isTask, item.isClose, item.isover),
				currentNode = this.currentNodestr(item.currentNode);

			switch (item.isTask) {
				case '0':
					return timeStr + ' ' + item.personName;
				case '1':
					return '<span class="applyStatus ' + statusClass + '" >' + showStatus + '</span>' + timeStr + ' ' + item.personName;
				case '2':
					return '<span class="applyStatus ' + statusClass + '" >' + showStatus + '</span>' + timeStr + ' ' + item.personName + '<p>' + currentNode + '</p>';
				case '3':
					return timeStr
				case '':
					return timeStr  //外部单后台isTask返回空值
			}
		}
	}
}
</script>
<style scoped>
  .pr15{
    padding-right: 15px;
  }
</style>
