<template>
  <q-page>
    <TodoComponent
      :list="todoItems"
      @checkActive="checkActive"
      @openDetail="openDetail"
      @deleteIndex="deleteIndex"
    />
    <div
      v-if="!todoItems.length"
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
  name: 'todoItems',
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
    todoItems () {
      return this.tasks.filter(item => item.diffDate === 0 && item.isCompleted === false)
    }
  },
  methods: {
    checkActive (task) {
      task.isCompleted = !task.isCompleted
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
          message: `已刪除項目 ${todo.title}`,
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
