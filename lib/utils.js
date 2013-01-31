module.exports.endsWith = function endsWith (str) {
  var endsWithMatcher = RegExp('\.' + str + '$','i');
  return function (s) {
    return s.match(endsWithMatcher);
  }
}