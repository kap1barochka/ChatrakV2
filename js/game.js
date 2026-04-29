// --- МИНИ-ИГРА И ПАЗЛЫ В ШАХМАТЫ ---

$(document).ready(function() {
    if ($('#myBoard').length === 0) return;

    var board = null;
    var game = new Chess();
    let isPuzzleMode = false; // Переключатель: играем классику или пазл
    let currentPuzzle = null;

    // ==========================================
    // БАЗА ЗАДАЧ (Добавляй новые сюда)
    // ==========================================
    const statusEls = {
        mode: $('#game-mode'),
        turn: $('#game-turn'),
        status: $('#game-status'),
        lastMove: $('#last-move')
    };

    function updateGameStatus(message, lastMoveText) {
        const turnText = game.turn() === 'w' ? 'White' : 'Black';
        let statusText = message || 'Game in progress';

        if (game.in_checkmate()) statusText = 'Checkmate';
        else if (game.in_stalemate()) statusText = 'Stalemate';
        else if (game.in_draw()) statusText = 'Draw';
        else if (game.in_check()) statusText = turnText + ' is in check';

        statusEls.mode.text(window.chatrakT ? window.chatrakT(isPuzzleMode ? 'Puzzle Mode' : 'Classic Game') : (isPuzzleMode ? 'Puzzle Mode' : 'Classic Game'));
        statusEls.turn.text(window.chatrakT ? window.chatrakT(turnText) : turnText);
        statusEls.status.text(window.chatrakT ? window.chatrakT(statusText) : statusText);
        if (lastMoveText) statusEls.lastMove.text(lastMoveText);
    }

    const puzzles = [
        {
            title: "Mate In 2",
            desc: "White to move and win. Find the brilliant queen sacrifice played by Mikhail Tal.",
            hint: "Hint: Look at the f7 square! The Queen is ready to strike.",
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1"
        },
        {
            title: "Mate In 1",
            desc: "White to move. The Black King is trapped. Find the classic 'Back Rank' checkmate.",
            hint: "Hint: Use your Rook to attack the 8th rank.",
            fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1"
        },
        {
            title: "Mate In 1",
            desc: "Black to move. White's King is cornered. Deliver the final blow with your Queen!",
            hint: "Hint: Move the Queen closer to the White King.",
            fen: "1k6/1P6/2K5/8/8/8/8/6q1 b - - 0 1"
        }
    ];

    // Функция: компьютер делает случайный ход
    function makeRandomMove() {
        var possibleMoves = game.moves();

        if (possibleMoves.length === 0) {
            if (game.in_checkmate()) alert(window.chatrakT ? window.chatrakT("Мат! Отличная игра.") : "Мат! Отличная игра.");
            else if (game.in_draw() || game.in_stalemate()) alert(window.chatrakT ? window.chatrakT("Ничья!") : "Ничья!");
            return;
        }

        var randomIdx = Math.floor(Math.random() * possibleMoves.length);
        var systemMove = game.move(possibleMoves[randomIdx]);
        board.position(game.fen());
        updateGameStatus('System answered', systemMove ? systemMove.san : '—');
    }

    // Когда пользователь начинает тянуть фигуру
    function onDragStart(source, piece, position, orientation) {
        if (game.game_over()) return false;

        // В пазлах смотрим, чей ход по FEN. Если в классике - играем за белых.
        let turn = game.turn(); 
        if ((turn === 'w' && piece.search(/^b/) !== -1) || 
            (turn === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    }

    // Когда пользователь отпускает фигуру (сделал ход)
    function onDrop(source, target) {
        var move = game.move({ from: source, to: target, promotion: 'q' });

        if (move === null) return 'snapback';
        updateGameStatus('Move accepted', move.san);

        // Проверка на победу в пазле
        if (isPuzzleMode && game.in_checkmate()) {
            updateGameStatus('Puzzle solved', move.san);
            setTimeout(() => alert(window.chatrakT ? window.chatrakT("Brilliant! You solved the puzzle and delivered checkmate!") : "Brilliant! You solved the puzzle and delivered checkmate!"), 200);
            return;
        }

        // Если игра продолжается, система отвечает
        window.setTimeout(makeRandomMove, 250);
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

    var config = {
        draggable: true,           
        position: 'start', 
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };

    board = Chessboard('myBoard', config);

    // ==========================================
    // КНОПКИ УПРАВЛЕНИЯ
    // ==========================================

    // Кнопка: ЗАГРУЗИТЬ СЛУЧАЙНЫЙ ПАЗЛ
    $('#load-puzzle-btn').on('click', function() {
        const randomIdx = Math.floor(Math.random() * puzzles.length);
        const selectedPuzzle = puzzles[randomIdx];
        currentPuzzle = selectedPuzzle;

        // Меняем текст на странице
        $('#puzzle-title').text(window.chatrakT ? window.chatrakT(selectedPuzzle.title) : selectedPuzzle.title);
        $('#puzzle-desc').text(window.chatrakT ? window.chatrakT(selectedPuzzle.desc) : selectedPuzzle.desc);
        
        // Показываем кнопку подсказки и вешаем на нее актуальный текст
        $('#hint-puzzle-btn').show().off('click').on('click', () => alert(window.chatrakT ? window.chatrakT(selectedPuzzle.hint) : selectedPuzzle.hint));

        // Загружаем пазл на доску
        isPuzzleMode = true;
        game.load(selectedPuzzle.fen);
        
        // Если ход черных, переворачиваем доску для удобства
        if(game.turn() === 'b') {
            board.orientation('black');
        } else {
            board.orientation('white');
        }
        
        board.position(selectedPuzzle.fen);
        statusEls.lastMove.text('—');
        updateGameStatus('Find the best move');
    });

    // Кнопка: НОВАЯ КЛАССИЧЕСКАЯ ИГРА (Сброс)
    $('#restartBtn').off('click').on('click', function() {
        // 1. Выключаем режим пазла
        isPuzzleMode = false;
        
        // 2. Сбрасываем логику игры (правила)
        game.reset();
        
        // 3. Жестко сбрасываем визуальную доску (это 100% сработает)
        board.position('start');
        board.orientation('white'); 
        
        // 4. Возвращаем стандартные тексты
        currentPuzzle = null;
        $('#puzzle-title').text(window.chatrakT ? window.chatrakT('Classic Game') : 'Classic Game');
        $('#puzzle-desc').text(window.chatrakT ? window.chatrakT('Play a standard chess game against the computer.') : 'Play a standard chess game against the computer.');
        $('#hint-puzzle-btn').hide(); 
        statusEls.lastMove.text('—');
        updateGameStatus('Ready to play');
    });

    updateGameStatus('Ready to play');



    document.addEventListener('chatrak:languagechange', () => {
        if (currentPuzzle) {
            $('#puzzle-title').text(window.chatrakT ? window.chatrakT(currentPuzzle.title) : currentPuzzle.title);
            $('#puzzle-desc').text(window.chatrakT ? window.chatrakT(currentPuzzle.desc) : currentPuzzle.desc);
        } else {
            $('#puzzle-title').text(window.chatrakT ? window.chatrakT('Classic Game') : 'Classic Game');
            $('#puzzle-desc').text(window.chatrakT ? window.chatrakT('Play a standard chess game against the computer.') : 'Play a standard chess game against the computer.');
        }
        updateGameStatus();
    });

    // Если меняется размер окна, доска адаптируется
    $(window).resize(board.resize);
});