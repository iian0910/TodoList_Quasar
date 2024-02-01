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
      <!-- show -->
      <q-item
        v-for="task in tasks"
        :key="task.id"
        :class="{'isComplect bg-grey-2': task.isCompleted}"
      >
        <q-item-section avatar>
          <q-checkbox
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
              {{ task.date }}
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
  methods: {
    deleteIndex (todo) {
      this.$q.dialog({
        title: 'DELETE ITEM',
        message: 'Would you want to delete item?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const newIndex = this.tasks.findIndex(item => {
          return todo.id === item.id
        })
        this.tasks.splice(newIndex, 1)

        this.$q.notify({
          message: `Deleted item ${todo.title}`,
          color: 'primary'
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
          date: `${getMonth}月${getDate}日 星期${getDay}`,
          isCompleted: false
        }
      )
      this.newTask = ''
      this.newTaskInfo = ''

      this.isEdit = false
      this.isShowHint = true
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
