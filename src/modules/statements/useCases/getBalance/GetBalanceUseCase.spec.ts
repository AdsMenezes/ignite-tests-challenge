
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { GetBalanceUseCase } from './GetBalanceUseCase'
import { GetBalanceError } from './GetBalanceError'

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalance: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    getBalance = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  })

  it('should be able to return the user\'s balance', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    const statement1 = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 100,
      description: 'deposit description 1',
      type: OperationType.DEPOSIT,
    })

    const statement2 = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 25,
      description: 'deposit description 2',
      type: OperationType.DEPOSIT,
    })

    const statement3 = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 5,
      description: 'withdraw description 1',
      type: OperationType.WITHDRAW,
    })

    const response = await getBalance.execute({
      user_id: user.id as string
    })

    expect(response.statement).toEqual([statement1, statement2, statement3])
    expect(response.balance).toBe(120)
  })

  it('should not be able to return the user\'s balance with non-existent user', async () => {
    await expect(
      getBalance.execute({
        user_id: 'non-existent-user'
      })
    ).rejects.toBeInstanceOf(GetBalanceError)
  })
})
