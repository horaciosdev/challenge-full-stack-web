/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import StudentsController from '#controllers/students_controller';
import SessionController from '#controllers/session_controller';
import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

// Rotas públicas
router.get('/', ({ inertia }) => inertia.render('home')).as('home');

router.get('/login', [SessionController, 'show']).as('login').use(middleware.guest());
router.post('/login', [SessionController, 'store']).as('login.store').use(middleware.guest());

router.get('/register', [SessionController, 'showRegister']).as('register').use(middleware.guest());
router.post('/register', [SessionController, 'register']).as('register.store').use(middleware.guest());


// Rotas protegidas (acessíveis apenas para usuários autenticados)
router.post('/logout', [SessionController, 'destroy']).as('logout').use(middleware.auth());

router.group(() => {
  router.get('/dashboard', [StudentsController, 'dashboard']).as('dashboard');

  router.resource('students', StudentsController)

  router.group(() => {
    router.post('/:id/restore', [StudentsController, 'restore']).as('students.restore');
    router.delete('/:id/permanent-delete', [StudentsController, 'forceDestroy']).as('students.permanent-delete');
  }).prefix('students');
}).use([middleware.auth()]);