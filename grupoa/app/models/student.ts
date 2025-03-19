import { DateTime } from 'luxon'
import { BaseModel, column, beforeFind, beforeFetch, scope, manyToMany } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Class from './class.js'

export default class Student extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare ra: string

  @column()
  declare cpf: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @manyToMany(() => Class, {
    pivotTable: 'students_classes',
  })
  declare classes: ManyToMany<typeof Class>

  // Implementando soft delete como um escopo
  @beforeFind()
  @beforeFetch()
  static filterSoftDeleted(query: ModelQueryBuilderContract<typeof Student, Student>) {
    // Verifica se estamos consultando registros excluídos (flag interna)
    if (!(query as any)['_includeDeleted']) {
      query.whereNull('deleted_at')
    }
  }

  static withTrashed = scope((query) => {
    // Simplesmente define uma flag na query
    (query as any)['_includeDeleted'] = true
  })

  static onlyTrashed = scope((query) => {
    // Define a flag e adiciona a condição de deleted_at não nulo
    (query as any)['_includeDeleted'] = true
    query.whereNotNull('deleted_at')
  })

  static withoutTrashed = scope((query) => {
    // Remove a flag e adiciona a condição de deleted_at nulo
    (query as any)['_includeDeleted'] = false
    query.whereNull('deleted_at')
  })

  async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }

  async restore() {
    this.deletedAt = null
    await this.save()
  }
}
