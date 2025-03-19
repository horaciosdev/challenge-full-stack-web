import { test } from '@japa/runner'
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import { loginValidator, createUserValidator } from '#validators/user'
import Student from '#models/student'
import User from '#models/user'
import Database from '@adonisjs/lucid/services/db'


test.group('Validators', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('createUserValidator validates correct data', async ({ assert }) => {
        const validData = {
            fullName: 'New User',
            email: 'new@example.com',
            password: 'password123',
            passwordConfirmation: 'password123'
        }

        try {
            const result = await createUserValidator.validate(validData)
            assert.equal(result.fullName, 'New User')
            assert.equal(result.email, 'new@example.com')
            assert.equal(result.password, 'password123')
        } catch (error) {
            assert.fail('Não deveria lançar erro para dados válidos')
        }
    })

    test('createUserValidator enforces uniqueness', async ({ assert }) => {
        await User.create({
            fullName: 'Existing User',
            email: 'existing.user@example.com',
            password: 'password123'
        })

        const duplicateData = {
            fullName: 'Another User',
            email: 'existing.user@example.com', // email duplicado
            password: 'password123',
            passwordConfirmation: 'password123'
        }

        try {
            await createUserValidator.validate(duplicateData)
            assert.fail('Deveria ter lançado erro de unicidade')
        } catch (error) {
            assert.property(error, 'messages')
            assert.isArray(error.messages)

            const fieldErrors = error.messages.reduce((acc: any, error: any) => {
                if (!acc[error.field]) {
                    acc[error.field] = []
                }
                acc[error.field].push(error)
                return acc
            }, {})

            assert.property(fieldErrors, 'email')
        }
    })

    test('loginValidator validates correct credentials', async ({ assert }) => {
        const validCredentials = {
            email: 'login@example.com',
            password: 'password123'
        }

        try {
            const result = await loginValidator.validate(validCredentials)
            assert.deepEqual(result, validCredentials)
        } catch (error) {
            assert.fail('Não deveria lançar erro para credenciais válidas')
        }
    })

    test('loginValidator rejects invalid credentials', async ({ assert }) => {
        const invalidCredentials = {
            email: 'not-an-email', // email inválido
            password: '' // senha vazia
        }

        try {
            await loginValidator.validate(invalidCredentials)
            assert.fail('Deveria ter lançado erro de validação')
        } catch (error) {
            assert.property(error, 'messages')
            assert.isArray(error.messages)

            const fieldErrors = error.messages.reduce((acc: any, error: any) => {
                if (!acc[error.field]) {
                    acc[error.field] = []
                }
                acc[error.field].push(error)
                return acc
            }, {})

            assert.property(fieldErrors, 'email')
            assert.property(fieldErrors, 'password')
        }
    })

    test('createStudentValidator validates correct data', async ({ assert }) => {
        const validData = {
            name: 'Valid Student',
            email: 'valid@example.com',
            ra: 'VALID123',
            cpf: '123.456.789-10'
        }

        try {
            const result = await createStudentValidator.validate(validData)
            assert.deepEqual(result, validData)
        } catch (error) {
            assert.fail('Não deveria lançar erro para dados válidos')
        }
    })

    test('createStudentValidator rejects invalid data', async ({ assert }) => {
        const invalidData = {
            name: 'x', // muito curto
            email: 'not-an-email',
            ra: '', // vazio
            cpf: '123456789' // formato inválido
        }

        try {
            await createStudentValidator.validate(invalidData)
            assert.fail('Deveria ter lançado erro de validação')
        } catch (error) {
            assert.property(error, 'messages')
            assert.isArray(error.messages)

            const fieldErrors = error.messages.reduce((acc: any, error: any) => {
                if (!acc[error.field]) {
                    acc[error.field] = []
                }
                acc[error.field].push(error)
                return acc
            }, {})

            assert.property(fieldErrors, 'name')
            assert.property(fieldErrors, 'email')
            assert.property(fieldErrors, 'cpf')
        }
    })

    test('createStudentValidator enforces uniqueness', async ({ assert }) => {
        await Student.create({
            name: 'Existing Student',
            email: 'existing@example.com',
            ra: 'EXIST123',
            cpf: '123.456.789-01'
        })

        const duplicateData = {
            name: 'Another Student',
            email: 'existing@example.com', // email duplicado
            ra: 'EXIST123', // ra duplicado
            cpf: '123.456.789-01' // cpf duplicado
        }

        try {
            await createStudentValidator.validate(duplicateData)
            assert.fail('Deveria ter lançado erro de unicidade')
        } catch (error) {
            assert.property(error, 'messages')
            assert.isArray(error.messages)

            const fieldErrors = error.messages.reduce((acc: any, error: any) => {
                if (!acc[error.field]) {
                    acc[error.field] = []
                }
                acc[error.field].push(error)
                return acc
            }, {})

            assert.property(fieldErrors, 'email')
            assert.property(fieldErrors, 'ra')
            assert.property(fieldErrors, 'cpf')
        }
    })

    test('updateStudentValidator allows updating own record', async ({ assert }) => {
        const student = await Student.create({
            name: 'Update Test',
            email: 'update@example.com',
            ra: 'UPDATE123',
            cpf: '11122233344'
        })

        const updateData = {
            name: 'Updated Name',
            email: 'update@example.com', // mesmo email
            ra: 'UPDATE123', // mesmo ra
            cpf: '111.222.333-44' // mesmo cpf, formato diferente
        }

        try {
            const result = await updateStudentValidator.validate(updateData, {
                meta: { studentId: student.id }
            })
            assert.equal(result.name, 'Updated Name')
        } catch (error) {
            assert.fail('Não deveria lançar erro ao atualizar próprio registro')
        }
    })
})