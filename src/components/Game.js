import React, { Component } from 'react';
import Grid from './Grid';

class Game extends Component {
	constructor(props) {
		super(props);
		const size = this.props.size;

		this.state = {
			lastClicked: null,
			xIsNext: true, // Let's call the first player X
			gridNodes: Array(size)
				.fill()
				.map(() =>
					Array(size)
						.fill()
						.map(() => ({
							right: false,
							down: false,
							owner: null
						}))
				)
		};

		this.nodeClicked = this.nodeClicked.bind(this);
		this.setAction = this.setAction.bind(this);
	}

	setAction(from, to) {
		if (
			Math.abs(from.row - to.row) === 1 &&
			Math.abs(from.col - to.col) === 0
		) {
			return {
				line: 'vertical',
				node: from.row > to.row ? to : from
			};
		} else if (
			Math.abs(from.row - to.row) === 0 &&
			Math.abs(from.col - to.col) === 1
		) {
			return {
				line: 'horizontal',
				node: from.col > to.col ? to : from
			};
		} else {
			return {
				line: null
			};
		}
	}

	nodeClicked(clickedNode) {
		console.log(`clicked ${clickedNode.row}, ${clickedNode.col}`);

		const lastClicked = this.state.lastClicked;
		if (
			!lastClicked ||
			(clickedNode.row == lastClicked.row &&
				clickedNode.col == lastClicked.col)
		) {
			this.setState({
				lastClicked: clickedNode
			});
		} else {
			const action = this.setAction(this.state.lastClicked, clickedNode);
			if (action.line) {
				this.setState(prevState => {
					let gridState = prevState.gridNodes.slice();
					const row = action.node.row;
					const col = action.node.col;

					if (action.line === 'vertical') {
						gridState[row][col].down = true;
						gridState = this.updateOwner(gridState, row, col - 1);
					} else if (action.line === 'horizontal') {
						gridState[row][col].right = true;
						gridState = this.updateOwner(gridState, row - 1, col);
					}

					gridState = this.updateOwner(gridState, row, col);

					return {
						lastClicked: action.line ? null : prevState.lastClicked,
						xIsNext: !prevState.xIsNext,
						gridNodes: gridState
					};
				});
			}
		}
	}

	isValidMove(gridState, size, row, col) {
		return (
			row >= 0 &&
			col >= 0 &&
			row < size - 1 &&
			col < size - 1 &&
			!gridState[row][col].owner
		);
	}

	updateOwner(gridState, row, col) {
		let size = this.props.size;
		let gridNodes = this.state.gridNodes;

		if (
			this.isValidMove(gridState, size, row, col) &&
			gridState[row][col].right &&
			gridState[row][col].down &&
			gridState[row + 1][col].right &&
			gridState[row][col + 1].down
		) {
			gridState[row][col].owner = this.state.xIsNext ? 'X' : 'O';
		}

		return gridState;
	}

	render() {
		return (
			<Grid
				size={this.props.size}
				gridNodes={this.state.gridNodes}
				xIsNext={this.state.xIsNext}
				nodeClicked={this.nodeClicked}
				lastClicked={this.state.lastClicked}
			/>
		);
	}
}

export default Game;
