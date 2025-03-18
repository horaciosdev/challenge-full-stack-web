import vine from '@vinejs/vine'

export const createStudentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email().unique({
      table: 'students',
      column: 'email',
      caseInsensitive: true
    }),
    ra: vine.string().trim().unique({
      table: 'students',
      column: 'ra'
    }),
    cpf: vine.string().trim().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).unique({
      table: 'students',
      column: 'cpf'
    })
  })
)

export const updateStudentValidator = vine.withMetaData<{ studentId: number }>().compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email().unique({
      table: 'students',
      column: 'email',
      caseInsensitive: true
    }),
    ra: vine.string().trim().unique({
      table: 'students',
      column: 'ra'
    }).optional(),
    cpf: vine.string().trim().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).unique({
      table: 'students',
      column: 'cpf'
    }).optional()
  })
)