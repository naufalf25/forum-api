const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error when use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
  });

  it('should throw error when use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 123,
      owner: 'user-123',
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment object correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockCommentRepoitory = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    // mocking
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepoitory.verifyAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepoitory.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepoitory.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepoitory,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepoitory.verifyAvailabilityComment)
      .toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepoitory.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepoitory.deleteComment)
      .toBeCalledWith(useCasePayload.commentId);
  });
});
