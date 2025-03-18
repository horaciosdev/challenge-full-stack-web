import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string(),
    })
)

export const createUserValidator = vine.compile(
    vine.object({
        fullName: vine.string().trim().minLength(3),
        email: vine.string().trim().email().unique({
            table: 'users',
            column: 'email',
            caseInsensitive: true
        }),
        password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
    })
)