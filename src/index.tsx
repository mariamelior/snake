import * as React from 'react';
import * as ReactDOM from "react-dom";

enum STEP {
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40
}

enum FIELD {
    EMPTY = 0,
    SNAKE = 1,
    APPLE = 2 
}

interface IState {
    sizeX: number;
    sizeY: number;
    speed: number;
    snake: number[][];
    step: STEP;
    field: FIELD[][];
    hasError: boolean;
    errorMessage: string;
    isStart: boolean;
    isFinish?: boolean;
    timer?: any;
    apples: number;
} 

export class App extends React.Component<{}, IState> {
    constructor(props) {
        super(props)
    }

    state: IState = {
        sizeX: 10,
        sizeY: 10,
        snake: [[0,0]],
        step: STEP.DOWN,
        field: [],
        hasError: false,
        errorMessage: '',
        isStart: false,
        speed: 1,
        apples: 0
    }

    startGame = () => {
        let {sizeX, sizeY, field, snake, speed} = this.state;
        field = new Array(sizeY);
        for (let i=0; i<sizeY; i++) {
            field[i] = (new Array(sizeX)).fill(FIELD.EMPTY);
        }
        field[0][0] = FIELD.SNAKE;
        let app: Array<number> = this.generateApple(field);
        field[app[0]][app[1]] = FIELD.APPLE;
        var timer = setInterval(this.doStep, speed*100);
        this.setState({isStart:true, field, snake, step: STEP.DOWN , timer , apples: 0});

        document.getElementById('field').focus();
    }

    endGame = () => {
        let {timer} = this.state;
        clearInterval(timer);
        this.setState({field: [], isStart: false, snake: [[0,0]], isFinish: true});
    }

    onChangeParam = (type:string, e) => {
        let value: number = e.target.value;
        let state = this.state;
        state[type] = value;
        this.setState(state);
    }

    onBlurField = (value:string) => { 
        let size: number = this.state[value];
        let state = this.state;
        if (size < 2) {
            state[value] = 10;
            state.hasError = true;
            state.errorMessage = "Размер поля должен быть больше 1";
            this.setState(state);
        } else this.setState({hasError: false})
    }

    onBlurSpeed = () => {
        let {speed} = this.state;
        if (speed<1) {
            this.setState({hasError: true, errorMessage: "Некорректное значение", speed: 1});
        } else this.setState({hasError: false})
    }

    onKeyEnter = (e) => {
        let {step, snake} = this.state;
        let newStep: STEP = e.keyCode;
        if (newStep%2 != step%2 || snake.length === 1) {
            this.setState({step:newStep})
        } 
    }

    doStep = () => {
        let {snake, field, apples} = this.state;
        let newStep: Array<number> = this.processStep(snake[0]);
        if (field[newStep[0]][newStep[1]] === FIELD.SNAKE) {
            this.endGame();
            return;
        } else {
            if (field[newStep[0]][newStep[1]] === FIELD.EMPTY) {
                let last: Array<number> = snake.pop();
                field[last[0]][last[1]] = FIELD.EMPTY;
            } else if (field[newStep[0]][newStep[1]] === FIELD.APPLE) {
                let app: Array<number> = this.generateApple(field);
                field[app[0]][app[1]] = FIELD.APPLE;
                apples++;
            }
            snake.unshift(newStep);
            field[newStep[0]][newStep[1]] = FIELD.SNAKE;
            this.setState({snake, field, apples});
        }
    }

    processStep = (cur: Array<number>): Array<number> => {
        let {step, sizeY, sizeX} = this.state;
        switch (step) {
            case (STEP.DOWN): return [(cur[0]+1) % sizeY, cur[1]];
            case (STEP.UP): return [(sizeY+cur[0]-1) % sizeY, cur[1]];
            case (STEP.LEFT): return [cur[0], (sizeX+cur[1]-1) % sizeX];
            case (STEP.RIGHT): return [cur[0], (cur[1]+1) % sizeX];
            default:
        }
    }

    generateApple(field: FIELD[][]): Array<number> {
        let {sizeX, sizeY} = this.state;
        let x:number = Math.floor(Math.random() * sizeX);
        let y: number = Math.floor(Math.random() * sizeY);
          if (field[x][y] == FIELD.EMPTY) {
            return [x,y]
         } else {
            this.generateApple(field);
        }  
    }

    renderField = () => {
        let {field} = this.state;
        return field.map((line, i) => {
            return <div key={i}> 
                {line.map((cell, j)=> {
                    let cls: string = 'cell'
                    if (cell === FIELD.APPLE) {
                        cls+= " apple";
                    } else if (cell === FIELD.SNAKE) {
                        cls+= " snake";
                    }
                    return <div className={cls} key={`${i}-${j}`}/>
                })}
            </div>
        }) 
    }

    render() {

        return (
            <div> 
                <header>
                    <label htmlFor="widthField">Ширина поля: </label>
                    <input 
                        disabled={this.state.isStart} 
                        value={this.state.sizeX} type="number" 
                        id="widthField"  placeholder="Ширина поля" 
                        onChange={(e) => this.onChangeParam('sizeX', e)}
                        onBlur={() => this.onBlurField('sizeX')}/>
                    <label htmlFor="heightField">Высота поля: </label>
                    <input 
                        disabled={this.state.isStart} 
                        value={this.state.sizeY} type="number"
                        id="heightField" placeholder="Высота поля" 
                        onChange={(e) => this.onChangeParam('sizeY', e)}
                        onBlur={() => this.onBlurField('sizeY')}/>
                    <label htmlFor="heightField">Скорость игры(в секундах): </label>
                    <input 
                        disabled={this.state.isStart} 
                        value={this.state.speed} type="number"
                        id="speed" placeholder="Скорость игры(в долях секунд)" 
                        onChange={(e) => this.onChangeParam('speed', e)}
                        onBlur={this.onBlurSpeed}/>
                    <button onClick={this.startGame} disabled={this.state.isStart}>Старт</button>
                    { this.state.isStart ? 
                        <span>
                            <button onClick={this.endGame}>Финиш</button>
                            <span id="count"> Счет: {this.state.apples} </span>
                        </span> 
                    : null}
                </header>

                {
                    this.state.hasError ? 
                        <div className="error-box"> {this.state.errorMessage} </div>
                    : null
                }

                <div id="field" onKeyDown={this.onKeyEnter} tabIndex={0}>
                    {this.renderField()}
                </div>

                {
                    this.state.isFinish ?
                    <div className="popup">
                        <div>
                            <p>Игра закончена со счетом {this.state.apples}</p>
                            <button onClick={() => this.setState({isFinish: false})}>ОК</button>
                        </div>
                    </div>
                : null}

            </div>
        )
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app')
)