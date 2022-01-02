import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'
import { ShowUserProfileError } from './ShowUserProfileError'

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfile: ShowUserProfileUseCase

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    showUserProfile = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    )
  })

  it('should be able to return user profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@exemple.com',
      password: 'password'
    })

    const response = await showUserProfile.execute(user.id as string)

    expect(response).toEqual(user)
  })

  it('should be able to return user profile with non-existent user', async () => {
    await expect(
      showUserProfile.execute('non-existent-user')
    ).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
