const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadWithCommentsUseCase = require('../../../../Applications/use_case/GetThreadWithCommentsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
    this.deleteCommentThreadHandler = this.deleteCommentThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentThreadHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute({ ...request.payload, owner, threadId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentThreadHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    return {
      status: 'success',
    };
  }

  async getThreadByIdHandler(request, h) {
    const getThreadWithCommentsUseCase = this._container
      .getInstance(GetThreadWithCommentsUseCase.name);
    const { threadId } = request.params;

    const thread = await getThreadWithCommentsUseCase.execute({ id: threadId });

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
