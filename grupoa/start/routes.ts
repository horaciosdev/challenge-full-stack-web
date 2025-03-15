/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import StudentsController from '#controllers/students_controller';

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home')

router.resource('students', StudentsController)