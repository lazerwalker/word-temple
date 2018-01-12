import * as Board from '../Board';
import { BoardTile } from '../Tile';

describe("finding all words on a board", () => {
  let board: Board.Board;
  let words: BoardTile[][];

  beforeEach(() => {
    const tiles = [
      {x: 0, y: 1, letter: 'C', value: 3},
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 2, y: 1, letter: 'T', value: 1},
      {x: 1, y: 2, letter: 'J', value: 1},
      {x: 3, y: 5, letter: 'Z', value: 10}
    ];

    board = { tiles, size: 7 };

    words = Board.findWords(board);
  });

  it("should find horizontal words", () => {
    const cat = [
      {x: 0, y: 1, letter: 'C', value: 3},
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 2, y: 1, letter: 'T', value: 1}
    ];
    expect(words).toContainEqual(cat);

  });

  it("should find vertical words", () => {
    const aj = [
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 1, y: 2, letter: 'J', value: 1}
    ];
    expect(words).toContainEqual(aj);
  });

  it("should find all valid words", () => {
    expect(words).toHaveLength(2);
  });
});

describe("checking if a word is a valid word", () => {
  it("should say if a word is valid", () => {
    const cat = [
      {x: 0, y: 1, letter: 'C', value: 3},
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 2, y: 1, letter: 'T', value: 1}
    ];

    const isValid = Board.checkWord(cat);
    expect(isValid).toBeTruthy();
  });

  it("should say if a word is invalid", () => {
    const aj = [
      {x: 1, y: 1, letter: 'A', value: 1},
      {x: 1, y: 2, letter: 'J', value: 1}
    ];

    const isValid = Board.checkWord(aj);
    expect(isValid).toBeFalsy();
  });
});

describe("checking if a board is valid", () => {
  describe("when the board is valid", () => {
    var validity: Board.BoardValidity;
    beforeEach(() => {
      const tiles = [
        {x: 0, y: 1, letter: 'C', value: 3},
        {x: 1, y: 1, letter: 'A', value: 1},
        {x: 2, y: 1, letter: 'T', value: 1},
        {x: 1, y: 2, letter: 'B', value: 1},
        {x: 3, y: 5, letter: 'Z', value: 10}
      ];

      const board = {tiles, size: 7};
      validity = Board.checkBoard(board);
    });

    it("should be valid", () => {
      expect(validity.isValid).toBeTruthy();
    });

    it("should return all non-solo tiles as valid", () => {
      expect(validity.validTiles).toHaveLength(4);
      expect(validity.validTiles).not.toContainEqual({x: 3, y: 5, letter: 'Z', value: 10});
    });

    it("should have no invalid tiles", () => {
      expect(validity.invalidTiles).toHaveLength(0);
    });

    it("should return the disconnected tile", () => {
      expect(validity.disconnectedTiles).toEqual([{x: 3, y: 5, letter: 'Z', value: 10}]);
    });
  });

  describe("when the board is invalid", () => {
    var validity: Board.BoardValidity;

    beforeEach(() => {
      const tiles = [
        {x: 0, y: 1, letter: 'C', value: 3},
        {x: 1, y: 1, letter: 'A', value: 1},
        {x: 2, y: 1, letter: 'T', value: 1},
        {x: 1, y: 2, letter: 'J', value: 1},
        {x: 3, y: 5, letter: 'Z', value: 10}
      ];

      const board = { tiles, size: 7 };
      validity = Board.checkBoard(board);
    });

    it("should be invalid", () => {
      expect(validity.isValid).toBeFalsy();
    });

    it("should set the valid tiles list", () => {
      expect(validity.validTiles).toEqual([
        {x: 0, y: 1, letter: 'C', value: 3},
        {x: 2, y: 1, letter: 'T', value: 1}
      ]);
    });

    it("should set the invalid tiles list", () => {
      expect(validity.invalidTiles).toEqual([
        {x: 1, y: 1, letter: 'A', value: 1},
        {x: 1, y: 2, letter: 'J', value: 1}
      ]);
    });

    it("should set the disconnected tiles list", () => {
      expect(validity.disconnectedTiles).toEqual([{x: 3, y: 5, letter: 'Z', value: 10}]);

    });
  });
});