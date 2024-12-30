// Adapted from https://stackoverflow.com/a/77190125

export type Square = (
	| { player: null }
	| { player: string; winMark: boolean }
) & {
	index: number;
};
export type Board = Square[][];
export const threeArr = (start: number, size: number): Square[] =>
	Array.from(new Array(size).keys()).map((i) => {
		return {
			player: null,
			index: start * size + i,
			// rowNum * boardDimension + colNum
		};
	});

export const getBoardData = (t: string, selector: string) => {
	const elements_data = Array.from(document.getElementsByName(selector));

	const hashState = elements_data.map((e) => e.dataset.player || "-");
	const boardData = hashState.map((e) => {
		return e === t ? t : "";
	});

	return { hashState, boardData };
};

/**
 * Check board after player makes their move.
 *
 * @param t the player characters
 */
export function isWinningMove({
	t,
	size,
	selector = "game-square",
	winStreak = size + 1,
}: {
	t: string;
	size: number;
	selector?: string;
	winStreak?: number;
}): { win: boolean; gameState: string } {
	const { hashState, boardData } = getBoardData(t, selector);
	const win = getWinningConfigurations(boardData, size, winStreak);

	// If any of the winning configurations width number of the players characters, then they win.
	return { win, gameState: hashState.join("") };
}

/**
 * Create an array of possible winning configurations.
 */
export function getWinningConfigurations(
	boardData: string[],
	size: number,
	winStreak: number,
): boolean {
	// row wins
	for (let index = 0; index < size; index++) {
		let streak = 0;

		for (let _index = 0; _index < size; _index++) {
			const nextIndex = index * size + _index;

			if (boardData[nextIndex]) {
				streak++;
				if (streak >= winStreak) return true;
			} else streak = 0;
		}
	}

	// column wins
	for (let index = 0; index < size; index++) {
		let streak = 0;

		for (let _index = 0; _index < size; _index++) {
			const nextIndex = index + _index * size;
			if (boardData[nextIndex]) {
				streak++;
				if (streak >= winStreak) return true;
			} else streak = 0;
		}
	}

	// If the winstrak is less than the board width, search multiple diagonals.

	const searchArr =
		winStreak === size
			? [0]
			: Array.from(new Array(size - winStreak + 1).keys());

	for (const i of searchArr) {
		// descending diagonal right win
		let streak = 0;
		for (let index = 0; index < size; index++) {
			const nextIndex = i + index + index * size;
			if (boardData[nextIndex]) {
				streak++;
				if (streak >= winStreak) return true;
			} else streak = 0;
		}

		if (streak >= winStreak) return true;

		// ascending diagonal left win

		streak = 0;

		for (let index = size; index > 0; index--) {
			const nextIndex = i + (index - index * size) * -1;
			if (boardData[nextIndex]) {
				streak++;
				if (streak >= winStreak) return true;
			} else streak = 0;
		}
	}

	return false;
}
