<template>
  <q-item
    v-for="task in list"
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
    <q-item-section
      @click.stop="openDetail(task)"
    >
      <q-item-label
        class="q-ma-none todoTitle row wrap items-center"
      >
        {{ task.title }}
        <q-icon
          class="q-ml-xs"
          name="preview"
        />
      </q-item-label>
      <small>子任務數量：{{task.subTask.length}}</small>
    </q-item-section>
    <q-item-section side>
      <div class="flex">
        <q-btn
          v-if="pinIcon"
          flat
          round
          dense
          :color="task.isPushPin ? 'positive' : 'primary'"
          icon="push_pin"
          @click.stop="pinItemSwitch(task)"
        />
        <q-btn
          v-if="likeIcon"
          flat
          round
          dense
          :color="task.like ? 'warning' : 'primary'"
          :icon="task.like ? 'star' : 'star_border'"
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
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    pinIcon: {
      type: Boolean,
      default: false
    },
    likeIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    checkActive (task) {
      this.$emit('checkActive', task)
    },
    openDetail (task) {
      this.$emit('openDetail', task)
    },
    pinItemSwitch (task) {
      this.$emit('pinItemSwitch', task)
    },
    likeItemSwitch (task) {
      this.$emit('likeItemSwitch', task)
    },
    deleteIndex (task) {
      this.$emit('deleteIndex', task)
    }
  }
}
</script>
