import vine from '@vinejs/vine'

export const createStudentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email().unique(async (db, value) => {
      const exists = await db
        .from('students')
        .where('email', value)
        .first()
      return !exists
    }),
    ra: vine.string().trim().unique(async (db, value) => {
      const exists = await db
        .from('students')
        .where('ra', value)
        .first()
      return !exists
    }),
    cpf: vine.string().trim().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).unique(async (db, value) => {
      const exists = await db
        .from('students')
        .where('cpf', value)
        .first()
      return !exists
    })
  })
)

export const updateStudentValidator = vine.withMetaData<{ studentId: number }>().compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email().unique(async (db, value, field) => {
      const exists = await db
        .from('students')
        .whereNot('id', field.meta.studentId)
        .where('email', value)
        .first()
      return !exists
    }),
    ra: vine.string().trim().unique(async (db, value, field) => {
      const exists = await db
        .from('students')
        .whereNot('id', field.meta.studentId)
        .where('ra', value)
        .first()
      return !exists
    }).optional(),
    cpf: vine.string().trim().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).unique(async (db, value, field) => {
      const exists = await db
        .from('students')
        .whereNot('id', field.meta.studentId)
        .where('cpf', value)
        .first()
      return !exists
    }).optional()
  })
)