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
      match.column = column;
      return match;
    }
  }
  return undefined;
};

var changeNumber = function(
    editor, row, columnStart, columnEnd, pow, newNumber) {
  // change number
  newNumber = newNumber.toString();
  var range = [[row, columnStart], [row, columnEnd]];
  editor.setTextInBufferRange(range, newNumber.toString());
  
  // change cursor position
  var newColumnPosition = newNumber.length - 1 - pow;
  if (newColumnPosition < 0) {
    newColumnPosition = 0;
  }
  editor.setCursorBufferPosition([row, columnStart + newColumnPosition]);
};

var performIncr = function(editor, isPow) {
  var match = getMatchAtCursor(editor);
  if (match) {
    var originalNumber = Number(match.match);
    if (isNaN(originalNumber)) {
      return;
    }
    var pow = isPow? match.end - match.column - 1 : 0;
    var changedNumber = originalNumber + (1 * Math.pow(10, pow));
    changeNumber(editor, match.row, match.index, match.end, pow, changedNumber);
  }
};

var performDecr = function(editor, isPow) {
  var match = getMatchAtCursor(editor);
  if (match) {
    var originalNumber = Number(match.match);
    if (isNaN(originalNumber)) {
      return;
    }
    var pow = isPow? match.end - match.column - 1 : 0;
    var changedNumber = originalNumber - (1 * Math.pow(10, pow));
    changeNumber(editor, match.row, match.index, match.end, pow, changedNumber);
  }
};

module.exports = {
  activate: function() {
    atom.workspaceView.command('incr:incr', '.editor', function() {
      var editor = atom.workspaceView.getActivePaneItem();
      return performIncr(editor, false);
    });
    atom.workspaceView.command('incr:decr', '.editor', function() {
      var editor = atom.workspaceView.getActivePaneItem();
      return performDecr(editor, false);
    });
    atom.workspaceView.command('incr:incr-pow', '.editor', function() {
      var editor = atom.workspaceView.getActivePaneItem();
      return performIncr(editor, true);
    });
    atom.workspaceView.command('incr:decr-pow', '.editor', function() {
      var editor = atom.workspaceView.getActivePaneItem();
      return performDecr(editor, true);
    });
  },
  performIncr: performIncr,
  performDecr: performDecr
};
