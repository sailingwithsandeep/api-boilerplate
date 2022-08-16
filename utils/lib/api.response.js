const common = {
  error: 'Something went wrong.',
  error_with: 'Something went wrong with ##.',
  reg_success: 'Welcome! You are registered successfully.',
  success: '## fetched successfully.',
  successfully: '## successfully.',
  action_success: '## successful.',
  cancel_success: '## cancel successful.',
  sent_success: '## sent successfully.',
  action_failure: '## failed.',
  generate_success: '## generated successfully.',
  add_success: '## added successfully.',
  update_success: '## updated successfully.',
  refresh_success: '## refreshed successfully.',
  del_success: '## deleted successfully.',
  submit_success: '## submitted successfully.',
  fields_missing: '## missing',
  fail: 'Failed',
  route_not_found: 'Page Not Found.',
  required: '## is required.',
  invalid: '## is invalid.',
  valid: '## is valid.',
  already_exist: '## is already exist.',
  are_already_exist: '## are already exist.',
  already_added: '## is already Added.',
  not_exist: '## does not exist.',
  not_found: '## not found',
  access_denied: 'You don\'t have permission',
  err_unauthorized: 'Authentication failed. Please login again!',
  user_blocked: 'You are blocked by our system. Contact administrator for more details.',
  succ_logout: 'You have successfully logged out!',
  succ_login: 'Welcome Back! You have logged in successfully.',
  went_wrong_with: 'Something went wrong with ##',
  must_alpha_num: 'Username allows alphanumeric characters only.',
  auth_failed: 'Please enter a valid credentials.',
  old_new_field_same: 'Old and New ## can\'t be same.',
  wrong_old_field: 'Please enter a correct old field.',
  user_forgot_err: 'We didn\'t find any account in our system. Please check your input first.',
  verification_success: 'Verification done successfully.',
  reset_pass_succ: 'Your password has been reset successfully. Please login using new password.',
  already_verified: '## is already verified.',
  limit_reached: 'You have reached a limit for sending ##. Please try after some time.',
  link_expire_invalid: 'This link seems to be expired or invalid. Please try again.',
  invalid_pass: 'Password must contain at least six characters,.'
};

const words = {
  content: 'Content',
  username: 'Username',
  mobileNumber: 'Mobile number',
  email: 'Email',

  password: 'Password'
};

const messages = {
  ...common,
  ...words
};

const status = {
  OK: 200,
  Create: 201,
  Deleted: 204,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  NotAcceptable: 406,
  ExpectationFailed: 417,
  Locked: 423,
  InternalServerError: 500,
  UnprocessableEntity: 422,
  ResourceExist: 409,
  TooManyRequest: 429
};

const jsonStatus = {
  OK: 200,
  Create: 201,
  Deleted: 204,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  NotAcceptable: 406,
  ExpectationFailed: 417,
  Locked: 423,
  InternalServerError: 500,
  UnprocessableEntity: 422,
  ResourceExist: 409,
  TooManyRequest: 429
};

module.exports = {
  messages,
  status,
  jsonStatus
};
