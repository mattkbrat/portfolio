<script lang="ts">
import "./styles.css";
import { browser, dev } from "$app/environment";
import { onMount } from "svelte";
import { isWinningMove, threeArr, type Board } from "./game";

let plays = $state(0);
let board = $state([] as Board);
let winner: string | null = $state("");
let gameState = $state("play" as "play" | "setup");
let mounted = $state(false);
const storedGameState = $state(
	{} as {
		size: number;
		players: string[];
		cacheState: string[];
		board: string;
		streakToWin: number;
	},
);

const boardDimension = $derived(storedGameState.size);
const streakToWin = $derived(storedGameState.streakToWin);
const cacheState = $derived(storedGameState.cacheState);
const isTie = $derived(!winner && plays === boardDimension * boardDimension);

// biome-ignore lint/style/useConst: Altered later down through bind
let boardRef: HTMLDivElement | null = $state(null);

const undo = () => {
	const state = $state.snapshot(cacheState);
	if (state.length === 0) return;
	const lastState = state.pop() || "";
	storedGameState.board = lastState;
	storedGameState.cacheState = state;
	setBoard({ size: storedGameState.size, state: lastState });
	if (gameState === "setup") gameState = "play";
	if (winner) winner = "";
};

const play = (square: Board[number][number]) => {
	cacheState.push(storedGameState.board);
	if (square.player) return;
	square.player = nextPlay;
	setTimeout(() => {
		const { win, gameState } = isWinningMove({
			t: nextPlay,
			size: boardDimension,
			winStreak: streakToWin,
		});
		if (win) {
			winner = nextPlay;
			players[plays % 2 ? 1 : 0].wins++;
			return;
		}
		if (storedGameState.board !== gameState) {
			storedGameState.board = gameState;
		}

		plays++;
	}, 100);
};

const scrollToBoardTop = () => {
	if (!boardRef) return;
	boardRef.scrollIntoView();
};

const players = $state([
	{
		character: "O",
		wins: 0,
	},
	{
		character: "X",
		wins: 0,
	},
]);

const gameStateKey = "tic-tac-toe";

const setBoard = (init: { size: number; state?: string }) => {
	if (init.state) {
		const pieces = init.state.split("");
		const squares: Board = [];

		let storedPlays = 0;
		main: for (let x = 0; x < init.size; x++) {
			squares.push([]);
			for (let i = 0; i < init.size; i++) {
				const pieceIndex = x * init.size + i;
				const piece = pieces[pieceIndex];
				if (!piece) {
					alert("Stored gamestate has been altered or is otherwise invalid");
					// State altered or otherwise invalid
					break main;
					// throw new Error('No piece found');
				}
				const emptySquare = piece === "-";
				const thisSquare = emptySquare
					? { player: null, index: pieceIndex }
					: { player: piece, winMark: false, index: pieceIndex, pieceIndex };
				squares[x][i] = thisSquare;
				if (!emptySquare) {
					storedPlays++;
				}
			}
		}

		board = squares;
		plays = storedPlays;
	} else {
		board = Array.from(new Array(init.size).keys()).map((i) =>
			threeArr(i, init.size),
		) as Board;
	}
};

let nextPlay = $derived(
	(plays % 2 ? players[1].character : players[0].character)[0],
);

$effect(() => {
	if (!mounted || !browser) return;
	localStorage.setItem(gameStateKey, JSON.stringify(storedGameState));
});

$effect(() => {
	if (!browser) return;
	if (boardDimension === storedGameState.size) return;
	storedGameState.size = boardDimension;
});

let setup = $derived(gameState === "setup");

const setPlayers = (newPlayers: string[]) => {
	if (!storedGameState.players) {
		storedGameState.players = newPlayers;
		return;
	}
	if (storedGameState.players.join("") === newPlayers.join("")) return;
	storedGameState.players = newPlayers;
};

$effect(() => {
	setPlayers(players.map((p) => p.character));
});

const reset = (size: number, streakToWin?: number) => {
	plays = 0;
	winner = null;
	if (size === 3) {
		storedGameState.size = 3;
		storedGameState.streakToWin = streakToWin || 3;
	} else if (size === 5) {
		storedGameState.size = 5;
		storedGameState.streakToWin = streakToWin || 4;
	}

	if (streakToWin) {
		storedGameState.streakToWin = streakToWin;
	}
	setBoard({ size });
	storedGameState.cacheState = [];
	gameState = "play";

	setTimeout(() => {
		scrollToBoardTop();
	}, 100);
};

$effect(() => {
	if (gameState === "play" && winner) {
		gameState = "setup";
	}
});

$effect(() => {
	if (boardDimension >= streakToWin) return;
	storedGameState.size = boardDimension;
});
onMount(() => {
	const stored = localStorage.getItem(gameStateKey);
	if (stored) {
		const storedStateObj = JSON.parse(stored) as typeof storedGameState;
		const storedState = storedStateObj.board;
		const storedSize = Number(storedStateObj.size);
		const storedPlayers = storedStateObj.players;
		const streakToWin = storedStateObj.streakToWin;
		const cacheState = storedStateObj.cacheState;

		if (storedPlayers) {
			players[0].character === storedPlayers[0] || "X";
			players[1].character === storedPlayers[1] || "X";
		}
		if (storedState && !Number.isNaN(Number(storedSize))) {
			setBoard({ size: Number(storedSize), state: storedState });
		} else {
			setBoard({ size: 3 });
		}

		storedGameState.players = storedPlayers;
		storedGameState.size = storedSize;
		storedGameState.board = storedState;
		storedGameState.streakToWin = streakToWin || 3;
		storedGameState.cacheState = cacheState?.length ? cacheState : [];
	} else {
		storedGameState.players = [];
		storedGameState.size = 3;
		storedGameState.board = "";
		storedGameState.streakToWin = 3;
		storedGameState.cacheState = [];
		setBoard({ size: 3 });
	}

	mounted = true;
});
</script>

<svelte:head>
	<title>Tic-Tac-Toe | Games</title>
</svelte:head>
{#if setup || winner}
	{#if winner}
		<p class="text-2xl pb-4">
			Congrats, {winner}!
		</p>
	{/if}
	<div class="flex flex-wrap">
		<button
			type="button"
			class="btn btn-lg variant-filled-primary flex-1 outline outline-[1px]"
			onclick={() => {
				reset(3);
			}}
		>
			New Game (Standard)
		</button>
		<button
			type="button"
			class="btn btn-lg variant-filled-primary flex-1 outline outline-[1px]"
			onclick={() => {
				reset(5);
			}}
		>
			New Game (5 x 5, 4 to win)
		</button>
	</div>
	<section>
		<h3>Custom</h3>
		<label>
			Set Board Size ({boardDimension})
			<input class="input" type="range" min={2} max={7} bind:value={storedGameState.size} />
		</label>
		<label>
			Streak to Win ({streakToWin})
			<input
				class="input"
				type="range"
				min={2}
				max={boardDimension}
				bind:value={storedGameState.streakToWin}
			/>
		</label>
		<button
			type="button"
			class="btn btn-lg variant-filled-secondary w-full"
			onclick={() => {
				reset(boardDimension, streakToWin);
				gameState = 'play';
			}}
		>
			New Game (Custom)
		</button>
	</section>
{:else}
	<div
		class={'grid items-center max-h-screen aspect-square mx-auto relative'}
		id={'game-board'}
		bind:this={boardRef}
	>
		{#if isTie}
			<button
				type="button"
				class="absolute top-0 left-0 z-10 px-10"
				id={'reset-button'}
				class:obscure={isTie}
				onclick={() => {
					gameState = 'setup';
				}}
			>
				<span> TIE! </span>
				<br />
				<br />
				<span class="!text-2xl"> Reset Game </span>
			</button>
		{/if}
		{#each board as row, n}
			<div class="flex">
				{#each row as square, x}
					<button
						class="aspect-square border-2 relative text-4xl bg-surface-50-900-token border-surface-100-800-token w-full hover:bg-surface-200-700-token text-surface-50-900-token"
						name="game-square"
						data-player={square.player}
						class:!bg-success-400-500-token={square.player === players[0].character}
						class:!bg-error-400-500-token={square.player === players[1].character}
						onclick={() => {
							play(square);
						}}
					>
						{square.player}
						{#if dev}
							<span class="absolute top-0 right-0 text-sm">
								{x + n * boardDimension}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		{/each}
	</div>
{/if}
<div class="flex gap-x-2 items-center justify-between flex-wrap">
	{#if gameState === 'play'}
		<button
			type="button"
			class="btn btn-md variant-outline-warning"
			onclick={() => {
				if (!confirm('Reset game?')) return;
				gameState = 'setup';
			}}
		>
			Reset
		</button>
	{/if}
	{#if !isTie && !winner}
		<span class="text-2xl uppercase underline underline-offset-2">
			{nextPlay}'s turn
		</span>
	{/if}
	{#if cacheState?.length}
		<button
			type="button"
			class="btn btn-md variant-outline-tertiary"
			onclick={() => {
				undo();
			}}
		>
			Undo
		</button>
	{/if}
</div>

<button
	type="button"
	class="btn btn-lg variant-ghost-tertiary w-full lg:hidden"
	onclick={() => {
		scrollToBoardTop();
	}}
>
	Center Board
</button>

<hr class="my-4" />

<div class="flex flex-wrap">
	{#each players as player}
		<label class="flex-1">
			<input disabled={!setup} bind:value={player.character} class="input flex-1" maxlength={1} />
			{player.wins} Wins
		</label>
	{/each}
</div>

<span>
	{storedGameState.streakToWin} streak needed
</span>
