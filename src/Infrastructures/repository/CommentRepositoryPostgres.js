const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyAvailabilityComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async addComment(payload) {
    const { content, owner, threadId } = payload;
    const id = `comment-${this._idGenerator()}`;
    const isDelete = 'false';
    const date = `${new Date()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, isDelete, date],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses komentar ini');
    }
  }

  async getCommentByThreadId(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE thread_id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(id) {
    const isDelete = 'true';
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [isDelete, id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
