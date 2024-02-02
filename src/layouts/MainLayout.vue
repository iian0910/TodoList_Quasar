<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
      </q-toolbar>
      <div class="q-px-lg q-pt-lg q-mb-md">
        <div class="text-h3">TODO</div>
        <div class="text-subtitle">{{ todayDate }}</div>
      </div>
      <q-img
        src="mountains.jpg"
        class="header-image absolute-top"
      />
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="600"
    >
      <q-scroll-area style="height: calc(100% - 161px); margin-top: 161px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item
            to="/"
            exact
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>

            <q-item-section>
              TODO
            </q-item-section>
          </q-item>

          <q-item
            to="/star"
            exact
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="star_border" />
            </q-item-section>

            <q-item-section>
              已加星號
            </q-item-section>
          </q-item>

          <q-item
            to="/help"
            exact
            clickable
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>
              HELP
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 161px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">{{ env === 'electron' ? '桌機版' : '' }} Todo List</div>
          <small>沒有不進步的人生，只有不進取的人</small>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: false,
      env: ''
    }
  },
  mounted () {
    this.env = process.env.MODE
  },
  computed: {
    todayDate () {
      const timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM')
    }
  },
  methods: {
    toggleLeftDrawer () {
      console.log('HI!')
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
}
</script>

<style lang="scss" scoped>
.header-image {
  height: 100%;
  z-index: -1;
  opacity: 0.5;
  filter: grayscale(100%);
}
</style>
