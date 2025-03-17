<template>
    <Head title="Registro" />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="12">
            <v-toolbar color="primary">
              <v-toolbar-title>Registro</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-form @submit.prevent="submit">
                <v-text-field
                  v-model="form.fullName"
                  label="Nome Completo"
                  prepend-icon="mdi-account"
                  type="text"
                  required
                  :error-messages="form.errors.fullName"
                ></v-text-field>

                <v-text-field
                  v-model="form.email"
                  label="E-mail"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                  :error-messages="form.errors.email"
                ></v-text-field>

                <v-text-field
                  v-model="form.password"
                  label="Senha"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                  :error-messages="form.errors.password"
                ></v-text-field>

                <v-text-field
                  v-model="form.passwordConfirmation"
                  label="Confirmar Senha"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                  :error-messages="form.errors.passwordConfirmation"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="primary"
                  block
                  :loading="loading"
                >
                  Registrar
                </v-btn>
              </v-form>
              <v-divider class="my-4"></v-divider>
              <v-btn
                color="secondary"
                block
                @click="navigateToLogin"
              >
                Já tem uma conta? Faça login
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { router, useForm } from '@inertiajs/vue3'

const form = useForm({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const loading = ref(false)

const submit = () => {
  loading.value = true
  form.post('/register', {
    onSuccess: () => {
      router.visit('/dashboard')
    },
    onError: () => {
      // TODO Tratar erros
      console.log('Erro no registro')
    },
    onFinish: () => {
      loading.value = false
    },
  })
}

const navigateToLogin = () => {
  router.visit('/login')
}
</script>