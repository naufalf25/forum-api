const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action id correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const getThread = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: 'user-123',
      date: `${new Date()}`,
    };
    const expectedUsername = 'dicoding';

    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    // mocking
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(getThread));
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedUsername));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const threads = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.id);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.id);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(getThread.owner);
    expect(threads).toEqual(new GetThread({
      id: getThread.id,
      title: getThread.title,
      body: getThread.body,
      date: getThread.date,
      username: expectedUsername,
    }));
  });
});
