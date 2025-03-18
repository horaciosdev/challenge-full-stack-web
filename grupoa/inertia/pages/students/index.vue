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

    <!-- Filtros e Busca -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Buscar por nome"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabela de Alunos -->
    <v-card>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="currentPage"
        :headers="headers"
        :items="props.students.data"
        :loading="loading"
        :items-length="totalItems"
        :search="search"
        @update:options="loadItems"
        hover
      >
        <template v-slot:item.cpf="{ item }">
          {{ cpfMask(item.cpf) }}
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="item.deletedAt ? 'error' : 'success'"
            size="small"
            text-color="white"
          >
            {{ item.deletedAt ? 'Inativo' : 'Ativo' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-tooltip text="Visualizar">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-eye"
                  size="small"
                  color="info"
                  class="mr-2"
                  v-bind="props"
                  @click="navigateTo('students.show', { id: item.id })"
                  :disabled="!!item.deletedAt"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="Editar">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  class="mr-2"
                  v-bind="props"
                  @click="navigateTo('students.edit', { id: item.id })"
                  :disabled="!!item.deletedAt"
                />
              </template>
            </v-tooltip>

            <template v-if="!item.deletedAt">
              <v-tooltip text="Desativar">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    class="mr-2"
                    v-bind="props"
                    @click="confirmDelete(item)"
                  />
                </template>
              </v-tooltip>
            </template>
            <template v-else>
              <v-tooltip text="Restaurar">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-restore"
                    size="small"
                    color="info"
                    class="mr-2"
                    v-bind="props"
                    @click="confirmRestore(item)"
                  />
                </template>
              </v-tooltip>
              <v-tooltip text="Excluir permanentemente">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-delete-forever"
                    size="small"
                    color="error"
                    v-bind="props"
                    @click="confirmPermanentDelete(item)"
                  />
                </template>
              </v-tooltip>
            </template>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Diálogos de Confirmação -->
    <ConfirmationDialog
      v-model="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
      :confirm-text="dialogConfirmText"
      :confirm-color="dialogConfirmColor"
      @confirm="handleConfirm"
    />

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
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { router } from '@inertiajs/vue3'
import ConfirmationDialog from '../../components/dialogs/ConfirmationDialog.vue'
import { cpfMask } from '../../../utils/mask_utils';
import _ from 'lodash'

interface DataTableHeader {
  title: string;
  key: string;
  align?: 'start' | 'end' | 'center';
  sortable?: boolean;
  width?: number | string;
  fixed?: boolean;
  filterable?: boolean;
  children?: DataTableHeader[];
}

const props = defineProps<{
  students: {
    data: Student[];
    meta: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
    };
  };
  filters: {
    search?: string;
    status?: string;
  };
}>();

interface Student {
  id: number;
  name: string;
  email: string;
  ra: string;
  cpf: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

const confirmationDialog = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogConfirmText = ref('Confirmar')
const dialogConfirmColor = ref('primary')
const currentAction = ref<'delete' | 'restore' | 'permanentDelete' | null>(null)

const loading = ref(false);
const selectedStudent = ref<Student | null>(null);

const currentPage = ref(props.students.meta.currentPage);
const itemsPerPage = ref(props.students.meta.perPage);
const totalItems = ref(props.students.meta.total);
const search = ref(props.filters.search || '');
const statusFilter = ref(props.filters.status || 'all');
const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([]);

const statusOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Ativos', value: 'active' },
  { title: 'Inativos', value: 'inactive' },
];

const headers: DataTableHeader[] = [
  { title: 'RA', key: 'ra', align: 'start', sortable: true },
  { title: 'Nome', key: 'name', align: 'start', sortable: true },
  { title: 'Email', key: 'email', align: 'start', sortable: true },
  { title: 'CPF', key: 'cpf', align: 'start', sortable: true },
  { title: 'Criado em', key: 'createdAt', align: 'start', sortable: true },
  { title: 'Atualizado em', key: 'updatedAt', align: 'start', sortable: true },
  { title: 'Status', key: 'status', align: 'start', sortable: false },
  { title: 'Ações', key: 'actions', align: 'start', sortable: false },
];

const loadItems = async (options: {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
}) => {
  loading.value = true;
  try {
    await router.get('/students', {
      search: search.value,
      status: statusFilter.value,
      page: options.page,
      perPage: options.itemsPerPage,
      sortBy: options.sortBy?.length > 0 ? options.sortBy[0].key : null,
      sortOrder: options.sortBy?.length > 0 ? options.sortBy[0].order : null,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });

    // Atualiza o total de itens com base nos `props` atualizados
    totalItems.value = props.students.meta.total;
  } finally {
    loading.value = false;
  }
};

watchEffect(() => {
  totalItems.value = props.students.meta.total;
});

watch(
  () => search.value,
  _.debounce(() => {
    loadItems({
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
    });
  }, 300)
);

watch(
  () => statusFilter.value,
  () => {
    loadItems({
      page: currentPage.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
    });
  }
);

const navigateTo = (routeName: string, params: Record<string, any> = {}) => {
  const currentQuery = new URLSearchParams(window.location.search)

  if (routeName === 'students.create') {
    router.visit(`/students/create?${currentQuery.toString()}`)
  } else if(routeName === 'students.edit') {
    router.visit(`/students/${params.id}/edit?${currentQuery.toString()}`)
  } else if(routeName === 'students.show') {
    router.visit(`/students/${params.id}?${currentQuery.toString()}`)
  }
}

const confirmDelete = (student : Student) => {
  selectedStudent.value = student
  currentAction.value = 'delete'
  dialogTitle.value = 'Confirmar Desativação'
  dialogMessage.value = `Tem certeza que deseja desativar o aluno ${student.name}?`
  dialogConfirmText.value = 'Desativar'
  dialogConfirmColor.value = 'error'
  confirmationDialog.value = true
}

const confirmRestore = (student : Student) => {
  selectedStudent.value = student
  currentAction.value = 'restore'
  dialogTitle.value = 'Confirmar Restauração'
  dialogMessage.value = `Tem certeza que deseja restaurar o aluno ${student.name}?`
  dialogConfirmText.value = 'Restaurar'
  dialogConfirmColor.value = 'info'
  confirmationDialog.value = true
}

const confirmPermanentDelete = (student : Student) => {
  selectedStudent.value = student
  currentAction.value = 'permanentDelete'
  dialogTitle.value = 'Confirmar Exclusão Permanente'
  dialogMessage.value = `Tem certeza que deseja excluir permanentemente o aluno ${student.name}?`
  dialogConfirmText.value = 'Excluir'
  dialogConfirmColor.value = 'error'
  confirmationDialog.value = true
}

const handleConfirm = async () => {
  if (!selectedStudent.value) return;

  try {
    switch (currentAction.value) {
      case 'delete':
        await router.delete(`/students/${selectedStudent.value.id}`);
        snackbar.value = {
          show: true,
          message: 'Aluno desativado com sucesso!',
          color: 'success'
        };
        break;

      case 'restore':
        await router.post(`/students/${selectedStudent.value.id}/restore`);
        snackbar.value = {
          show: true,
          message: 'Aluno restaurado com sucesso!',
          color: 'success'
        };
        break;

      case 'permanentDelete':
        await router.delete(`/students/${selectedStudent.value.id}/permanent-delete`);
        snackbar.value = {
          show: true,
          message: 'Aluno excluído permanentemente!',
          color: 'success'
        };
        break;
    }

    totalItems.value = props.students.meta.total;
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Erro ao executar a operação!',
      color: 'error'
    };
  } finally {
    confirmationDialog.value = false;
    selectedStudent.value = null;
    currentAction.value = null;
  }
};
</script>