<template>
  <q-dialog ref="dialog">
    <q-card class="q-dialog-plugin q-pa-md">
      <div class="q-mb-lg">
        <h5 class="q-ma-none q-mb-sm">{{ taskInfo.title }}</h5>
        <div class="row wrap items-center q-mb-md">
          {{ taskInfo.showDate }}
        </div>
        <div class="q-mb-sm">描述：{{ taskInfo.info }}</div>
        <div class="q-mb-xs">{{taskInfo.subTask.length ? '子任務：' : '尚無子任務'}}</div>
        <!-- show -->
        <q-list
          v-if="taskInfo.subTask.length"
          class="bg-white"
          separator
          bordered
        >
          <q-item
            v-for="subTask in taskInfo.subTask"
            :key="subTask.title"
            :class="{'isComplect bg-grey-2': subTask.isCompleted}"
            @click="checkActive(subTask)"
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-checkbox
                class="no-pointer-events"
                v-model="subTask.isCompleted"
                color="primary"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label
                class="q-ma-none todoTitle"
                :class="{'isComplect': subTask.isCompleted}"
              >
                {{ subTask.title }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="flex">
                <q-btn
                  flat
                  round
                  dense
                  color="primary"
                  icon="delete"
                  @click.stop="deleteIndex(subTask)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <!-- edit -->
        <div v-if="isShowSubTaskInput">
          <q-input
            bottom-slots
            v-model="subTaskText"
            placeholder="任務名稱"
            :dense="dense"
          >
            <template v-slot:append>
              <q-btn
                round
                dense
                flat
                icon="add"
                @click="saveSubTask"
              />
            </template>
          </q-input>
        </div>
      </div>
      <!-- buttons example -->
      <q-card-actions
        class="q-pa-none q-pt-lg row wrap justify-between items-start content-start"
      >
        <q-btn outline rounded color="deep-orange" label="新增子任務" @click="addSubTaskArray" />
        <q-btn unelevated rounded color="primary" label="確認" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['ok'],
  data () {
    return {
      taskInfo: null,
      isShowSubTaskInput: false,
      subTaskText: ''
    }
  },
  watch: {
    data: {
      handler (val) {
        this.taskInfo = val
      },
      immediate: true
    }
  },
  methods: {
    hide () {
      this.$refs.dialog.hide()
    },
    onOKClick () {
      this.$emit('ok', this.taskInfo)
      this.hide()
    },
    checkActive (subTask) {
      subTask.isCompleted = !subTask.isCompleted
    },
    addSubTaskArray () {
      this.isShowSubTaskInput = true
      this.subTaskText = ''
      // if (!this.taskInfo.subTask || !this.taskInfo.subTask.length) {
      //   this.taskInfo.subTask = []
      // }
    },
    saveSubTask () {
      const timeStamp = Math.floor(Date.now())

      this.taskInfo.subTask.push({
        id: timeStamp,
        title: this.subTaskText,
        isCompleted: false
      })
      localStorage.setItem('todoList', JSON.stringify(this.taskInfo))
      this.isShowSubTaskInput = false
    },
    deleteIndex (todo) {
      this.$q.dialog({
        title: '刪除確認',
        message: '確定要刪除此項目?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const newIndex = this.taskInfo.subTask.findIndex(item => {
          return todo.id === item.id
        })
        this.taskInfo.subTask.splice(newIndex, 1)

        localStorage.setItem('todoList', JSON.stringify(this.taskInfo))

        this.$q.notify({
          message: `子項目 ${todo.title} 已刪除`,
          color: 'negative'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.todoTitle {
  font-size: 16px;
  font-weight: bold;
  &.isComplect {
    text-decoration: line-through;
  }
}
</style>
