import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let inMemoryUsersRepository: InMemoryUsersRepository
let createUser: CreateUserUseCase
let authenticateUser: AuthenticateUserUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createUser = new CreateUserUseCase(
      inMemoryUsersRepository
    )
    authenticateUser = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to create a user session', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    const response = await authenticateUser.execute({
      email: 'john@exemple.com',
      password: 'password'
    })

    expect(response).toHaveProperty('token')
    expect(response.user.id).toBe(user.id)
  })

  it('should not be able to create a user session with non-existent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'non-existent@exemple.com',
        password: 'password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to create a user session with an invalid password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    await expect(
      authenticateUser.execute({
        email: 'john@exemple.com',
        password: 'invalid-password'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
