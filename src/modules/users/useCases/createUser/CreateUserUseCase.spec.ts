
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from './CreateUserUseCase'
import { CreateUserError } from './CreateUserError'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUse: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createUserUse = new CreateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to create a user', async () => {
    const user = await createUserUse.execute({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a user with same email', async () => {
    await createUserUse.execute({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    await expect(
      createUserUse.execute({
        name: 'John Doe',
        email: 'john@exemple.com',
        password: 'password'
      })
    ).rejects.toBeInstanceOf(CreateUserError)
  })
})
