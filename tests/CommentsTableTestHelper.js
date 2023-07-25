/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'ini komentar', owner = 'user-123', threadId = 'thread-123', isDelete = 'false', date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, owner, threadId, isDelete, date],
    };

    await pool.query(query);
  },

  async getComments() {
    const query = {
      text: 'SELECT * FROM comments',
      values: [],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
