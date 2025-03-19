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

        await School.query().delete()

        const schoolNames = [
            'Edtech',
            'Instituto Federal de Tecnologia',
            'Colégio Inovação',
            'Escola Técnica Superior',
            'Centro Educacional Futuro',
            'Colégio Integrado',
            'Instituto de Ciências Aplicadas',
            'Escola Nova Geração',
            'Centro de Formação Profissional',
            'Academia de Desenvolvimento',
            'Colégio Tecnológico',
            'Instituto Educacional Avançado',
            'Escola Técnica Profissionalizante',
            'Centro de Estudos Modernos',
            'Academia de Ciências e Artes'
        ]

        const schools = []

        // Garantir que "Edtech" seja a primeira escola
        schools.push({
            name: 'Edtech',
            cnpj: faker.string.numeric(14)
        })

        // Adicionar mais 4 escolas aleatórias da lista (excluindo "Edtech")
        const otherSchools = schoolNames.slice(1)

        // Selecionar 4 escolas aleatórias da lista
        for (let i = 0; i < 4; i++) {
            const randomIndex = faker.number.int({ min: 0, max: otherSchools.length - 1 })
            const schoolName = otherSchools[randomIndex]

            schools.push({
                name: schoolName,
                cnpj: faker.string.numeric(14)
            })

            // Remover o nome usado para evitar duplicação
            otherSchools.splice(randomIndex, 1)
        }

        await School.createMany(schools)
        console.log(`Created ${schools.length} schools, including "Edtech".`)
    }
}