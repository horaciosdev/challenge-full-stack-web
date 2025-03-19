import Class from '#models/class'
import School from '#models/school'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import env from '#start/env'
import app from '@adonisjs/core/services/app'

export default class extends BaseSeeder {
    async run() {
        const allowSeeding = env.get('ALLOW_DB_SEEDING', 'false') === 'true'
        const allowProductionSeeding = env.get('ALLOW_PRODUCTION_SEEDING', 'false') === 'true'

        if (!allowSeeding) {
            console.log('Database seeding is disabled. Set ALLOW_DB_SEEDING=true in .env to enable it.')
            return
        }

        if (app.inProduction && !allowProductionSeeding) {
            console.log('Production seeding is disabled for safety. Set ALLOW_PRODUCTION_SEEDING=true to enable it.')
            return
        }

        await Class.query().delete()

        const schools = await School.all()

        if (schools.length === 0) {
            console.log('No schools found. Please run school seeder first.')
            return
        }

        const classNames = [
            'Programação Web',
            'Algoritmos e Estruturas de Dados',
            'Banco de Dados',
            'Desenvolvimento Mobile',
            'Inteligência Artificial',
            'Matemática Discreta',
            'Cálculo I',
            'Física Básica',
            'Redes de Computadores',
            'Sistemas Operacionais',
            'Engenharia de Software',
            'Arquitetura de Computadores',
            'Segurança da Informação',
            'Computação Gráfica',
            'Estatística e Probabilidade',
            'Língua Portuguesa',
            'Inglês Técnico',
            'Química Geral',
            'Biologia Celular',
            'História da Ciência',
            'Geografia Econômica',
            'Sociologia',
            'Filosofia',
            'Educação Física',
            'Artes Visuais',
            'Música',
            'Empreendedorismo',
            'Gestão de Projetos',
            'Ética Profissional'
        ]

        const classes = []

        // Para cada escola, criar 3-5 turmas
        for (const school of schools) {
            const classCount = faker.number.int({ min: 3, max: 5 })

            // Garantir que cada escola tenha uma turma de Programação Web
            classes.push({
                name: 'Programação Web',
                schoolId: school.id
            })

            // Adicionar outras turmas aleatoriamente
            for (let i = 0; i < classCount - 1; i++) {
                const availableNames = classNames.filter(name => name !== 'Programação Web')
                const randomName = availableNames[faker.number.int({ min: 0, max: availableNames.length - 1 })]

                classes.push({
                    name: randomName,
                    schoolId: school.id
                })
            }
        }

        await Class.createMany(classes)
        console.log(`Created ${classes.length} classes across ${schools.length} schools.`)
    }
}