<template>
  <div id="employee">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户管理" name="allUser">
        <childUser v-if="isUser" />
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="allPosition">
        <childPosition v-if="isPosition" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myUser from './employee'
import myPosition from './position'
export default {
  components: {
    childUser: myUser,
    childPosition: myPosition
  },
  data () {
    return {
      activeName: 'allUser',
      isUser: true,
      isPosition: false
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'allUser') {
        this.isUser = true
        this.isPosition = false
      } else if (tab.name === 'allPosition') {
        this.isPosition = true
        this.isUser = false
      }
    }
  }
}
</script>
