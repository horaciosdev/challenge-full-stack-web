import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'
import app from '@adonisjs/core/services/app'

export default class MainSeeder extends BaseSeeder {
    async run() {
        // Verifica se o seeding está habilitado através da variável de ambiente
        const allowSeeding = env.get('ALLOW_DB_SEEDING', 'false') === 'true'

        // Verifica se está em produção e se o seeding de produção está explicitamente habilitado
        const allowProductionSeeding = env.get('ALLOW_PRODUCTION_SEEDING', 'false') === 'true'

        if (!allowSeeding) {
            console.log('Database seeding is disabled. Set ALLOW_DB_SEEDING=true in .env to enable it.')
            return
        }

        // Verificação de segurança adicional para ambiente de produção
        if (app.inProduction && !allowProductionSeeding) {
            console.log('Production seeding is disabled for safety. Set ALLOW_PRODUCTION_SEEDING=true to enable it.')
            return
        }

        try {
            // Importando os seeders
            const SchoolSeeder = await import('#database/seeders/school_seeder')
            const ClassSeeder = await import('#database/seeders/class_seeder')
            const StudentSeeder = await import('#database/seeders/student_seeder')

            // Executando seeders na ordem correta
            await new SchoolSeeder.default(this.client).run()
            console.log('✓ School seeder executed successfully')

            await new ClassSeeder.default(this.client).run()
            console.log('✓ Class seeder executed successfully')

            await new StudentSeeder.default(this.client).run()
            console.log('✓ Student seeder executed successfully')

            console.log('All seeders executed successfully in the correct order!')
        } catch (error) {
            console.error('Error during seeding:', error)
            process.exit(1)
        }
    }
}