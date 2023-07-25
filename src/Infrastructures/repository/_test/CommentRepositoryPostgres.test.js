const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailabilityComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailabilityComment('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyAvailabilityComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    it('should persist add comment', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'ini komentar',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(newComment).toEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is comment owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should return all comment with same thread ID', async () => {
      // Arrange
      const payloadCommentOne = {
        id: 'comment-123',
        content: 'ini komentar satu',
        owner: 'user-123',
        threadId: 'thread-123',
        isDelete: 'false',
        date: '12 July 2023',
      };
      const payloadCommentTwo = {
        id: 'comment-456',
        content: 'ini komentar dua',
        owner: 'user-456',
        threadId: 'thread-123',
        isDelete: 'true',
        date: '15 July 2023',
      };
      await CommentsTableTestHelper.addComment(payloadCommentOne);
      await CommentsTableTestHelper.addComment(payloadCommentTwo);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments[0]).toEqual({
        id: payloadCommentOne.id,
        content: payloadCommentOne.content,
        owner: payloadCommentOne.owner,
        thread_id: payloadCommentOne.threadId,
        is_delete: payloadCommentOne.isDelete,
        date: payloadCommentOne.date,
      });
      expect(comments[1]).toEqual({
        id: payloadCommentTwo.id,
        content: payloadCommentTwo.content,
        owner: payloadCommentTwo.owner,
        thread_id: payloadCommentTwo.threadId,
        is_delete: payloadCommentTwo.isDelete,
        date: payloadCommentTwo.date,
      });
    });

    it('should return empty array if comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');
      expect(comments).toHaveLength(0);
    });
  });

  describe('deleteComment function', () => {
    it('should replace content comment to soft delete', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const id = 'comment-123';
      await CommentsTableTestHelper.addComment({ id });

      // Action
      await commentRepositoryPostgres.deleteComment(id);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentById(id);
      expect(comments[0].is_delete).toEqual('true');
    });
  });
});
