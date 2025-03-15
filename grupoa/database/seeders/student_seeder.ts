import Student from '#models/student'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker';

export default class extends BaseSeeder {
  async run() {
    await Student.query().delete();

    const students = [];
    for (let i = 0; i < 30; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      students.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({firstName, lastName}).toLocaleLowerCase(),
        ra: `2023${String(i + 1).padStart(4, '0')}`,
        cpf: faker.string.numeric(11),
      });
    }

    await Student.createMany(students);
  }
}