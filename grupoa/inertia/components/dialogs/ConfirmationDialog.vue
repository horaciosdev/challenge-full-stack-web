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
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps({
    modelValue: Boolean, // Controla a visibilidade do diálogo
    title: String, // Título do diálogo
    message: String, // Mensagem de confirmação
    confirmText: { type: String, default: 'Confirmar' }, // Texto do botão de confirmação
    confirmColor: { type: String, default: 'primary' }, // Cor do botão de confirmação
  })

  const emit = defineEmits(['update:modelValue', 'confirm'])

  const confirm = () => {
    emit('confirm') // Emite o evento de confirmação
    close()
  }

  const close = () => {
    emit('update:modelValue', false) // Fecha o diálogo
  }

  const onUpdateModelValue = (value: boolean) => {
    emit('update:modelValue', value) // Emite o evento para atualizar o valor
  }
  </script>