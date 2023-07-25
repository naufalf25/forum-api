class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { threadId, commentId, owner } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailabilityComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._commentRepository.deleteComment(commentId);
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!threadId || !commentId || !owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
