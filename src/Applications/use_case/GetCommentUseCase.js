const GetComments = require('../../Domains/comments/entities/GetComments');

class GetCommentUseCase {
  constructor({ commentRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { id } = useCasePayload;
    const comments = await this._commentRepository.getCommentByThreadId(id);

    const replaceComment = comments.map((comment) => (comment.is_delete === 'true' ? { ...comment, content: '**komentar telah dihapus**' } : comment));
    const replaceUsername = await Promise.all(replaceComment.map(async (c) => ({
      ...c,
      username: await this._userRepository.getUsernameById(c.owner),
    })));

    return new GetComments(replaceUsername);
  }
}

module.exports = GetCommentUseCase;
