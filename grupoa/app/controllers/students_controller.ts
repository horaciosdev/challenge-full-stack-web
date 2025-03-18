import type { HttpContext } from '@adonisjs/core/http'

import Student from "#models/student"
import { createStudentValidator, updateStudentValidator } from '#validators/student'
import { justNumbers } from '../../utils/string_utils.js'

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

    // Ordenação
    if (input.sortBy && input.sortOrder) {
      query.orderBy(input.sortBy, input.sortOrder)
    }else{
      query.orderBy('created_at', 'desc');
    }

    // Paginação
    const page = input.page || 1
    const perPage = input.perPage || 10
    const students = await query.paginate(page, perPage)

    const formattedStudents = {
      ...students.toJSON(),
      data: students.toJSON().data.map((student) => ({
        ...student.serialize(),
        createdAt: student.createdAt.toFormat('dd/MM/yyyy'),
        updatedAt: student.updatedAt.toFormat('dd/MM/yyyy'),
        deletedAt: student.deletedAt?.toFormat('dd/MM/yyyy'),
      })),
    }

    return inertia.render('students/index', {
      students : formattedStudents,
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

    if (payload.cpf) {
      payload.cpf = justNumbers(payload.cpf)
    }

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

    delete payload.ra
    delete payload.cpf

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

  public async dashboard({ inertia }: HttpContext) {
    const totalStudents = await Student.query().apply((scopes) => scopes.withTrashed()).count('* as total')
    const activeStudents = await Student.query().apply((scopes) => scopes.withoutTrashed()).count('* as active')
    const inactiveStudents = await Student.query().apply((scopes) => scopes.onlyTrashed()).count('* as inactive')

    const recentStudents = await Student.query().orderBy('created_at', 'desc').limit(5).then((students) =>
      students.map((student) => ({
        ...student.serialize(),
        createdAt: student.createdAt.toFormat('dd/MM/yyyy'),
        updatedAt: student.updatedAt.toFormat('dd/MM/yyyy'),
        deletedAt: student.deletedAt?.toFormat('dd/MM/yyyy'),
      }))
    )

    return inertia.render('dashboard', {
      totalStudents: totalStudents[0].$extras.total,
      activeStudents: activeStudents[0].$extras.active,
      inactiveStudents: inactiveStudents[0].$extras.inactive,
      recentStudents: recentStudents,
    })
  }

}