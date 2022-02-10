const { Router } = require('express');

// CONTROLLERS:
const categoryController = require('./controllers/categoryController');
const sessionController = require('./controllers/sessionController');
const userController = require('./controllers/userController');

// MIDDLEWARES:
const adminMW = require('./middlewares/adminMW');
const adminOrCoachMW = require('./middlewares/adminOrCoachMW');
const coachMW = require('./middlewares/coachMW');
const jwtMW = require('./middlewares/jwtMW');
const profileMW = require('./middlewares/profileMW');
const userMW = require('./middlewares/userMW');

// JOI VALIDATION:
const registerSchema = require('./schemas/registerSchema');
const loginSchema = require('./schemas/loginSchema');
const coachSchema = require('./schemas/coachSchema');
const sessionSchema = require('./schemas/sessionSchema');
const { validateBody, validateQuery, validateParams } = require('./middlewares/joiValidator');

// REDIS:
// const { cache, flush } = require('./services/cache');

const router = Router();

/**
 * Redirect to /docs from home page
 * @route /v1/
 * @method GET
 */
router.get('/', (_, response) => {
  response.status(301).redirect('/docs');
});

//-----------------------------CATEGORY-----------------------------
/**
 * GET /v1/categories
 * @method GET
 * @route /v1/categories
 * @tags CATEGORY
 * @summary Responds with all categories from database
 * @return {object} 200 - success response - application/json
 * @returns {string} 500 - An error message
 */
 router.get('/categories', categoryController.findAll);
//  router.get('/categories', cache, categoryController.findAll);

/**
 * GET /v1/categories/{catId}
 * @summary Responds with one category from database
 * @route GET /v1/categories/{catId}
 * @tags CATEGORY
 * @param {number} catId.path.required The id of the category to fetch
 * @returns {Post} 200 - A single post identified by its id
 * @returns {string} 404 - An error message
 */
 router.get('/categories/:catId(\\d+)', categoryController.findOne);
//  router.get('/categories/:catId(\\d+)', cache, categoryController.findOne);

/**
 * GET /v1/categories/{catId}/sessions
 * @summary Responds with available sport sessions from a specific category in database
 * @route GET /v1/categories/{catId}/sessions
 * @tags SESSION
 * @param {number} catId.path.required The id of the desired category
 * @returns {array<session>} 200 - An array of sessions with a specific category, can be empty
 * @returns {string} 500 - An error message
 */
 router.get('/categories/:catId(\\d+)/sessions', sessionController.findByCategory);
//  router.get('/categories/:catId(\\d+)/sessions', cache, sessionController.findByCategory);

/**
 * GET /v1/categories/{catId}/sessions/{sessId}
 * @summary Responds with a specific sport session from a specific category in database
 * @route GET /v1/categories/{catId}/sessions/{sessId}
 * @tags SESSION
 * @param {number} catId.path.required The id of the desired category
 * @param {number} sessId.path.required The id of the desired session
 * @returns {array<session>} 200 - An array of a specific session with a specific category, can be empty
 * @returns {string} 500 - An error message
 */
 router.get('/categories/:catId(\\d+)/sessions/:sessId(\\d+)', jwtMW, userMW, sessionController.findBySession);
//  router.get('/categories/:catId(\\d+)/sessions/:sessId(\\d+)', jwtMW, userMW, cache, sessionController.findBySession);

//-----------------------------REGSITER-----------------------------
/**
 * GET /v1/register
 * @method GET
 * @route /v1/register
 * @tags USER
 * @summary Responds with tehe register page
 * @return {object} 200 - success response - application/json
 */
 router.get('/register', userController.showRegisterPage);

/**
 * POST /v1/register
 * @method POST
 * @route /v1/register
 * @tags USER
 * @summary Responds to a submitted form in order to register a new user
 * @return {object} 200 - success response - application/json
 */
 router.post('/register', validateBody(registerSchema), userController.addUser);
//  router.post('/register', flush, validateBody(registerSchema), userController.addUser);

//-----------------------------LOGIN-----------------------------
/**
 * GET /v1/login
 * @method GET
 * @route /v1/login
 * @tags USER
 * @summary Responds with the login page
 * @return {object} 200 - success response - application/json
 */
 router.get('/login', userController.showLoginPage);

 /**
  * c'est la description
  * @typedef {object} loginBody
  * @property {string} email
  * @property {string} password
  */
 
 /**
  * POST /v1/login
  * 
  * 
  * @method POST
  * @route /v1/login
  * @tags USER
  * @param {loginBody} request.body.required
  * @summary Responds to a submitted form in order to connect a user
  * @return {object} 200 - success response - application/json
  */
 router.post('/login', validateBody(loginSchema), userController.login);
//  router.post('/login', flush, validateBody(loginSchema), userController.login);

//-----------------------------TOKENACCESS-----------------------------
/**
 * GET /v1/token
 * @method GET
 * @route /v1/token
 * @tags TOKEN
 * @summary Responds with redirect profile/:id
 * @return {object} 200 - success response - application/json
 */
 router.get('/tokenaccess', jwtMW, userController.verifyToken);

//-----------------------------ADMIN-----------------------------
/**
 * GET /v1/admin
 * @method GET
 * @route /v1/categories
 * @tags ADMIN
 * @summary Responds with the admin page
 * @return {object} 200 - success response - application/json
 * @returns {string} 500 - An error message
 */
 router.get('/admin', jwtMW, adminMW, userController.findOne);
//  router.get('/admin', flush, jwtMW, adminMW, userController.findOne);

//-----------------------------USER-----------------------------
/**
 * GET /v1/profile/{userId}
 * @summary Responds with a specific user in database
 * @route GET /v1/profile/{userId}
 * @tags USER
 * @param {number} userId.path.required The id of the desired user
 * @returns {array<user>} 200 - An array of a specific user, can be empty
 * @returns {string} 500 - An error message
 */
 router.get('/profile/user/:userId(\\d+)', jwtMW, profileMW, userController.findOne);
//  router.get('/profile/user/:userId(\\d+)', jwtMW, profileMW, cache,userController.findOne);

/**
 * PATCH /v1/profile/{id}
 * @summary Updates an existing user profile in database
 * @tags USER
 * @param {number} id.path.required The id of the desired user
 * @returns {string} 204 - user updated
 * @returns {string} 500 - An error message
 */
 router.patch('/profile/user/:id(\\d+)', jwtMW, profileMW, validateBody(registerSchema), userController.update)
//  router.patch('/profile/user/:id(\\d+)', flush, jwtMW, profileMW, validateBody(registerSchema), userController.update)

/**
 * DELETE /v1/profile/{id}
 * @summary Deletes an existing user profile in database
 * @tags USER
 * @param {number} id.path.required The id of the desired user
 * @returns {string} 200 - returns nothing
 * @returns {string} 500 - An error message
 */
 router.delete('/profile/user/:id(\\d+)', jwtMW, profileMW, userController.deleteUser);
//  router.delete('/profile/user/:id(\\d+)', flush, jwtMW, profileMW, userController.deleteUser);

//-----------------------------COACH-----------------------------
/**
 * GET /v1/profile/coach/{userId}
 * @summary Responds with a specific coach in database
 * @route GET /v1/profile/coach/{coachId}
 * @tags COACH
 * @param {number} userId.path.required The id of the desired coach
 * @returns {array<coach>} 200 - An array of a specific coach, can be empty
 * @returns {string} 500 - An error message
 */
 router.get('/profile/coach/:userId(\\d+)', jwtMW, coachMW, userController.findOne);
//  router.get('/profile/coach/:userId(\\d+)', jwtMW, coachMW, cache, userController.findOne);

/**
 * PATCH /v1/profile/coach/{userId}
 * @summary Updates an existing coach profile in database
 * @tags COACH
 * @param {number} userId.path.required The id of the desired coach
 * @returns {string} 204 - coach updated
 * @returns {string} 500 - An error message
 */
 router.patch('/profile/coach/:userId(\\d+)', jwtMW, coachMW, validateBody(coachSchema), userController.update);
//  router.patch('/profile/coach/:userId(\\d+)', flush, jwtMW, coachMW, validateBody(coachSchema), userController.update);

/**
 * DELETE /v1/profile/coach/{userId}
 * @summary Deletes an existing coach profile in database
 * @tags COACH
 * @param {number} userId.path.required The id of the desired coach
 * @returns {string} 200 - returns nothing
 * @returns {string} 500 - An error message
 */
 router.delete('/profile/coach/:userId(\\d+)', jwtMW, adminOrCoachMW, userController.deleteCoach);
//  router.delete('/profile/coach/:userId(\\d+)', flush, jwtMW, adminOrCoachMW, userController.deleteCoach);

//-----------------------------SESSION-----------------------------
/**
* GET /v1/profile/coach/{coachId}/session
* @summary Responds with all sessions created by a coach
* @route GET /v1/profile/coach/{coachId}/session
* @security bearerAuth
* @tags SESSION
* @param {number} coachId.path.required The id of the desired coach
* @returns {array<Session>} 200 - An array of all sessions from a specific coach, can be empty
* @returns {string} 500 - An error message
*/
router.get('/profile/coach/:coachId(\\d+)/session', jwtMW, coachMW, sessionController.findByCoach);
// router.get('/profile/coach/:coachId(\\d+)/session', jwtMW, coachMW, cache, sessionController.findByCoach);

/**
* GET /v1/profile/coach/{id}/session/{id}
* @summary Responds with a created session route
* @route GET /v1/profile/coach/{id}/session/{id}
* @tags SESSION
* @param {number} coachId.path.required The id of the desired coach
* @param {number} sessId.path.required The id of the desired session
* @returns {array<session>} 200 - An array of a specific session, can be empty
* @returns {string} 500 - An error message
*/
router.get('/profile/coach/:coachId(\\d+)/session/:sessId(\\d+)', jwtMW, coachMW, sessionController.findOne);
// router.get('/profile/coach/:coachId(\\d+)/session/:sessId(\\d+)', jwtMW, coachMW, cache, sessionController.findOne);

/**
* POST /v1/profile/coach/{id}/session/{id}
* @summary Responds to a submitted form in order to create a session 
* @route POST /v1/profile/coach/{id}/session/{id}
* @tags SESSION
* @param {number} coachId.path.required The id of the desired coach
* @returns {array<session>} 200 - An array of a specific session, can be empty
* @returns {string} 500 - An error message
*/
router.post('/profile/coach/:coachId(\\d+)/session/', jwtMW, coachMW, validateBody(sessionSchema), sessionController.addSession);
// router.post('/profile/coach/:coachId(\\d+)/session/', flush, jwtMW, coachMW, validateBody(sessionSchema), sessionController.addSession);

/**
* PATCH /v1/profile/coach/{id}/session/{id}
* @summary Updates a session 
* @route PATCH /v1/profile/coach/{id}/session/{id}
* @tags SESSION
* @param {number} coachId.path.required The id of the desired coach
* @param {number} sessId.path.required The id of the desired session
* @returns {array<session>} 200 - An array of a specific session, can be empty
* @returns {string} 500 - An error message
*/
router.patch('/profile/coach/:coachId(\\d+)/session/:sessId(\\d+)', jwtMW, coachMW, validateBody(sessionSchema), sessionController.update);
// router.patch('/profile/coach/:coachId(\\d+)/session/:sessId(\\d+)', flush, jwtMW, coachMW, validateBody(sessionSchema), sessionController.update);

/**
* DELETE /v1/profile/coach/{id}/session/{id}
* @summary Deletes a session 
* @route DELETE /v1/profile/coach/{id}/session/{id}
* @tags SESSION
* @param {number} coachId.path.required The id of the desired coach
* @param {number} sessId.path.required The id of the desired session
* @returns 200 - Returns nothing
* @returns {string} 500 - An error message
*/
router.delete('/profile/coach/:coachId(\\d+)/session/:sessId(\\d+)', jwtMW, coachMW, sessionController.delete);
// router.delete('/profile/coach/:coachId(\\d+)/session/:sessId(\\d+)', flush, jwtMW, coachMW, sessionController.delete);

module.exports = router;