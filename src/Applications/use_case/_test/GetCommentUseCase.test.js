const GetComments = require('../../../Domains/comments/entities/GetComments');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const GetCommentUseCase = require('../GetCommentUseCase');

describe('GetCommentUseCase', () => {
  it('should orchestrating the get comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'thread-123',
    };
    const expectedGetComment = [
      {
        id: 'comment-123',
        content: 'ini komentar satu',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 'false',
        date: `${new Date()}`,
      },
      {
        id: 'comment-123',
        content: 'ini komentar dua',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 'true',
        date: `${new Date()}`,
      },
    ];
    const expectedGetUsername = 'dicoding';
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();

    // mocking
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetComment));
    mockUserRepository.getUsernameById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedGetUsername));

    const replaceComment = expectedGetComment.map((comment) => (comment.is_delete === 'true' ? { ...comment, content: '**komentar telah dihapus**' } : comment));

    const getCommentUseCase = new GetCommentUseCase({
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const getComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCasePayload.id);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(expectedGetComment[0].owner);
    expect(mockUserRepository.getUsernameById).toBeCalledWith(expectedGetComment[1].owner);
    expect(mockUserRepository.getUsernameById).toBeCalledTimes(2);
    expect(replaceComment).toEqual([
      {
        id: expectedGetComment[0].id,
        content: expectedGetComment[0].content,
        owner: expectedGetComment[0].owner,
        thread_id: expectedGetComment[0].thread_id,
        is_delete: expectedGetComment[0].is_delete,
        date: expectedGetComment[0].date,
      },
      {
        id: expectedGetComment[1].id,
        content: '**komentar telah dihapus**',
        owner: expectedGetComment[1].owner,
        thread_id: expectedGetComment[1].thread_id,
        is_delete: expectedGetComment[1].is_delete,
        date: expectedGetComment[1].date,
      },
    ]);
    expect(getComment).toBeInstanceOf(Array);
    expect(getComment).toEqual(new GetComments([
      {
        id: expectedGetComment[0].id,
        content: expectedGetComment[0].content,
        owner: expectedGetComment[0].owner,
        thread_id: expectedGetComment[0].thread_id,
        is_delete: expectedGetComment[0].is_delete,
        date: expectedGetComment[0].date,
        username: expectedGetUsername,
      },
      {
        id: expectedGetComment[1].id,
        content: '**komentar telah dihapus**',
        owner: expectedGetComment[1].owner,
        thread_id: expectedGetComment[1].thread_id,
        is_delete: expectedGetComment[1].is_delete,
        date: expectedGetComment[1].date,
        username: expectedGetUsername,
      },
    ]));
  });
});
