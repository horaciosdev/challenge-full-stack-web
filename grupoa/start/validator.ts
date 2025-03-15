import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // General messages
  'required': 'O campo {{ field }} é obrigatório',
  'string': 'O valor do campo {{ field }} deve ser texto',
  'email': 'O valor não é um endereço de email válido',
  'regex': 'O formato do campo {{ field }} é inválido',
  'unique': 'Este {{ field }} já está sendo utilizado',
  'minLength': 'O campo {{ field }} deve ter pelo menos {{ min }} caracteres',

  // Field messages
  'name.required': 'O nome é obrigatório',
  'email.required': 'O email é obrigatório',
  'email.email': 'O email deve ser um endereço válido',
  'ra.required': 'O RA é obrigatório',
  'cpf.required': 'O CPF é obrigatório',
  'cpf.regex': 'O CPF deve estar no formato 000.000.000-00',
})