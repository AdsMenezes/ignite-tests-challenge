
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { CreateStatementUseCase } from './CreateStatementUseCase'
import { CreateStatementError } from './CreateStatementError'

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatement: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    createStatement = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    )
  })

  it('should be able to make a deposit', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    const deposit = await createStatement.execute({
      user_id: user.id as string,
      amount: 100,
      description: 'deposit description',
      type: OperationType.DEPOSIT,
    })

    expect(deposit).toHaveProperty('id')
  })

  it('should be able to make a withdraw', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    await createStatement.execute({
      user_id: user.id as string,
      amount: 100,
      description: 'deposit description',
      type: OperationType.DEPOSIT,
    })

    const withdraw = await createStatement.execute({
      user_id: user.id as string,
      amount: 25,
      description: 'withdraw description',
      type: OperationType.WITHDRAW,
    })

    expect(withdraw).toHaveProperty('id')
  })

  it('should not be able to make a statement with non-existent user', async () => {
    await expect(
      createStatement.execute({
        user_id: 'non-existent-user',
        amount: 100,
        description: 'deposit description',
        type: OperationType.DEPOSIT,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should not be able to make a withdraw with insufficient funds', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    await expect(
      createStatement.execute({
        user_id: user.id as string,
        amount: 1,
        description: 'withdraw description',
        type: OperationType.WITHDRAW,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
