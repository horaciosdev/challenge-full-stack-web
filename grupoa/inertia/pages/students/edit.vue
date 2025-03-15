<template>
    <v-container>
        <v-row class="mb-4">
            <v-col cols="12" class="d-flex justify-space-between align-center">
                <h1 class="text-h4">Editar Aluno</h1>
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
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.email" label="Email" type="email" :error-messages="errors.email"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.ra" label="RA (Registro Acadêmico)" :error-messages="errors.ra"
                                required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.cpf" label="CPF" @input="handleCpfInput"
                                :error-messages="errors.cpf" required></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn color="primary" type="submit" :loading="loading">
                                Atualizar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import { cpfMask } from '../../../utils/mask_utils';

const handleCpfInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    form.cpf = cpfMask(input.value);
};

interface Student {
    id: number
    name: string
    email: string
    ra: string
    cpf: string
}

const props = defineProps<{ student: Student }>()

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

onMounted(() => {
    form.name = props.student.name
    form.email = props.student.email
    form.ra = props.student.ra
    form.cpf = cpfMask(props.student.cpf);
})

const navigateToIndex = () => {
    router.visit('/students')
}

const submitForm = async () => {
    loading.value = true
    try {
        await form.put(`/students/${props.student.id}`, {
            onSuccess: () => {
                router.visit('/students')
            },
            onError: (err) => {
                errors.value = Object.assign({}, errors.value, err)
            }
        })
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error)
    } finally {
        loading.value = false
    }
}
</script>