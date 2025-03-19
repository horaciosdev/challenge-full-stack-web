import Student from '#models/student'
import Class from '#models/class'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
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

    await Student.query().delete()

    // Buscar todas as classes disponíveis
    const classes = await Class.all()

    // Se não há classes, não podemos atribuir estudantes
    if (classes.length === 0) {
      console.log('No classes found. Please run class seeder first.')
      return
    }

    const students = []
    const currentYear = new Date().getFullYear()

    for (let i = 0; i < 500; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()

      // Gerar uma data aleatória dentro de um mês do ano atual
      const createdAt = faker.date.between({
        from: new Date(currentYear, 0, 1),
        to: new Date(),
      })

      // Garantir que a data de exclusão seja posterior à data de criação
      const isDeleted = i % 10 === 0
      let deletedAt = null

      if (isDeleted) {
        const possibleDeletedAt = faker.date.between({
          from: createdAt,
          to: new Date(),
        })

        // Garantir que deletedAt seja sempre posterior a createdAt
        if (possibleDeletedAt > createdAt) {
          deletedAt = possibleDeletedAt
        }
      }

      // Garantir que updatedAt seja consistente
      const updatedAt = deletedAt || createdAt

      students.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        ra: `2025${String(i + 1).padStart(4, '0')}`,
        cpf: faker.string.numeric(11),
        createdAt: DateTime.fromJSDate(createdAt),
        updatedAt: DateTime.fromJSDate(updatedAt),
        deletedAt: deletedAt ? DateTime.fromJSDate(deletedAt) : null,
      })
    }

    // Criar todos os estudantes
    const createdStudents = await Student.createMany(students)

    // Atribuir aleatoriamente estudantes às classes
    for (const student of createdStudents) {
      // Selecionar um número aleatório de classes para este estudante (1-3 classes)
      const classCount = faker.number.int({ min: 1, max: 3 })

      // Selecionar classes aleatórias
      const randomClasses = faker.helpers.arrayElements(classes, classCount)

      // Relacionar o estudante com as classes
      await student.related('classes').attach(randomClasses.map(cls => cls.id))
    }
  }
}