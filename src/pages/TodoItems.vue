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

<script setup>
import { computed, onMounted, ref } from 'vue'
import CustomComponent from 'src/components/CustomComponent.vue'
import TodoComponent from 'src/components/TodoComponent.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const tasks = ref([])

onMounted(() => {
  const data = localStorage.getItem('todoList')
  tasks.value = JSON.parse(data) || []
})

const todoItems = computed(() => {
  return tasks.value.filter(item => item.diffDate === 0 && item.isCompleted === false)
})

function checkActive (task) {
  task.isCompleted = !task.isCompleted
  localStorage.setItem('todoList', JSON.stringify(tasks.value))
}

function deleteIndex (todo) {
  $q.dialog({
    title: '刪除確認',
    message: '確定要刪除此項目?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    const newIndex = tasks.value.findIndex(item => {
      return todo.id === item.id
    })
    tasks.value.splice(newIndex, 1)

    localStorage.setItem('todoList', JSON.stringify(tasks.value))

    $q.notify({
      message: `已刪除項目 ${todo.title}`,
      color: 'negative'
    })
  })
}

function openDetail (task) {
  $q.dialog({
    component: CustomComponent,
    componentProps: {
      data: task
    }
  })
}
</script>

<style lang="scss" scoped>
.no-like {
  opacity: 0.5;
}
</style>
