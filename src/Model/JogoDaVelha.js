class JogoDaVelha{

    constructor(){

        this._board= [[null, null, null],
                        [null, null, null],
                        [null, null, null]];
        this._history = [];
        this._firstPlayer = 'x';
        this._secondPlayer = 'o';
        this._player = this._firstPlayer;
        this._score = {
            firstPlayer: 0,
            secondPlayer: 0
        }
        this._inicialPlayer = this._firstPlayer;
        
        this._listenners = [];
        
    }

    get board(){
        return this._board
    }

    get history(){
        return this._history
    }

    get player(){
        return this._player
    }

    get firstPlayer(){
        return this._firstPlayer
    }

    get secondPlayer(){
        return this._secondPlayer
    }

    get score(){
        return this._score
    }

    on(event, callback){
        this._listenners.push({
            event: event,
            callback: callback
        })
    }

    emit(event, params){
        this._listenners.forEach(listenner => {
            if(listenner.event == event) listenner.callback(params);
        });
    }

    _scoreUpdate(){
        if(this._player === this._firstPlayer) this._score.firstPlayer = ++this._score.firstPlayer
        if(this._player === this._secondPlayer) this._score.secondPlayer = ++this._score.secondPlayer
        this.emit('scoreChanged', this._score )
    }

    _changePlayer(){
        this._player = (this._player === this._firstPlayer)? this._secondPlayer : this._firstPlayer
        this.emit('playerChanged', this._player)
    }

    _addToHistory(row,column,player){
        let item = {
                        player: player,
                        position: {
                            row: row,
                            column: column
                        }
                    };
        
        this._history.push(item);

        this.emit('historyChanged', this._history)
    }

    _undoHistory(){
        this._history.pop();
        this.emit('historyChanged', this._history)
    }

    _changeBoard( row, column, value){
        this._board[row][column] =  value
        this.emit('boardChanged', this._board)
    }

    _checkRow(row){
        let val = this._board[row][0];
        if(val === null) return false
        if(val === this._board[row][1] && val === this._board[row][2]) return true
        return false
    }

    _checkRows(){ 
        for(let i = 0; i < 3; i++) if(this._checkRow(i)) return {row: i}
        return false
    }

    _checkColumn(column){
        let val = this._board[0][column];
        if(val === null) return false
        if(val === this._board[1][column] && val === this._board[2][column]) return true
        return false
    }

    _checkColumns(){
        for(let i = 0; i < 3; i++) if(this._checkColumn(i)) return {column: i}
        return false
    }
    _checkDiagonals(){
        let val = this._board[1][1]
        if(val === null) return false
        if(val === this._board[0][0] && val === this._board[2][2]) return {diagonal: 0}
        if(val === this._board[0][2] && val === this._board[2][0]) return {diagonal: 1}
        return false
    }

    _checkIfTied(){
        for(let row of this._board){
            for(let col of row){
                if(col === null) return false
            }
        }
        return true
    } //Empate

    _checkIfWon(){
        let rowsResponse = this._checkRows();
        if(rowsResponse) {

            return rowsResponse
        }
        let columnResponse = this._checkColumns();
        if(columnResponse) return columnResponse
        let diagonalsResponse = this._checkDiagonals();
        if(diagonalsResponse) return diagonalsResponse
        return false
    }

    _finished(){
        return (this._checkIfWon() || this._checkIfTied())? true: false
    }

    play(row, column){
        
        if(this._finished()) return

        if(this._board[row][column] !== null) return

        this._changeBoard(row, column, this._player)
        this._addToHistory(row, column, this._player)

        let wonResponse = this._checkIfWon()
        if(wonResponse) { 
            this.emit('finished', {status: 'won', player: this._player, where:wonResponse}); 
            this._scoreUpdate()
            return;
        }

        if(this._checkIfTied()) { this.emit('finished', {status: 'tied'}); return;}

        this._changePlayer()
    }

    undoPlay(){
        if(this._finished()) return
        let lastPlay = this._history[this._history.length - 1]
        if (lastPlay){
            this._changeBoard(lastPlay.position.row, lastPlay.position.column, null)
            this._undoHistory()
            this._changePlayer()
        }
    }

    _changeInicialPlayer(){
        this._inicialPlayer = this._inicialPlayer === this._firstPlayer? this._secondPlayer: this._firstPlayer
    }

    restart(){
        this._board = [[null, null, null],
                        [null, null, null],
                        [null, null, null]];

        this.emit('boardChanged', this._board)
        this._changeInicialPlayer()
        this._player = this._inicialPlayer
        this.emit('playerChanged', this._player)
        this._history = []
        this.emit('historyChanged', this._history)
    }
    
}

export default JogoDaVelha