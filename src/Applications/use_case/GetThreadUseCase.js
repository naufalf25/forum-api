const GetThread = require('../../Domains/threads/entities/GetThread');

class GetThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { id: threadId } = useCasePayload;
    await this._threadRepository.verifyAvailableThread(threadId);
    const {
      id, title, body, date, owner,
    } = await this._threadRepository.getThreadById(threadId);
    const ownerUsername = await this._userRepository.getUsernameById(owner);

    return new GetThread({
      id,
      title,
      body,
      date,
      username: ownerUsername,
    });
  }
}

module.exports = GetThreadUseCase;
