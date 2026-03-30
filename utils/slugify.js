const slugify = require('slugify');

module.exports = function(text) {
  if (!text) return '';
  return slugify(text, {
    lower: true,
    strict: true,
    locale: 'vi'
  });
};
