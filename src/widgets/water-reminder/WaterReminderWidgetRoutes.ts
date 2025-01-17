import WaterReminderWidgetDefine from "./WaterReminder.widget";

const url = WaterReminderWidgetDefine.getIndexRoute().url;
const name = WaterReminderWidgetDefine.name;

const configUrl = WaterReminderWidgetDefine.getConfigRoute()!.url;

const WaterReminderWidgetRoutes = [
    {
        path: url,
        name: `${name}`,
        component: () => import(/* webpackChunkName: "com.wisdom.widgets.water_reminder" */ './WaterReminderWidgetView.vue')
    },
    {
        path: configUrl,
        name: `${name}.config`,
        component: () => import(/* webpackChunkName: "com.wisdom.widgets.water_reminder.config" */ './WaterReminderConfigView.vue')
    }
]

export default WaterReminderWidgetRoutes;
