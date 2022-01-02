
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'
import { GetStatementOperationError } from './GetStatementOperationError'

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getStatementOperation: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    getStatementOperation = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository,
    )
  })

  it('should be able to return a statement by user_id and statement_id', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      amount: 100,
      description: 'deposit description 1',
      type: OperationType.DEPOSIT,
    })

    const response = await getStatementOperation.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    })

    expect(response).toEqual(statement)
  })

  it('should not be able to return a statement with non-existent user', async () => {
    await expect(
      getStatementOperation.execute({
        user_id: 'non-existent-user',
        statement_id: 'non-existent-user'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to return a statement with non-existent statement', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    await expect(
      getStatementOperation.execute({
        user_id: user.id as string,
        statement_id: 'non-existent-statement'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
