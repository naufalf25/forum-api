const GetComments = require('../GetComments');

describe('GetComments entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 'true',
        date: '16 July 2023',
        username: 'dicoding',
      },
    ];

    // Action & Assert
    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        content: 123,
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 'true',
        date: '16 July 2023',
        username: 'dicoding',
      },
    ];

    // Action & Assert
    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICIATION');
  });

  it('should return all comments correctly', () => {
    // Arrange
    const payload = [
      {
        id: 'comment-123',
        content: 'ini komentar',
        owner: 'user-123',
        thread_id: 'thread-123',
        is_delete: 'true',
        date: '16 July 2023',
        username: 'dicoding',
      },
    ];

    // Action
    const getComments = new GetComments(payload);

    // Assert
    expect(getComments).toHaveLength(1);
    expect(getComments[0]).toEqual({
      id: payload[0].id,
      username: payload[0].username,
      date: payload[0].date,
      content: payload[0].content,
    });
  });

  it('should return empty array if comment with same threadId not found', () => {
    // Arrange
    const payload = [];

    // Action
    const getComments = new GetComments(payload);

    // Assert
    expect(getComments).toHaveLength(0);
  });
});
