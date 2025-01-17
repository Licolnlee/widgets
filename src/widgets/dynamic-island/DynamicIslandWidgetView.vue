<template>
  <dynamic-island-widget
    ref="dynamicIslandWidget"
    v-model:state="state"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    :notification="notification" />
</template>

<script lang="ts">
import {AppNotification, BrowserWindowApi, ElectronUtils, WidgetApi, WidgetData} from '@widget-js/core'
import DynamicIslandWidget from './DynamicIslandWidget.vue'
import {useNotification, useWidget} from '@widget-js/vue3'
import {computed, reactive, ref, watch} from 'vue'
import {useIntervalFn, useTimeoutFn} from '@vueuse/core'
import {NotificationState} from '@/widgets/dynamic-island/model/NotificationState'
import {getCountdownDemo, SitReminderDemo} from '@/widgets/dynamic-island/model/Demo'
import '@/common/dayjs-extend'

export default {
  name: 'DynamicIslandWidgetView',
  components: { DynamicIslandWidget },
  setup() {
    const { widgetParams } = useWidget(WidgetData)
    const dynamicIslandWidget = ref()
    const state = ref(NotificationState.HIDE)
    const defaultNotification = new AppNotification({
      duration: 0,
      message: '欢迎',
      title: '',
      type: 'info'
    })

    const notification = reactive(defaultNotification)
    const hide = () => {
      state.value = NotificationState.HIDE
    }

    useNotification((newNotification) => {
      if (newNotification) {
        BrowserWindowApi.showInactive()
        BrowserWindowApi.setAlwaysOnTop(true)
        Object.assign(notification, newNotification)
        setState()
        startHideTimeout()
      } else {
        hide()
      }
    })

    watch(state, (newValue) => {
      if (newValue == NotificationState.HIDE) {
        startHideWindow()
      } else {
        stopHideWindow()
      }
    })
    const { start: startHideWindow, stop: stopHideWindow } = useTimeoutFn(() => {
      BrowserWindowApi.hide()
    }, 1000)

    stopHideWindow()

    const hideTimeout = computed(() => {
      return notification.duration
    })

    const inElectron = ElectronUtils.hasElectronApi()

    let previousStateIndex = 0
    const setState = () => {
      switch (notification.type) {
        case 'call':
        case 'advance-countdown':
        case 'url':
          state.value = NotificationState.NORMAL
          break
        case 'reminder':
          state.value = NotificationState.LARGE
          break
        default:
          state.value = NotificationState.SMALL
          break
      }
    }

    const { start, stop: stopHideTimeout } = useTimeoutFn(() => {
      hide()
    }, hideTimeout)

    const startHideTimeout = () => {
      stopHideTimeout()
      if (hideTimeout.value > 0) {
        start()
      }
    }

    const { pause, resume } = useIntervalFn(
      async () => {
        state.value = NotificationState.NORMAL
        previousStateIndex++
        switch (previousStateIndex % 4) {
          case 0:
            Object.assign(notification, getCountdownDemo())
            break
          case 1:
            const packageUrl = await WidgetApi.getWidgetPackageUrl('cn.widgetjs.widgets')
            notification.avatar = packageUrl + '/images/zhangyuge.jpg'
            notification.title = '章鱼哥'
            notification.message = '下班提醒'
            notification.type = 'call'
            notification.backgroundColor = 'black'
            break
          case 2:
            notification.type = 'info'
            notification.backgroundColor = 'black'
            notification.message = '您好'
            break
          case 3:
            Object.assign(notification, SitReminderDemo)
            break
        }
        setState()
      },
      2000,
      { immediate: true }
    )
    if (widgetParams.preview) {
      resume()
    } else {
      pause()
    }
    return {
      setState,
      dynamicIslandWidget,
      inElectron,
      state,
      notification,
      widgetParams,
      startHideTimeout,
      stopHideTimeout,
      hide
    }
  },
  methods: {
    async onMouseEnter() {
      await BrowserWindowApi.setIgnoreMouseEvent(false)
      this.stopHideTimeout()
    },
    async onMouseLeave() {
      await BrowserWindowApi.setIgnoreMouseEvent(true)
      this.startHideTimeout()
    },
    async hidden() {
      await BrowserWindowApi.setIgnoreMouseEvent(false)
      await BrowserWindowApi.setPosition({ y: -10000 })
      // await BrowserWindowApi.hide()
    }
  }
}
</script>

<style scoped></style>
