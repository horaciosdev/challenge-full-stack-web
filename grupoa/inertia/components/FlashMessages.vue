<template>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="bottom center"
      elevation="12"
      :timeout="3000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </template>

  <script setup>
  import { computed, ref, watch } from 'vue'
  import { usePage } from '@inertiajs/vue3'

  const page = usePage()
  const flash = computed(() => page.props.flash)

  const snackbar = ref({
    show: false,
    message: '',
    color: 'success',
  })

  watch(flash, (newFlash) => {
    if (newFlash.success) {
      snackbar.value = {
        show: true,
        message: newFlash.success,
        color: 'success',
      }
    } else if (newFlash.error) {
      snackbar.value = {
        show: true,
        message: newFlash.error,
        color: 'error',
      }
    }
  }, { immediate: true })
  </script>