import Student from '#models/student'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

export default class extends BaseSeeder {
  async run() {
    await Student.query().delete();

    const students = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 500; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      // Gerar uma data aleatória dentro de um mês do ano atual
      const createdAt = faker.date.between({
        from: new Date(currentYear, 0, 1), // Garantir início do ano
        to: new Date(), // Garantir que seja até a data atual
      });

      // Garantir que a data de exclusão seja posterior à data de criação
      const isDeleted = i % 10 === 0;
      let deletedAt = null;

      if (isDeleted) {
        const possibleDeletedAt = faker.date.between({
          from: createdAt,
          to: new Date(),
        });

        // Garantir que deletedAt seja sempre posterior a createdAt
        if (possibleDeletedAt > createdAt) {
          deletedAt = possibleDeletedAt;
        }
      }

      // Garantir que updatedAt seja consistente
      const updatedAt = deletedAt || createdAt;

      students.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLocaleLowerCase(),
        ra: `2025${String(i + 1).padStart(4, '0')}`,
        cpf: faker.string.numeric(11),
        createdAt: DateTime.fromJSDate(createdAt),
        updatedAt: DateTime.fromJSDate(updatedAt),
        deletedAt: deletedAt ? DateTime.fromJSDate(deletedAt) : null,
      });
    }

    await Student.createMany(students);
  }
}