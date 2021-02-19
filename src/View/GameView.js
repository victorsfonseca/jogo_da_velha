import React from 'react'
import './GameView.css'
import $ from 'jquery'
import JogoDaVelha from '../Model/JogoDaVelha'
import {FaUndoAlt} from 'react-icons/fa'

const firstPlayer = 'firstPlayer'
const secondPlayer = 'secondPlayer'

class GameView extends React.Component{
    constructor(props){
        super(props)

        this.jogo = new JogoDaVelha()

        this.state = {
            board: this.jogo.board,
            player: this.jogo.player,
            history: this.jogo.history,
            score: this.jogo.score,
            finishedContent: 'Empate'
          }

        this.restartGame = this.restartGame.bind(this)
        this.undoPlay = this.undoPlay.bind(this)

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.wonLineActivate = this.wonLineActivate.bind(this)
        this.wonLineDeactivate = this.wonLineDeactivate.bind(this)

        this.boardItem = this.boardItem.bind(this)

        this.boardChanged = this.boardChanged.bind(this)
        this.historyChanged = this.historyChanged.bind(this)
        this.playerChanged = this.playerChanged.bind(this)
        this.finished = this.finished.bind(this)
        this.scoreChanged = this.scoreChanged.bind(this)

        this.gameItemClicked = this.gameItemClicked.bind(this)

        this.jogo.on('boardChanged', this.boardChanged)
        this.jogo.on('historyChanged', this.historyChanged)
        this.jogo.on('playerChanged', this.playerChanged)
        this.jogo.on('finished', this.finished)
        this.jogo.on('scoreChanged', this.scoreChanged)
    }

    // Game listenners. functions called by game api
    boardChanged(board){
        this.setState({
            board: board
          })
    }

    historyChanged(history){
        this.setState({
            history: history
        })
    }

    playerChanged(player){
        this.setState({
            player: player
        })
    }

    finished(obj){
        let status = obj.status
        if(status === 'won'){
            let playerWon = obj.player
            let where = obj.where

            if(playerWon === this.jogo.firstPlayer) {
                $('.gameFinished').addClass('firstPlayerWin')
                
                this.setState({
                    finishedContent: 'x Venceu!!!'
                })
                this.wonLineActivate(where)
                $('.gameFinished').css('display','flex').hide().delay(300).fadeIn(700)
            }

            if(playerWon === this.jogo.secondPlayer) {
                $('.gameFinished').addClass('secondPlayerWin')
                this.setState({
                    finishedContent: 'o Venceu!!!'
                })
                this.wonLineActivate(where)
                $('.gameFinished').css('display','flex').hide().delay(300).fadeIn(700)
            }
            return
        }

        if(status === 'tied'){

            $('.gameFinished').addClass('tied')
            this.setState({
                finishedContent: 'Empate!!!'
            })

            $('.gameFinished').css('display','flex').hide().fadeIn(700)
            return
        }
        
    }

    scoreChanged(score){
        this.setState({
            score: score
        })
    }

    
    // animate components...
    onMouseDown(){
        $('.Restart-button').toggleClass('button-pressed')
    }

    onMouseUp(){
        $('.Restart-button').toggleClass('button-pressed')
    }

    // animateDiagonalWin
    activateDiagonal(where){
        let lineStyleDiagonal0 = {
            'top': '5%',
            'left': '5%',
            'right': 'auto',
            'transform-origin': 'top left',
            'transform': 'skewy(45deg)'
        }

        let lineStyleDiagonal1 = {
            'top': '5%',
            'left': 'auto',
            'right': '5%',
            'transform-origin': 'top right',
            'transform': 'skewy(135deg)'
        }

        where? $('.wonLine').css(lineStyleDiagonal1).addClass('activateDiagonal'): $('.wonLine').css(lineStyleDiagonal0).addClass('activateDiagonal')
    }

    //animateColumnLineWin
    activateColumn(where){
        let colMargin = 16.66 +( (where * 2) * 16.66)
        let colMarginString = colMargin + '%'
        let lineStyleColumn = {
            'top': '5%',
            'left': colMarginString,
            'right': 'auto',
            'transform-origin': 'top left',
            'transform': 'skewy(0deg)'
        }
        $('.wonLine').css(lineStyleColumn).addClass('activateColumn')
    }

    // animateRowLineWIn
    activateRow(where){
        let rowMargin = 16.66 +( (where * 2) * 16.66)
        let rowMarginString = rowMargin + '%'
        let lineStyleRow = {
            'top': rowMarginString,
            'left': '5%',
            'right': 'auto',
            'transform-origin': 'top left',
            'transform': 'skewy(0deg)'

        }
        $('.wonLine').css(lineStyleRow).addClass('activateRow')
    }
    
    //wonLineAnimete
    wonLineActivate(where){

        if(where.row || where.row === 0){
            this.activateRow(where.row)
        }
        if(where.column || where.column === 0){
            this.activateColumn(where.column)
        }
        if(where.diagonal || where.diagonal === 0){
            this.activateDiagonal(where.diagonal)
        }
        
    }

    //desactiveWonLine
    wonLineDeactivate(){
        $('.wonLine').removeClass('activateDiagonal');
        $('.wonLine').removeClass('activateRow');
        $('.wonLine').removeClass('activateColumn');
    }

    // Game Comands...
    gameItemClicked(row,col){
        this.jogo.play(row, col)
    }

    undoPlay(){
        this.jogo.undoPlay()
    }

    restartGame(){
        this.jogo.restart()

        $('.gameFinished').removeClass('firstPlayerWin')
        $('.gameFinished').removeClass('secondPlayerWin')
        $('.gameFinished').removeClass('tied')
        $('.gameFinished').fadeOut()
        this.wonLineDeactivate()
    }

    // Custom Components.
    boardItem(row,col){

        let playerClass = firstPlayer
        if (this.state.board[row][col] === this.jogo.secondPlayer) playerClass = secondPlayer

        return <div className={'boardItem ' + playerClass} key={'boardItem' + row + col} onClick={()=> this.gameItemClicked(row,col)}>{this.state.board[row][col]}</div>
    }

    historyItem(player, row , col){
        let playerClass = firstPlayer
        if (player === this.jogo.secondPlayer) playerClass = secondPlayer

        return <div className='historyItem' key={'historyItem' + row + col} >
                    <p className={playerClass}>{player}</p> 
                    <p>&nbsp;marcou - linha&nbsp; </p>
                    <p className={playerClass}>{row}</p> 
                    <p>&nbsp;- coluna&nbsp; </p>
                    <p className={playerClass}>{col}</p>
                </div>
    }

    scoreItem(player, score){

        let playerClass = firstPlayer
        if (player === this.jogo.secondPlayer) playerClass = secondPlayer

        return <div className='placarItem'>
                    <div className={'placarItem-player ' + playerClass}>{player}</div>
                    <div className={'placarItem-score ' + playerClass}>{score}</div>
                </div>
    }

    gameContentTitle(){

        let playerClass = firstPlayer
        if (this.state.player === this.jogo.secondPlayer) playerClass = secondPlayer

        return <div className='GameContent-title'>Vez de:&nbsp; <div className={playerClass}>{this.state.player}</div></div>
    }

    // Render of page structure
    render(){
        return(
            <div className='Game-view'>
                <div className='View-topbar'>
                    <h1>Jogo da Velha</h1>
                </div>

                <div className='View-content'>
                    <div className='Game-content'>
                        <div className='GameContent-topbar'>
                            <div className='ReturnGame-icon' onClick={this.undoPlay}><FaUndoAlt/></div>
                            {this.gameContentTitle()}
                            {/* <div className='GameContent-title'>Vez de: {this.state.player}</div> */}
                        </div>

                        <div className='Game'>

                            <div className='gameFinished hide'>{this.state.finishedContent}</div>

                            <div className='columnDivision' style={ { left: '33.3%' } } ></div>
                            <div className='columnDivision' style={ { left: '66.6%' } } ></div>
                            <div className='rowDivision' style={ { top: '33.3%' } } ></div>
                            <div className='rowDivision' style={ { top: '66.6%' } } ></div>

                            <div className='wonLine' ></div>

                            <div className='gameRows'>
                            {
                               
                               this.state.board.map((item,row) =>{
                                   return <div className='gameRow' key={'gameRow' + row}> 
                                            {
                                                item.map((item,col) => {
                                                    return this.boardItem(row,col)
                                                })
                                            }
                                            </div>
                               })
                            }
                            </div>

                        </div>

                        <div className='GameContent-bottombar'>
                            <div className='Restart-button' onClick={this.restartGame} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onTouchStart={this.onMouseDown} onTouchEnd={this.onMouseUp}>Reiniciar Jogo</div>
                        </div>

                    </div>

                    <div className='Information-content'>
                        <h3 className='placarTitle'>Placar</h3>
                        <div className='placarItens'>
                            {this.scoreItem(this.jogo.firstPlayer, this.state.score.firstPlayer)}
                            {this.scoreItem(this.jogo.secondPlayer, this.state.score.secondPlayer)}
                        </div>
                        
                        <h3 className='historyTitle'>Jogadas</h3>
                        {this.state.history.length === 0? <p>Ainda não houve nenhuma jogada.</p>: ''}

                        {this.state.history.map((item, index) =>{
                            return this.historyItem(item.player, item.position.row, item.position.column)
                        })}
                    </div>
                </div>
            
                <div className='View-footer'>
                    <p>Designed and developed by Victor Fonseca. <a href='https://github.com/victorsfonseca/jogo_da_velha'>Click here</a> and learn more.</p>
                </div>
            </div>
        )
    }
}

export default GameView