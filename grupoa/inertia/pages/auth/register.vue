<template>
  <Head title="Registro" />
  <v-container fluid class="fill-height">
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card elevation="12" rounded="lg" class="mx-auto">
          <v-card-item class="bg-primary">
            <v-card-title class="text-h5 text-white text-center py-4">
              <v-icon icon="mdi-account-plus" size="large" class="me-2" />
              Cadastre-se no Sistema
            </v-card-title>
          </v-card-item>

          <v-card-text class="pa-6">
            <v-form @submit.prevent="submit">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.fullName"
                    label="Nome Completo"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    type="text"
                    required
                    :error-messages="form.errors.fullName"
                    @input="form.fullName.length > 0 ? form.errors.fullName = null : null"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.email"
                    label="E-mail"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    type="email"
                    required
                    :error-messages="form.errors.email"
                    @input="form.email.length > 0 ? form.errors.email = null : null"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.password"
                    label="Senha"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    :error-messages="form.errors.password"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @input="form.password.length > 0 ? form.errors.password = null : null"
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>

                  <!-- Indicador de força de senha (apenas informativo) -->
                  <div v-if="form.password">
                    <div class="d-flex align-center mb-1">
                      <div class="me-2 text-body-2">Força da senha:</div>
                      <div class="d-flex flex-grow-1">
                        <v-progress-linear
                          :model-value="passwordStrength.score * 25"
                          :color="passwordStrengthColor"
                          height="8"
                        ></v-progress-linear>
                      </div>
                      <div class="ms-2 text-body-2" :class="`text-${passwordStrengthColor}`">
                        {{ passwordStrength.message }}
                      </div>
                    </div>
                    <div class="text-caption text-grey" v-if="passwordStrength.feedback">
                      {{ passwordStrength.feedback }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="form.passwordConfirmation"
                    label="Confirmar Senha"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    :error-messages="form.errors.passwordConfirmation"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  ></v-text-field>
                  <div v-if="form.passwordConfirmation && form.password !== form.passwordConfirmation" class="text-caption text-error mb-2">
                    As senhas não coincidem
                  </div>
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                size="large"
                elevation="2"
              >
                <v-icon start icon="mdi-account-plus" class="me-2"></v-icon>
                Criar Conta
              </v-btn>
            </v-form>

            <v-divider class="my-5"></v-divider>

            <div class="text-center mb-4">
              <span class="text-medium-emphasis">Já tem uma conta?</span>
            </div>

            <v-btn
              color="secondary"
              variant="outlined"
              block
              @click="navigateToLogin"
            >
              <v-icon start icon="mdi-login-variant" class="me-2"></v-icon>
              Fazer Login
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { router, useForm } from '@inertiajs/vue3'

const form = useForm({
fullName: '',
email: '',
password: '',
passwordConfirmation: '',
})

const errors = ref({
  email: null as string[] | null,
  password: null as string[] | null,
  fullName: null as string[] | null,
  passwordConfirmation: null as string[] | null
})

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Estado da força da senha (apenas informativo)
const passwordStrength = computed(() => {
const password = form.password

if (!password) {
  return { score: 0, message: '', feedback: '', color: 'grey' }
}

const hasUpperCase = /[A-Z]/.test(password)
const hasLowerCase = /[a-z]/.test(password)
const hasNumber = /[0-9]/.test(password)
const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
const isLongEnough = password.length >= 8

let score = 0
let feedback = ''

if (isLongEnough) score += 1
if (hasUpperCase && hasLowerCase) score += 1
if (hasNumber) score += 1
if (hasSpecialChar) score += 1

// Feedback específico baseado nas falhas (apenas sugestões)
if (!isLongEnough) {
  feedback = 'Sugestão: adicione mais caracteres para uma senha mais forte'
} else if (!hasUpperCase || !hasLowerCase) {
  feedback = 'Sugestão: combine letras maiúsculas e minúsculas'
} else if (!hasNumber) {
  feedback = 'Sugestão: inclua números para aumentar a segurança'
} else if (!hasSpecialChar) {
  feedback = 'Sugestão: adicione caracteres especiais (!@#$%) para máxima segurança'
}

let message = ''
if (score === 0) message = 'Muito fraca'
else if (score === 1) message = 'Fraca'
else if (score === 2) message = 'Média'
else if (score === 3) message = 'Forte'
else message = 'Muito forte'

return { score, message, feedback }
})

// Cor do indicador de força da senha
const passwordStrengthColor = computed(() => {
const score = passwordStrength.value.score
if (score === 0 || score === 1) return 'error'
else if (score === 2) return 'warning'
else if (score === 3) return 'success'
else return 'success'
})

const submit = () => {
  loading.value = true

  errors.value = {
    email: null,
    password: null,
    fullName: null,
    passwordConfirmation: null
  }

  form.post('/register', {
    onSuccess: () => {
      router.visit('/login')
    },
    onError: (err) => {
      errors.value = Object.assign({}, errors.value, err)
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