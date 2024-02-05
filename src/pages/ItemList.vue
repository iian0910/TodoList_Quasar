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
        <q-item-section avatar>
          <q-checkbox color="primary" />
        </q-item-section>
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
            v-model="date"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" mask="YYYY/MM/DD">
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
      <!-- 至頂 -->
      <q-item
        v-for="task in pinedItem"
        :key="task.id"
        :class="{'isComplect bg-grey-2': task.isCompleted}"
        @click="checkActive(task)"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox
            class="no-pointer-events"
            v-model="task.isCompleted"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-ma-none todoTitle">{{ task.title }} (置頂)</q-item-label>
          <p class="q-ma-none text-grey">{{ task.info }}</p>
          <div class="q-mt-xs q-gutter-sm">
            <q-btn
              size="sm"
              outline
              rounded
              class="q-mt-none"
              color="primary"
            >
              {{ task.showDate }}
            </q-btn>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="flex">
            <q-btn
              v-if="task.isPushPin"
              flat
              round
              dense
              color="positive"
              icon="push_pin"
              @click.stop="pinItemSwitch(task)"
            />
            <q-btn
              v-if="!task.like"
              flat
              round
              dense
              color="primary"
              icon="star_border"
              @click.stop="likeItemSwitch(task)"
            />
            <q-btn
              v-if="task.like"
              flat
              round
              dense
              color="warning"
              icon="star"
              @click.stop="likeItemSwitch(task)"
            />
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="delete"
              @click.stop="deleteIndex(task)"
            />
          </div>
        </q-item-section>
      </q-item>
      <!-- show -->
      <q-item
        v-for="task in undoItem"
        :key="task.id"
        :class="{'isComplect bg-grey-2': task.isCompleted}"
        @click="checkActive(task)"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox
            class="no-pointer-events"
            v-model="task.isCompleted"
            color="primary"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-ma-none todoTitle">{{ task.title }}</q-item-label>
          <p class="q-ma-none text-grey">{{ task.info }}</p>
          <div class="q-mt-xs q-gutter-sm">
            <q-btn
              size="sm"
              outline
              rounded
              class="q-mt-none"
              color="primary"
            >
              {{ task.showDate }}
            </q-btn>
          </div>
        </q-item-section>
        <q-item-section side>
          <div class="flex">
            <q-btn
              v-if="!task.isPushPin"
              flat
              round
              dense
              color="primary"
              icon="push_pin"
              @click.stop="pinItemSwitch(task)"
            />
            <q-btn
              v-if="!task.like"
              flat
              round
              dense
              color="primary"
              icon="star_border"
              @click.stop="likeItemSwitch(task)"
            />
            <q-btn
              v-if="task.like"
              flat
              round
              dense
              color="warning"
              icon="star"
              @click.stop="likeItemSwitch(task)"
            />
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="delete"
              @click.stop="deleteIndex(task)"
            />
          </div>
        </q-item-section>
      </q-item>
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
              <p class="q-ma-none text-grey">{{ task.info }}</p>
              <div class="q-mt-xs q-gutter-sm">
                <q-btn
                  size="sm"
                  outline
                  rounded
                  class="q-mt-none"
                  color="primary"
                >
                  {{ task.showDate }}
                </q-btn>
              </div>
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
import { ref } from 'vue'
import moment from 'moment'

export default {
  name: 'IndexPage',
  data () {
    return {
      isShowHint: true,
      isEdit: false,
      newTask: '',
      newTaskInfo: '',
      tasks: [],
      date: ref('2024/02/01')
    }
  },
  mounted () {
    const data = localStorage.getItem('todoList')
    this.tasks = JSON.parse(data) || []
  },
  computed: {
    undoItem () {
      return this.tasks.filter(item => item.isCompleted === false && item.isPushPin === false)
    },
    pinedItem () {
      return this.tasks.filter(item => item.isPushPin === true)
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
          message: `已刪除項目 ${todo.title}`,
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

      const getMonth = new Date(Date.parse(this.date)).getMonth() + 1
      const getDate = new Date(Date.parse(this.date)).getDate()
      let getDay = new Date(Date.parse(this.date)).getDay()

      switch (getDay) {
        case 1:
          getDay = '一'
          break
        case 2:
          getDay = '二'
          break
        case 3:
          getDay = '三'
          break
        case 4:
          getDay = '四'
          break
        case 5:
          getDay = '五'
          break
        case 6:
          getDay = '六'
          break
        case 0:
          getDay = '日'
          break
      }

      this.tasks.unshift(
        {
          id: timeStamp,
          title: txt,
          info: txtInfo,
          showDate: `${getMonth}月${getDate}日 星期${getDay}`,
          diffDate: this.calculateTime(new Date(Date.parse(this.date))),
          isPushPin: false,
          isCompleted: false,
          like: false
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
