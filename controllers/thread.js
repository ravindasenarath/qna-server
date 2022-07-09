const Question = require('../models/question');
const Discussion = require('../models/discussion');
const Faq = require('../models/faq');

const ThreadTypes = {
    questions: Question,
    discussions: Discussion,
    faqs: Faq
}

exports.loadThread = async (req, res, next, type) => {
  try {
    const thread = await ThreadTypes[type].findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found.' });
    req.thread = thread;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid thread id.' });
    return next(error);
  }
  next();
};