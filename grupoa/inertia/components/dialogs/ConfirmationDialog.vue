<template>
    <v-dialog :modelValue="modelValue" @update:modelValue="onUpdateModelValue" max-width="500">
      <v-card>
        <v-card-title class="text-h5">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :color="confirmColor" @click="confirm">{{ confirmText }}</v-btn>
          <v-btn color="secondary" @click="close">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

  <script setup lang="ts">
  defineProps({
    modelValue: Boolean,
    title: String,
    message: String,
    confirmText: { type: String, default: 'Confirmar' },
    confirmColor: { type: String, default: 'primary' },
  })

  const emit = defineEmits(['update:modelValue', 'confirm'])

  const confirm = () => {
    emit('confirm')
    close()
  }

  const close = () => {
    emit('update:modelValue', false)
  }

  const onUpdateModelValue = (value: boolean) => {
    emit('update:modelValue', value)
  }
  </script>