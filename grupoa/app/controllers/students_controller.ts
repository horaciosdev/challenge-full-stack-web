import type { HttpContext } from '@adonisjs/core/http'

import Student from "#models/student"
import { createStudentValidator, updateStudentValidator } from '#validators/student'

export default class StudentsController {

  public async index({ inertia }: HttpContext) {
    const students = await Student.all()
    return inertia.render('students/index', { students })
  }

  public async create({ inertia }: HttpContext) {
    return inertia.render('students/create')
  }

  public async store({ request, response }: HttpContext) {

    const payload = await request.validateUsing(createStudentValidator)

    await Student.create(payload)

    return response.redirect().toRoute('students.index')
  }

  public async show({ params, inertia }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    return inertia.render('students/show', { student })
  }

  public async edit({ params, inertia }: HttpContext) {
    const student = await Student.findOrFail(params.id)
    return inertia.render('students/edit', { student })
  }

  public async update({ params, request, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)

    const payload = await request.validateUsing(updateStudentValidator, {
      meta: {
        studentId: student.id
      }
    })

    student.merge(payload)
    await student.save()

    return response.redirect().toRoute('students.index')
  }

  public async destroy({ params, response }: HttpContext) {
    const student = await Student.findOrFail(params.id)

    await student.delete()

    return response.redirect().toRoute('students.index')
  }
}