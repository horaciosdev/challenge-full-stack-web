import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/auth'

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

    async store({ request, auth, response, session }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        try {
            const user = await User.verifyCredentials(email, password)
            await auth.use('web').login(user)
            return response.redirect('/dashboard')
        } catch (error) {
            if (error instanceof errors.E_INVALID_CREDENTIALS) {
                session.flash('errors', {
                    email: 'Credenciais inválidas',
                })
            } else {
                session.flash('errors', {
                    email: 'Ocorreu um erro durante o login',
                })
            }

            return response.redirect().back()
        }
    }

    async register({ request, response, session }: HttpContext) {
        const { fullName, email, password, passwordConfirmation } = request.only([
            'fullName',
            'email',
            'password',
            'passwordConfirmation',
        ])

        try {
            await User.createWithPasswordConfirmation({
                fullName,
                email,
                password,
                passwordConfirmation,
            })

            return response.redirect('/login')
        } catch (error) {
            session.flash('errors', {
                email: 'Erro ao registrar o usuário',
            })
            return response.redirect().back()
        }
    }

    async destroy({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/login')
    }
}