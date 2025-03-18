<template>
    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <h1 class="text-h4">Cadastrar Novo Aluno</h1>
                <v-btn color="secondary" prepend-icon="mdi-arrow-left" @click="navigateToIndex">
                    Voltar para lista
                </v-btn>
            </v-col>
        </v-row>

        <v-card>
            <v-card-text>
                <v-form @submit.prevent="submitForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name" label="Nome Completo" :error-messages="errors.name"
                                required
                                @input="form.name.length > 0 ? errors.name = null : null"
                                ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.email" label="Email" type="email" :error-messages="errors.email"
                                required
                                @input="form.email.length > 0 ? errors.email = null : null"
                                ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.ra" label="RA (Registro Acadêmico)" :error-messages="errors.ra"
                                required
                                @input="form.ra.length > 0 ? errors.ra = null : null"
                                ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.cpf" label="CPF" @input="handleCpfInput"
                                :error-messages="errors.cpf" required
                                ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn color="primary" type="submit" :loading="loading">
                                Salvar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import { cpfMask } from '../../../utils/mask_utils';

const handleCpfInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    form.cpf = cpfMask(input.value);

    form.cpf.length > 0 ? errors.value.cpf = null : null
};

const form = useForm({
    name: '',
    email: '',
    ra: '',
    cpf: ''
})

const loading = ref(false)
const errors = ref({
    name: null as string[] | null,
    email: null as string[] | null,
    ra: null as string[] | null,
    cpf: null as string[] | null
})

const navigateToIndex = () => {
  const currentQuery = new URLSearchParams(window.location.search)
  router.visit(`/students?${currentQuery.toString()}`)
}

const submitForm = async () => {
  loading.value = true;

  const currentQuery = new URLSearchParams(window.location.search).toString();

  errors.value = {
    name: null,
    email: null,
    ra: null,
    cpf: null,
  };

  try {
    await form.post(`/students?${currentQuery}`, {
      onSuccess: () => {
        // Não é necessário redirecionar manualmente, o Inertia já cuida disso
      },
      onError: (err) => {
        errors.value = Object.assign({}, errors.value, err);
      },
    });
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
  } finally {
    loading.value = false;
  }
};
</script>