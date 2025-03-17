<template>
    <v-container class="fill-height" fluid>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" sm="10" md="8" lg="6" xl="4" class="text-center">
          <v-slide-y-transition>
            <v-card
              v-if="showCard"
              class="pa-6 pa-sm-12 rounded-xl"
              elevation="12"
              variant="flat"
            >
                <div class="mb-8">
                    <v-icon
                        class="text-primary mb-4"
                        size="64"
                    >
                        mdi-school-outline
                    </v-icon>

                    <v-card-title class="text-h2 font-weight-black text-primary mb-2">
                        Grupo A
                    </v-card-title>

                    <v-card-subtitle class="text-h5 text-medium-emphasis font-weight-medium">
                        Gestão Acadêmica Inteligente
                    </v-card-subtitle>
                </div>

                <v-divider class="my-6 opacity-50" />

                <v-card-text class="text-body-1 text-medium-emphasis px-lg-8 mx-lg-4">
                <p class="mb-0">
                    Bem-vindo ao sistema de gestão educacional do Grupo A. Gerencie alunos,
                    turmas e dados acadêmicos com eficiência e precisão.
                </p>
                </v-card-text>

                <v-btn
                    color="primary"
                    size="large"
                    class="mt-8 transition font-weight-bold rounded-pill hover:scale-105"
                    @click="navigateToDashboard"
                >
                    Acessar
                    <v-icon right size="24">mdi-chevron-right</v-icon>
                </v-btn>
            </v-card>
          </v-slide-y-transition>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { router } from '@inertiajs/vue3';

  const showCard = ref(false);

  const navigateToDashboard = () => {
    router.visit('/dashboard');
  };

  onMounted(() => {
    setTimeout(() => (showCard.value = true), 150);
  });
  </script>