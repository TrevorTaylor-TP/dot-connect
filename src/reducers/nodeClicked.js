function setAction(from, to) {
  if (
    Math.abs(from.r - to.r) === 1 &&
    Math.abs(from.c - to.c) === 0
  ) {
    return {
      line: 'vertical',
      node: from.r > to.r ? to : from
    };
  } else if (
    Math.abs(from.r - to.r) === 0 &&
    Math.abs(from.c - to.c) === 1
  ) {
    return {
      line: 'horizontal',
      node: from.c > to.c ? to : from
    };
  } else {
    return {
      line: null
    };
  }
}


function isValidMove(gridState, row, col, size) {
  return (
    row >= 0 &&
    col >= 0 &&
    row < size.r - 1 &&
    col < size.c - 1 &&
    !gridState[row][col].owner
  );
}


function nodeClicked(state, clickedNode) {
  console.log(`clicked ${clickedNode.r}, ${clickedNode.c}`);

  const lastClicked = state.lastClicked;
  if (!lastClicked ||
    state.isX !== state.xIsNext ||
    !state.connected ||
    (clickedNode.r === lastClicked.r &&
      clickedNode.c === lastClicked.c)
  ) {
    return {
      lastClicked: clickedNode
    };
  }

  let gridState = state.gridNodes.slice();
  let gotNodes = 0; // How many nodes did they get?
  let gotNode;
  let xIsNext = state.xIsNext;
  const size = state.size;
  let score = state.score;
  const players = state.players;

  const action = setAction(state.lastClicked, clickedNode);
  if (
    !action.line ||
    (gridState[action.node.r][action.node.c].down && action.line === 'vertical') ||
    (gridState[action.node.r][action.node.c].right && action.line === 'horizontal')
  ) {
    return {
      lastClicked: clickedNode
    };
  }

  const row = action.node.r;
  const col = action.node.c;

  if (action.line === 'vertical') {
    gridState[row][col].down = true;
    [gridState, gotNode] = updateOwner(gridState, xIsNext, row, col - 1, size, players);
  } else if (action.line === 'horizontal') {
    gridState[row][col].right = true;
    [gridState, gotNode] = updateOwner(gridState, xIsNext, row - 1, col, size, players);
  }
  gotNodes += gotNode;

  [gridState, gotNode] = updateOwner(gridState, xIsNext, row, col, size, players);
  gotNodes += gotNode;


  xIsNext = (gotNodes ? xIsNext : !xIsNext);
  score = {
    x: (xIsNext ? score.x + gotNodes : score.x),
    o: (xIsNext ? score.o : score.o + gotNodes),
  };
  let gameStatus;

  if ( score.x + score.o === (size.r-1)*(size.c-1)) {
    if ( score.x === score.o ) {
      gameStatus = 'Draw!';
    } else {
      gameStatus = `${score.x > score.o ? players.x : players.o} won by ${Math.abs(score.x - score.o)} point(s)`;
    }
  } else {
    gameStatus = `To move: ${xIsNext ? players.x : players.o}`;
  }


  return {
    lastClicked: action.line ? null : state.lastClicked,
    xIsNext: xIsNext,
    gameStatus: gameStatus,
    gridNodes: gridState,
    score: score,
  }
}


function updateOwner(gridState, xIsNext, row, col, size, players) {
  let gotNode = false;
  if (
    isValidMove(gridState, row, col, size) &&
    gridState[row][col].right &&
    gridState[row][col].down &&
    gridState[row + 1][col].right &&
    gridState[row][col + 1].down
  ) {
    gridState[row][col].owner = xIsNext ? players.x[0] : players.o[0];
    gotNode = true;
  }

  return [gridState, gotNode];
}

export default nodeClicked;
