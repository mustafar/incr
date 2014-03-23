var getMatchAtCursor = function(editor) {
  if (!editor) {
    return;
  }
  var line = editor.getCursor().getCurrentBufferLine(),
      cursorBuffer = editor.getCursorBufferPosition(),
      cursorRow = cursorBuffer.row,
      cursorColumn = cursorBuffer.column;
  return matchAtPosition(cursorColumn, matchesOnLine(line, cursorRow));
};

var matchesOnLine = function(line, cursorRow) {
  if (!(line && cursorRow)) {
    return;
  }
  var filteredMatches = [], i;
  var regex = new RegExp("-*[0-9]+", "igm");
  var matches = line.match(regex);
  if (!matches) {
    return;
  }
  for (i = 0; i < matches.length; i++) {
    var match = matches[i];
    var index = line.indexOf(match);
    if (index === -1) {
      continue;
    }
    filteredMatches.push({
      match: match,
      index: index,
      end: index + match.length,
      row: cursorRow
    });
    line = line.replace(match, (Array(match.length + 1)).join(' '));
  }
  if (filteredMatches.length === 0) {
    return;
  }
  return filteredMatches;
};

var matchAtPosition = function(column, matches) {
  var match, i;
  if (!(column && matches)) {
    return;
  }
  for (i = 0; i < matches.length; i++) {
    match = matches[i];
    if (match.index <= column && match.end > column) {
      return match;
    }
  }
  return undefined;
};

var changeNumber = function(editor, row, columnStart, columnEnd, newNumber) {
  newNumber = newNumber.toString();
  console.log(row+" "+columnStart+" "+columnEnd+" "+newNumber);
  var range = [[row, columnStart], [row, columnEnd]];
  editor.setTextInBufferRange(range, newNumber.toString());
  editor.setCursorBufferPosition([row, columnStart + newNumber.length - 1]);
};

var performIncr = function(editor) {
  var match = getMatchAtCursor(editor);
  if (match) {
    console.log(match);
    var originalNumber = Number(match.match);
    if (isNaN(originalNumber)) {
      return;
    }
    changeNumber(editor, match.row, match.index, match.end, originalNumber + 1);
  }
};

var performDecr = function(editor) {
  var match = getMatchAtCursor(editor);
  if (match) {
    console.log(match);
    var originalNumber = Number(match.match);
    if (isNaN(originalNumber)) {
      return;
    }
    changeNumber(editor, match.row, match.index, match.end, originalNumber - 1);
  }
};

module.exports = {
  activate: function() {
    atom.workspaceView.command('incr:incr', '.editor', function() {
      var editor = atom.workspace.getActiveEditor(editor);
      return performIncr(editor);
    });
    atom.workspaceView.command('incr:decr', '.editor', function() {
      var editor = atom.workspace.getActiveEditor(editor);
      return performDecr(editor);
    });
  },
  performIncr: performIncr,
  performDecr: performDecr
};
