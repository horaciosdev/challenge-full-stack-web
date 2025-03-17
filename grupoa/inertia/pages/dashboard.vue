<template>
  <Head title="Dashboard | Grupo A" />

  <v-container fluid>
    <!-- Cabeçalho -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="2" class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h1 class="text-h4 font-weight-bold primary--text">Dashboard Acadêmico</h1>
              <p class="text-body-1 text-medium-emphasis mt-1">{{ currentDate }}</p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-account-plus"
              @click="$inertia.visit('/students/create')"
            >
              Novo Aluno
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estatísticas -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="2" class="h-100">
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <v-icon size="48" color="primary" class="mb-2">mdi-account-group</v-icon>
              <span class="text-h4 font-weight-bold">{{ totalStudents }}</span>
              <span class="text-subtitle-1 text-medium-emphasis">Total de Alunos</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="h-100">
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <v-icon size="48" color="success" class="mb-2">mdi-account-check</v-icon>
              <span class="text-h4 font-weight-bold">{{ activeStudents }}</span>
              <span class="text-subtitle-1 text-medium-emphasis">Alunos Ativos</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="h-100">
          <v-card-text>
            <div class="d-flex flex-column align-center">
              <v-icon size="48" color="warning" class="mb-2">mdi-account-cancel</v-icon>
              <span class="text-h4 font-weight-bold">{{ inactiveStudents }}</span>
              <span class="text-subtitle-1 text-medium-emphasis">Alunos Inativos</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alunos Recentes e Ações Rápidas -->
    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon start color="primary" class="mr-2">mdi-account-clock</v-icon>
            Alunos Recentemente Adicionados
          </v-card-title>

          <v-card-text v-if="recentStudents.length === 0" class="py-8 text-center">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-question</v-icon>
            <div class="text-body-1 text-medium-emphasis">Nenhum aluno cadastrado recentemente</div>
          </v-card-text>

          <v-table v-else>
            <thead>
              <tr>
                <th>Nome</th>
                <th>RA</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in recentStudents.slice(0, 5)" :key="student.id">
                <td>{{ student.name }}</td>
                <td>{{ student.ra }}</td>
                <td>{{ student.cpf }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.createdAt }}</td>
                <td>
                  <v-btn icon="mdi-eye" size="small" color="info" density="comfortable" class="mr-2"
                    @click="$inertia.visit(`/students/${student.id}`)" />
                  <v-btn icon="mdi-pencil" size="small" color="primary" density="comfortable"
                    @click="$inertia.visit(`/students/${student.id}/edit`)" />
                </td>
              </tr>
            </tbody>
          </v-table>

          <v-card-actions class="justify-center py-3">
            <v-btn color="primary" variant="text" @click="$inertia.visit('/students')">
              Ver Todos os Alunos
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon start color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
            Ações Rápidas
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item @click="$inertia.visit('/students/create')" prepend-icon="mdi-account-plus" title="Cadastrar Novo Aluno"></v-list-item>
              <v-list-item @click="$inertia.visit('/students')" prepend-icon="mdi-view-list" title="Listar Todos os Alunos"></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { ref, onMounted } from 'vue'
import Student from '#models/student'

const props = defineProps<{
  recentStudents?: Student[],
  totalStudents?: number,
  activeStudents?: number,
  inactiveStudents?: number
}>()

const totalStudents = ref(props.totalStudents || 0)
const activeStudents = ref(props.activeStudents || 0)
const inactiveStudents = ref(props.inactiveStudents || 0)
const recentStudents = ref(props.recentStudents || [])

const currentDate = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

onMounted(() => {
  console.log(props.inactiveStudents)
})
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>