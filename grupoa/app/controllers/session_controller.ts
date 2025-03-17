import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, loginValidator } from '#validators/user';

export default class SessionController {
    async show({ inertia, auth }: HttpContext) {
        return inertia.render('auth/login', {
            auth: {
                user: auth.user,
            },
        });
    }

    async showRegister({ inertia }: HttpContext) {
        return inertia.render('auth/register')
    }

    public async store({ request, auth, response, inertia }: HttpContext) {
        const payload = await request.validateUsing(loginValidator)

        try {
            const user = await User.verifyCredentials(payload.email, payload.password)
            await auth.use('web').login(user)
            return response.redirect('/dashboard')
        } catch (error) {
            if (error.code === 'E_INVALID_CREDENTIALS') {
                return inertia.render('auth/login', {
                  errors: { credentials: 'Credenciais inválidas. Por favor, verifique seu email e senha.' }
                })
              }

              return inertia.render('auth/login', {
                errors: { default: 'Ocorreu um erro interno. Por favor, tente novamente mais tarde.' }
              })
        }
    }

    async register({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createUserValidator)

        await User.create({
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
        })

        return response.redirect('/login')
    }

    async destroy({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/login')
    }
}