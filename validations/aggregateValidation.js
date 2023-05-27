const yup = require('yup');

module.exports = yup.object({
  name: yup.string().required(),
  breed: yup.string().required(),
  dataOfBirth: yup.date().required(),
});
