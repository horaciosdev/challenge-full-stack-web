/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import { createApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import vuetify from '../../plugins/vuetify'
import DefaultLayout from '../layouts/default_layout.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Grupo A'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue'),
    );

    page.default.layout = page.default.layout || DefaultLayout;

    return page;
  },

  setup({ el, App, props, plugin }) {

    createApp({ render: () => h(App, props) })

      .use(plugin)
      .use(vuetify)
      .mount(el)
  },
})