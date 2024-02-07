<template>
  <q-page>
    <TodoComponent
      :list="likeItem"
      :likeIcon="true"
      @checkActive="checkActive"
      @openDetail="openDetail"
      @likeItemSwitch="likeItemSwitch"
      @deleteIndex="deleteIndex"
    />
    <div
      v-if="!likeItem.length"
      class="no-like absolute-center column items-center"
    >
      <q-icon
        name="star"
        size="100px"
        color="primary"
      />
      <div class="text-h5 text-primary text-center">
        NO ITEM
      </div>
    </div>
  </q-page>
</template>

<script>
import CustomComponent from 'src/components/CustomComponent.vue'
import TodoComponent from 'src/components/TodoComponent.vue'

export default {
  name: 'LikeItem',
  components: {
    TodoComponent
  },
  data () {
    return {
      tasks: []
    }
  },
  mounted () {
    const data = localStorage.getItem('todoList')
    this.tasks = JSON.parse(data) || []
  },
  computed: {
    likeItem () {
      return this.tasks.filter(item => item.like === true && item.isCompleted === false)
    }
  },
  methods: {
    checkActive (task) {
      task.isCompleted = !task.isCompleted
      localStorage.setItem('todoList', JSON.stringify(this.tasks))
    },
    likeItemSwitch (task) {
      task.like = !task.like
      localStorage.setItem('todoList', JSON.stringify(this.tasks))
    },
    deleteIndex (todo) {
      this.$q.dialog({
        title: '刪除確認',
        message: '確定要刪除此項目?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const newIndex = this.tasks.findIndex(item => {
          return todo.id === item.id
        })
        this.tasks.splice(newIndex, 1)

        localStorage.setItem('todoList', JSON.stringify(this.tasks))

        this.$q.notify({
          message: `項目 ${todo.title} 已刪除`,
          color: 'negative'
        })
      })
    },
    openDetail (task) {
      this.$q.dialog({
        component: CustomComponent,
        componentProps: {
          data: task
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.no-like {
  opacity: 0.5;
}
</style>
