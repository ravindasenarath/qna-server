const {
  validateUser,
  signup,
  authenticate,
  listUsers,
  search,
  find
} = require('./controllers/users');
const {
  loadQuestion,
  questionValidate,
  createQuestion,
  showQuestion,
  listQuestions,
  listQuestionsByTags,
  listQuestionsByUser,
  removeQuestion
} = require('./controllers/questions');
const {
  loadDiscussion,
  discussionValidate,
  createDiscussion,
  showDiscussion,
  listDiscussions,
  listDiscussionsByTags,
  listDiscussionsByUser,
  removeDiscussion
} = require('./controllers/discussions');
const {
  loadFaq,
  faqValidate,
  createFaq,
  showFaq,
  listFaqs,
  listFaqsByTags,
  removeFaq
} = require('./controllers/faqs');
const {
  loadAnswer,
  answerValidate,
  createAnswer,
  removeAnswer
} = require('./controllers/answers');
const { listPopulerTags, searchTags, listTags } = require('./controllers/tags');
const { upvote, downvote, unvote } = require('./controllers/votes');
const { loadComment, validate, createComment, removeComment } = require('./controllers/comments');

const requireAuth = require('./middlewares/requireAuth');
const questionAuth = require('./middlewares/questionAuth');
const discussionAuth = require('./middlewares/discussionAuth');
const faqAuth = require('./middlewares/faqAuth');
const commentAuth = require('./middlewares/commentAuth');
const answerAuth = require('./middlewares/answerAuth');

const router = require('express').Router();

//authentication
router.post('/signup', validateUser, signup);
router.post('/authenticate', validateUser, authenticate);

//users
router.get('/users', listUsers);
router.get('/users/:search', search);
router.get('/user/:username', find);

//questions
router.param('question', loadQuestion);
router.post('/question', [requireAuth, questionValidate], createQuestion);
router.get('/question/:question', showQuestion);
router.get('/questions', listQuestions);
router.get('/questions/:tags', listQuestionsByTags);
router.get('/questions/user/:username', listQuestionsByUser);
router.delete('/question/:question', [requireAuth, questionAuth], removeQuestion);

//discussions
router.param('discussion', loadDiscussion);
router.post('/discussion', [requireAuth, discussionValidate], createDiscussion);
router.get('/discussion/:discussion', showDiscussion);
router.get('/discussions', listDiscussions);
router.get('/discussions/:tags', listDiscussionsByTags);
router.get('/discussions/user/:username', listDiscussionsByUser);
router.delete('/discussion/:discussion', [requireAuth, discussionAuth], removeDiscussion);

//discussions
router.param('faq', loadFaq);
router.post('/faq', [requireAuth, faqValidate], createFaq); // TODO: check admin auth
router.get('/faq/:faq', showFaq);
router.get('/faqs', listFaqs);
router.get('/faqs/:tags', listFaqsByTags);
router.delete('/faq/:faq', [requireAuth, faqAuth], removeFaq); // TODO: check admin auth

//tags
router.get('/tags/populertags', listPopulerTags);
router.get('/tags/:tag', searchTags);
router.get('/tags', listTags);

//answers/responses
router.param('answer', loadAnswer);
router.post('/answer/:question', [requireAuth, answerValidate], createAnswer);
router.delete('/answer/:question/:answer', [requireAuth, answerAuth], removeAnswer);
router.post('/response/:discussion', [requireAuth, answerValidate], createAnswer);
router.delete('/response/:discussion/:answer', [requireAuth, answerAuth], removeAnswer);

//votes
router.get('/votes/upvote/:question/:answer?', requireAuth, upvote);
router.get('/votes/downvote/:question/:answer?', requireAuth, downvote);
router.get('/votes/unvote/:question/:answer?', requireAuth, unvote);

//comments
router.param('comment', loadComment);
router.post('/comment/:question/:answer?', [requireAuth, validate], createComment);
router.delete('/comment/:question/:comment', [requireAuth, commentAuth], removeComment);
router.delete('/comment/:question/:answer/:comment', [requireAuth, commentAuth], removeComment);

module.exports = (app) => {
  app.use('/api', router);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      message: error.message
    });
  });
};
