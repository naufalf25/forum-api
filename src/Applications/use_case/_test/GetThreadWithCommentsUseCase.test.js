const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const GetCommentUseCase = require('../GetCommentUseCase');
const GetThreadWithComments = require('../../../Domains/threads/entities/GetThreadWithComments');
const GetThreadWithCommentsUseCase = require('../GetThreadWithCommentsUseCase');

describe('GetThreadWithCommentsUseCase', () => {
  it('should orchestrating the get thread with comments action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const expectedGetThread = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      owner: 'user-123',
      date: `${new Date()}`,
      username: 'dicoding',
    };
    const expectedGetComments = [
      {
        id: 'comment-123',
        content: 'ini komentar',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 'true',
        date: `${new Date()}`,
        username: 'dicoding',
      },
    ];
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockGetThreadUseCase = new GetThreadUseCase(mockThreadRepository, mockUserRepository);
    const mockGetCommentUseCase = new GetCommentUseCase(mockCommentRepository, mockUserRepository);

    // mocking
    mockGetThreadUseCase.execute = jest.fn()
      .mockReturnValue(expectedGetThread);
    mockGetCommentUseCase.execute = jest.fn()
      .mockReturnValue(expectedGetComments);

    const getThreadWithComments = new GetThreadWithCommentsUseCase({
      getThreadUseCase: mockGetThreadUseCase,
      getCommentUseCase: mockGetCommentUseCase,
    });

    // Actions
    const threadWithComments = await getThreadWithComments.execute(useCasePayload);

    // Assert
    expect(mockGetThreadUseCase.execute).toBeCalledWith(useCasePayload);
    expect(mockGetCommentUseCase.execute).toBeCalledWith(useCasePayload);
    expect(threadWithComments).toEqual(new GetThreadWithComments({
      ...expectedGetThread,
      comments: expectedGetComments,
    }));
  });
});
