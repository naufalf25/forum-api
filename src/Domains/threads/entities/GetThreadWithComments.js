class GetThreadWithComments {
  constructor(payload) {
    this._verifyPayload(payload);

    return payload;
  }

  _verifyPayload({
    id, title, body, date, username, comments,
  }) {
    if (!id || !title || !body || !date || !username || !comments) {
      throw new Error('GET_THREAD_WITH_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof date !== 'string' || typeof username !== 'string') {
      throw new Error('GET_THREAD_WITH_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadWithComments;
