class GetComments {
  constructor(payload) {
    if (payload.length < 1) {
      return [];
    }
    this._verifyPayload(payload[0]);

    const comments = payload.map((p) => ({
      id: p.id,
      username: p.username,
      date: p.date,
      content: p.content,
    }));

    return comments;
  }

  _verifyPayload({
    id, content, owner, thread_id: threadId, is_delete: isDelete, date, username,
  }) {
    if (!id || !content || !owner || !threadId || !isDelete || !date || !username) {
      throw new Error('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string' || typeof isDelete !== 'string' || typeof date !== 'string' || typeof username !== 'string') {
      throw new Error('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICIATION');
    }
  }
}

module.exports = GetComments;
