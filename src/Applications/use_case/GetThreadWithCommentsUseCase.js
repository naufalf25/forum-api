const GetThreadWithComments = require('../../Domains/threads/entities/GetThreadWithComments');

class GetThreadWithCommentsUseCase {
  constructor({ getThreadUseCase, getCommentUseCase }) {
    this._getThreadUseCase = getThreadUseCase;
    this._getCommentUseCase = getCommentUseCase;
  }

  async execute(useCasePayload) {
    const thread = await this._getThreadUseCase.execute(useCasePayload);
    const comments = await this._getCommentUseCase.execute(useCasePayload);

    return new GetThreadWithComments({
      ...thread,
      comments,
    });
  }
}

module.exports = GetThreadWithCommentsUseCase;
