const yup = require('yup');
const { parse } = require('date-fns');

module.exports = yup.object({
  placeholder: yup
    .object()
    .required()
    .shape({
      age: yup.number().required().min(40, 'age is too low').max(90, 'age is too high'),
      dateOfBirth: yup
        .date()
        .transform(function (value, originalValue) {
          if (this.isType(value)) {
            return value;
          }
          return parse(originalValue, 'dd.MM.yyyy', new Date());
        })
        .typeError('please enter a valid dateOfBirth')
        .required()
        .min('1969-12-31', 'dateOfBirth is too early')
        .max(new Date(), 'dateOfBirth is too late'),
    }),
});
