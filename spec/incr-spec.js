var performIncr = require('../lib/incr').performIncr,
    performDecr = require('../lib/incr').performDecr;

describe("Incr", function() {
  describe("perform incr", function() {
    var buffer, editor;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      runs(function() {
        editor = atom.project.openSync();
        buffer = editor.getBuffer();
        //editor.setText("console.log('1 version: 0.0.999');");
        editor.setText("11");
        //"console.log(\"Hell0 World\");\nconsole.log('Hello World');\nconsole.log(\"Hello 'World'\");\nconsole.log('Hello \"World\"');"
        return editor.setGrammar(atom.syntax.selectGrammar('test.js'));
      });
    });
    
    describe("when the cursor is not on number", function() {
      it("does nothing", function() {
        expect(function() { performIncr(editor); }).not.toThrow();
      });
    });
    
    describe("when the cursor is inside a number", function() {
      it("it increments it", function() {
        editor.setCursorBufferPosition([0, 0]);
        for (var i = 0; i < 5; i++) { // + 5 times
          performIncr(editor);
        }
        expect(buffer.lineForRow(0)).toBe("16");
        //expect(editor.getCursorBufferPosition()).toEqual([0, 13]);
      });
    });
    
  });
});
