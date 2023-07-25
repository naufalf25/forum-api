const GetThreadWithComments = require('../GetThreadWithComments');

describe('GetThreadWithComments entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: '16 July 2023',
      comments: [
        {
          id: 'comment-123',
          content: 'ini komentar',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: 'true',
          date: '16 July 2023',
          username: 'dicoding',
        },
      ],
    };

    // Action & Assert
    expect(() => new GetThreadWithComments(payload)).toThrowError('GET_THREAD_WITH_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: '16 July 2023',
      username: 123,
      comments: [
        {
          id: 'comment-123',
          content: 'ini komentar',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: 'true',
          date: '16 July 2023',
          username: 'dicoding',
        },
      ],
    };

    // Action & Assert
    expect(() => new GetThreadWithComments(payload)).toThrowError('GET_THREAD_WITH_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return get thread with comments object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: '16 July 2023',
      username: 'user-123',
      comments: [
        {
          id: 'comment-123',
          content: 'ini komentar',
          owner: 'user-123',
          thread_id: 'thread-123',
          is_delete: 'true',
          date: '16 July 2023',
          username: 'dicoding',
        },
      ],
    };

    // Action
    const getThreadWithComments = new GetThreadWithComments(payload);

    // Assert
    expect(getThreadWithComments).toBeInstanceOf(Object);
    expect(getThreadWithComments.comments).toBeInstanceOf(Array);
    expect(getThreadWithComments).toEqual(payload);
  });
});
