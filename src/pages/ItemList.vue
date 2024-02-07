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

<script>
import moment from 'moment'
import { weekdayToString } from '../assets/js/common.js'
import CustomComponent from 'src/components/CustomComponent.vue'
import TodoComponent from 'src/components/TodoComponent.vue'

export default {
  name: 'IndexPage',
  components: {
    TodoComponent
  },
  data () {
    return {
      isShowHint: true,
      isEdit: false,
      newTask: '',
      newTaskInfo: '',
      tasks: [],
      today: moment(new Date().toISOString().split('T')[0]).format('YYYY/MM/DD'),
      initToday: moment(new Date().toISOString().split('T')[0]).format('YYYY/MM/DD')
    }
  },
  mounted () {
    const data = localStorage.getItem('todoList')
    this.tasks = JSON.parse(data) || []
  },
  computed: {
    undoItem () {
      const sortData = this.tasks.filter(item => {
        return item.isCompleted === false
      }).sort((oldTodo, newTodo) => {
        return newTodo.isPushPin - oldTodo.isPushPin
      })

      return sortData
    },
    complectedItem () {
      return this.tasks.filter(item => item.isCompleted === true)
    }
  },
  methods: {
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
    editTask () {
      this.isEdit = true
      this.isShowHint = false
    },
    addTask () {
      const txt = this.newTask.trim()
      const txtInfo = this.newTaskInfo.trim()
      const timeStamp = Math.floor(Date.now())

      if (!txt && !txtInfo) {
        this.isEdit = false
        this.isShowHint = true

        return false
      }

      const getMonth = moment(this.today).month() + 1
      const getDate = moment(this.today).date()
      const getDay = weekdayToString(moment(this.today).weekday())

      this.tasks.unshift(
        {
          id: timeStamp,
          title: txt,
          info: txtInfo,
          showDate: `${getMonth}月${getDate}日 星期${getDay}`,
          diffDate: this.calculateTime(moment(this.today)),
          isPushPin: false,
          isCompleted: false,
          like: false,
          subTask: []
        }
      )

      localStorage.setItem('todoList', JSON.stringify(this.tasks))

      this.newTask = ''
      this.newTaskInfo = ''

      this.isEdit = false
      this.isShowHint = true
    },
    checkActive (task) {
      task.isCompleted = !task.isCompleted
      localStorage.setItem('todoList', JSON.stringify(this.tasks))
    },
    likeItemSwitch (task) {
      task.like = !task.like
      localStorage.setItem('todoList', JSON.stringify(this.tasks))
    },
    pinItemSwitch (task) {
      task.isPushPin = !task.isPushPin
      localStorage.setItem('todoList', JSON.stringify(this.tasks))
    },
    calculateTime (date) {
      const databaseTime = date
      const databaseMoment = moment(databaseTime)
      const currentTime = moment()
      const timeDifference = currentTime.diff(databaseMoment)
      const durationInMilliseconds = moment.duration(timeDifference)
      const daysDifference = Math.floor(durationInMilliseconds.asDays())

      return daysDifference
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
