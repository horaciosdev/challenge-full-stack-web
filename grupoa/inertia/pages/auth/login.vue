<template>
    <Head title="Login" />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="12">
            <v-toolbar color="primary">
              <v-toolbar-title>Acesso ao Sistema</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-form @submit.prevent="submit">
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

                <v-btn
                  type="submit"
                  color="primary"
                  block
                  :loading="loading"
                >
                  Entrar
                </v-btn>
              </v-form>
              <v-divider class="my-4"></v-divider>
              <v-btn
                color="secondary"
                block
                @click="navigateToRegister"
              >
                Registrar-se
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
  email: '',
  password: '',
})

const loading = ref(false)

const submit = () => {
  loading.value = true
  form.post('/login', {
    onSuccess: () => {
      router.visit('/dashboard')
    },
    onError: () => {
      // TODO Tratar erros
      console.log('Erro no login')
    },
    onFinish: () => {
      loading.value = false
    },
  })
}

const navigateToRegister = () => {
  router.visit('/register')
}
</script>