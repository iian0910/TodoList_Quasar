<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-btn
        outline
        style="color: white"
        label="新增工作"
        icon-right="add"
        @click="editTask()"
      />
    </div>
    <q-list
      class="bg-white"
      separator
      bordered
    >
      <!-- edit -->
      <q-item v-if="isEdit">
        <q-item-section>
          <q-input
            square
            standout
            dense
            v-model="newTask"
            placeholder="標題"
          />
          <q-input
            square
            standout
            dense
            v-model="newTaskInfo"
            placeholder="詳細資料"
          >
            <template v-slot:prepend>
              <q-icon name="subject" />
            </template>
          </q-input>
          <q-input
            square
            standout
            dense
            v-model="today"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="today"
                    mask="YYYY/MM/DD"
                    today-btn
                    :options="date => date >= initToday"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            push
            class="q-mt-sm"
            color="primary"
            label="新增"
            @click="addTask()"
          />
        </q-item-section>
      </q-item>
      <!-- show -->
      <TodoComponent
        :list="undoItem"
        :pinIcon="true"
        :likeIcon="true"
        @checkActive="checkActive"
        @openDetail="openDetail"
        @pinItemSwitch="pinItemSwitch"
        @likeItemSwitch="likeItemSwitch"
        @deleteIndex="deleteIndex"
      />
      <!-- done -->
      <q-expansion-item
        v-if="complectedItem.length"
        expand-separator
        icon="task_alt"
        :label="`已完成(${complectedItem.length})`"
      >
        <q-card>
          <q-item
            v-for="task in complectedItem"
            :key="task.id"
          >
            <q-item-section avatar>
              <q-checkbox
                disable
                v-model="task.isCompleted"
                color="primary"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="q-ma-none todoTitle">{{ task.title }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="delete"
                @click.stop="deleteIndex(task)"
              />
            </q-item-section>
          </q-item>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div
      v-if="!tasks.length && isShowHint"
      class="no-tasks absolute-center"
    >
      <q-icon
        name="check"
        size="100px"
        color="primary"
      />
      <div class="text-h5 text-primary text-center">
        No Tasks
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import moment from 'moment'
import { weekdayToString } from '../assets/js/common.js'
import CustomComponent from 'src/components/CustomComponent.vue'
import TodoComponent from 'src/components/TodoComponent.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const isShowHint = ref(true)
const isEdit = ref(false)
const newTask = ref('')
const newTaskInfo = ref('')
const tasks = ref([])
const today = ref(moment(new Date().toISOString().split('T')[0]).format('YYYY/MM/DD'))
const initToday = ref(moment(new Date().toISOString().split('T')[0]).format('YYYY/MM/DD'))

onMounted(() => {
  const data = localStorage.getItem('todoList')
  tasks.value = JSON.parse(data) || []
})

const undoItem = computed(() => {
  const sortData = tasks.value.filter(item => {
    return item.isCompleted === false
  }).sort((oldTodo, newTodo) => {
    return newTodo.isPushPin - oldTodo.isPushPin
  })

  return sortData
})

const complectedItem = computed(() => {
  return tasks.value.filter(item => item.isCompleted === true)
})

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
      message: `項目 ${todo.title} 已刪除`,
      color: 'negative'
    })
  })
}

function editTask () {
  isEdit.value = true
  isShowHint.value = false
}

function addTask () {
  const txt = newTask.value.trim()
  const txtInfo = newTaskInfo.value.trim()
  const timeStamp = Math.floor(Date.now())

  if (!txt && !txtInfo) {
    isEdit.value = false
    isShowHint.value = true

    return false
  }

  const getMonth = moment(today.value).month() + 1
  const getDate = moment(today.value).date()
  const getDay = weekdayToString(moment(today.value).weekday())

  tasks.value.unshift(
    {
      id: timeStamp,
      title: txt,
      info: txtInfo,
      showDate: `${getMonth}月${getDate}日 星期${getDay}`,
      diffDate: calculateTime(moment(today.value)),
      isPushPin: false,
      isCompleted: false,
      like: false,
      subTask: []
    }
  )

  localStorage.setItem('todoList', JSON.stringify(tasks.value))

  newTask.value = ''
  newTaskInfo.value = ''

  isEdit.value = false
  isShowHint.value = true
}

function checkActive (task) {
  task.isCompleted = !task.isCompleted
  localStorage.setItem('todoList', JSON.stringify(tasks.value))
}

function likeItemSwitch (task) {
  task.like = !task.like
  localStorage.setItem('todoList', JSON.stringify(tasks.value))
}

function pinItemSwitch (task) {
  task.isPushPin = !task.isPushPin
  localStorage.setItem('todoList', JSON.stringify(tasks.value))
}

function calculateTime (date) {
  const databaseTime = date
  const databaseMoment = moment(databaseTime)
  const currentTime = moment()
  const timeDifference = currentTime.diff(databaseMoment)
  const durationInMilliseconds = moment.duration(timeDifference)
  const daysDifference = Math.floor(durationInMilliseconds.asDays())

  return daysDifference
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
.todoTitle {
  font-size: 16px;
  font-weight: bold;
}
.isComplect {
  .q-item__label {
    text-decoration: line-through;
    color: #bbb;
  }
}
.no-tasks {
  opacity: 0.5;
}
</style>
