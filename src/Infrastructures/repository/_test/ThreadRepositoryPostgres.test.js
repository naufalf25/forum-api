const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should throw error when target thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when target thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should persist add thread', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const newThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(newThread).toEqual(new AddedThread({
        id: 'thread-123',
        title: addThread.title,
        owner: addThread.owner,
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should get thread by ID correctly', async () => {
      // Arrange
      const payload = {
        id: 'thread-123',
        title: 'dicoding',
        body: 'Dicoding Indonesia',
        owner: 'user-123',
        date: '15 July 2023',
      };
      await ThreadsTableTestHelper.addThread(payload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toEqual({
        id: payload.id,
        title: payload.title,
        body: payload.body,
        owner: payload.owner,
        date: payload.date,
      });
    });
  });
});
