<template>
    <Head title="Aluno" />

    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <h1 class="text-h4">Detalhes do Aluno</h1>
                <div>
                    <v-btn color="secondary" prepend-icon="mdi-arrow-left" class="mr-2" @click="navigateToIndex">
                        Voltar para lista
                    </v-btn>
                    <v-btn color="primary" prepend-icon="mdi-pencil" @click="navigateToEdit">
                        Editar
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <v-card>
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-list>
                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                                </template>
                                <v-list-item-title>Nome</v-list-item-title>
                                <v-list-item-subtitle>{{ student.name }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                                </template>
                                <v-list-item-title>Email</v-list-item-title>
                                <v-list-item-subtitle>{{ student.email }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon color="primary" class="mr-2">mdi-card-account-details</v-icon>
                                </template>
                                <v-list-item-title>RA (Registro Acadêmico)</v-list-item-title>
                                <v-list-item-subtitle>{{ student.ra }}</v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                                <template v-slot:prepend>
                                    <v-icon color="primary" class="mr-2">mdi-id-card</v-icon>
                                </template>
                                <v-list-item-title>CPF</v-list-item-title>
                                <v-list-item-subtitle>{{ student.cpf }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-col>

                    <!-- Exibir as turmas e escolas associadas -->
                    <v-col cols="12" md="6">
                        <h2 class="text-h6">Turmas</h2>
                        <v-list v-if="student.classes.length">
                            <v-list-item v-for="classItem in student.classes" :key="classItem.id">
                                <template v-slot:prepend>
                                    <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                                </template>
                                <v-list-item-title>{{ classItem.name }}</v-list-item-title>
                                <v-list-item-subtitle v-if="classItem.school">
                                    Escola: {{ classItem.school.name }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                        <p v-else>Nenhuma turma cadastrada.</p>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'

interface School {
    id: number
    name: string
}

interface Class {
    id: number
    name: string
    school: School | null
}

interface Student {
    id: number
    name: string
    email: string
    ra: string
    cpf: string
    classes: Class[]
}

const props = defineProps<{ student: Student }>()

const navigateToIndex = () => {
    const currentQuery = new URLSearchParams(window.location.search)
    router.visit(`/students?${currentQuery.toString()}`)
}

const navigateToEdit = () => {
    const currentQuery = new URLSearchParams(window.location.search)
    router.visit(`/students/${props.student.id}/edit?${currentQuery.toString()}`)
}
</script>
