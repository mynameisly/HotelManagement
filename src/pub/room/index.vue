<template>
  <div id="room">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="客房管理" name="allRoom">
        <childRoom v-if="isRoom" />
      </el-tab-pane>
      <el-tab-pane label="客房类型管理" name="allRoomType">
        <childRoomType v-if="isRoomType" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myUser from './room'
import myPosition from './roomtype'
export default {
  components: {
    childRoom: myUser,
    childRoomType: myPosition
  },
  data () {
    return {
      activeName: 'allRoom',
      isRoom: true,
      isRoomType: false
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'allRoom') {
        this.isRoom = true
        this.isRoomType = false
      } else if (tab.name === 'allRoomType') {
        this.isRoomType = true
        this.isRoom = false
      }
    }
  }
}
</script>
