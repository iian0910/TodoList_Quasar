<template>
  <q-page class="bg-grey-3 column">
    <div class="row q-pa-sm bg-primary">
      <q-input
        @keyup.enter="addTask()"
        class="col"
        square
        filled
        bg-color="white"
        v-model="newTask"
        placeholder="Add Task"
        dense
      >
        <template v-slot:append>
          <q-btn
            @click="addTask()"
            round
            dense
            flat
            icon="send"
          />
        </template>
      </q-input>
    </div>
    <q-list
      class="bg-white"
      separator
      bordered
    >
      <q-item
        v-for="task in tasks"
        :key="task.id"
        :class="{'isComplect bg-grey-2': task.isCompleted}"
        @click="task.isCompleted = !task.isCompleted"
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
          <q-item-label>{{ task.title }}</q-item-label>
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
      v-if="!tasks.length"
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
export default {
  name: 'IndexPage',
  data () {
    return {
      newTask: '',
      tasks: []
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
    addTask () {
      const txt = this.newTask.trim()
      const timeStamp = Math.floor(Date.now())
      this.tasks.push({
        id: timeStamp,
        title: txt,
        isCompleted: false
      })

      this.newTask = ''
    }
  }
}
</script>

<style lang="scss" scoped>
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
