const GetThread = require('../GetThread');

describe('GetThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      body: 'Dicoding Indonesia',
      date: '16 July 2023',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 123,
      body: 'Dicoding Indonesia',
      date: '16 July 2023',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return get thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      date: '16 July 2023',
      username: 'user-123',
    };

    // Action
    const getThread = new GetThread(payload);

    // Assert
    expect(getThread).toBeInstanceOf(Object);
    expect(getThread).toEqual(payload);
  });
});
