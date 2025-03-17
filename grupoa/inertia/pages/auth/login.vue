<template>
  <Head title="Login" />
  <v-container fluid class="fill-height">
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="12" rounded="lg" class="mx-auto">
          <v-card-item class="bg-primary">
            <v-card-title class="text-h5 text-white text-center py-4">
              <v-icon icon="mdi-account-circle" size="large" class="me-2" />
              Acesso ao Sistema
            </v-card-title>
          </v-card-item>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="form.email"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                type="email"
                required
                :error-messages="form.errors.email"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                required
                :error-messages="form.errors.password"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>

              <v-alert v-if="errors.credentials || errors.default" type="error">
                {{ errors.credentials || errors.default }}
              </v-alert>

              <div class="d-flex justify-space-between align-center mt-2 mb-6">
                <v-checkbox label="Lembrar-me" density="compact" color="primary" v-model="rememberMe"></v-checkbox>
                <a href="#" class="text-decoration-none text-primary">Esqueceu a senha?</a>
              </div>

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                size="large"
                elevation="2"
              >
                <v-icon start icon="mdi-login-variant" class="me-2"></v-icon>
                Entrar
              </v-btn>
            </v-form>

            <v-divider class="my-5"></v-divider>

            <div class="text-center mb-4">
              <span class="text-medium-emphasis">Novo por aqui?</span>
            </div>

            <v-btn
              color="secondary"
              variant="outlined"
              block
              @click="navigateToRegister"
              class="mb-2"
            >
              <v-icon start icon="mdi-account-plus" class="me-2"></v-icon>
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

const errors = ref({
  email: null as string[] | null,
  password: null as string[] | null,
  credentials: null as string[] | null,
  default: null as string[] | null,
})

const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

const submit = () => {
  loading.value = true

  errors.value = {
    email: null,
    password: null,
    credentials: null,
    default: null,
  }

  form.post('/login', {
    onSuccess: () => {
      router.visit('/dashboard')
    },
    onError: (err) => {
      errors.value = Object.assign({}, errors.value, err)
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