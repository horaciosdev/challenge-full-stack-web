import type { HttpContext } from '@adonisjs/core/http'

import Student from "#models/student"
import { createStudentValidator, updateStudentValidator } from '#validators/student'

export default class StudentsController {

  public async index({ inertia, request }: HttpContext) {
    const input = request.all()

    let query = Student.query()

    // Filtro de status
    if (input.status === 'active') {
      query = query.apply((scopes) => scopes.withoutTrashed());
    } else if (input.status === 'inactive') {
      query = query.apply((scopes) => scopes.onlyTrashed());
    } else {
      query = query.apply((scopes) => scopes.withTrashed());
    }

    // Pesquisa (case-insensitive)
    if (input.search) {
      query.where('name', 'ilike', `%${input.search}%`)
    }

    query.orderBy('id', 'asc');

    // Ordenação
    if (input.sortBy) {
      query.orderBy(input.sortBy[0].key, input.sortBy[0].order)
    }

    // Paginação
    const page = input.page || 1
    const perPage = input.perPage || 10
    const students = await query.paginate(page, perPage)

    return inertia.render('students/index', {
      students,
      filters: {
        search: input.search,
        status: input.status
      }
    })
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

    await student.softDelete()

    return response.redirect().toRoute('students.index')
  }

  public async forceDestroy({ params, response }: HttpContext) {
    const student = await Student.query()
      .apply((scopes) => scopes.withTrashed())
      .where('id', params.id)
      .firstOrFail()

    await student.delete()

    return response.redirect().toRoute('students.index')
  }

  public async restore({ params, response }: HttpContext) {
    const student = await Student.query()
      .apply((scopes) => scopes.onlyTrashed())
      .where('id', params.id)
      .firstOrFail()

    await student.restore()

    return response.redirect().toRoute('students.index')
  }

}