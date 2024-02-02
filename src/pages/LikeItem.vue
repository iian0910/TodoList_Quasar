<template>
  <q-page>
    <q-item
      v-for="task in likeItem"
      :key="task.id"
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
            {{ task.date }}
          </q-btn>
        </div>
      </q-item-section>
      <q-item-section side>
        <div class="flex">
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
            color="primary"
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
export default {
  name: 'LikeItem',
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
          message: `已刪除項目 ${todo.title}`,
          color: 'negative'
        })
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
