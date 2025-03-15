<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h4">Lista de Alunos</h1>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="navigateTo('students.create')">
          Cadastrar Aluno
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table :headers="headers" :items="props.students" :loading="loading">
        <template v-slot:item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" color="primary" class="mr-2"
            @click="navigateTo('students.edit', { id: item.id })" />
          <v-btn icon="mdi-delete" size="small" color="error" @click="confirmDelete(item)" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o aluno {{ selectedStudent?.name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="text" @click="deleteStudent">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { router } from '@inertiajs/vue3'

const loading = ref(false)
const deleteDialog = ref(false)
const selectedStudent = ref<Student | null>(null)

interface Student {
  id: number
  name: string
  email: string
  ra: string
  cpf: string
}

const props = defineProps<{ students: Student[] }>()

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'RA', key: 'ra' },
  { title: 'CPF', key: 'cpf' },
  { title: 'Ações', key: 'actions', sortable: false }
]

const navigateTo = (routeName: string, params: Record<string, any> = {}) => {
  if (routeName === 'students.create') {
    router.visit('/students/create')
  } else if (routeName === 'students.edit') {
    router.visit(`/students/${params.id}/edit`)
  }
}

const confirmDelete = (student: Student) => {
  selectedStudent.value = student
  deleteDialog.value = true
}

const deleteStudent = async () => {
  if (!selectedStudent.value) return

  loading.value = true
  try {
    await router.delete(`/students/${selectedStudent.value.id}`)
  } catch (error) {
    console.error('Erro ao excluir aluno:', error)
  } finally {
    loading.value = false
    deleteDialog.value = false
    selectedStudent.value = null
  }
}
</script>