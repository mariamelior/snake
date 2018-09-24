import * as React from 'react';
import * as ReactDOM from "react-dom";

enum STEP {
    DOWN, LEFT, RIGHT, UP
}

interface IState {
    sizeX: number;
    sizeY: number;
    snake: number[][];
    step: STEP;   
}

export class App extends React.Component<any, IState> {
    constructor(props) {
        super(props)
    }

    state: IState = {
        sizeX: 10,
        sizeY: 10,
        snake: [[0,0]],
        step: STEP.DOWN
    }

    endGame = () => {
        alert('Sorry')
    }

    process = (cur: Array<number>) => {
        let {step, sizeY, sizeX} = this.state;
        if (step == STEP.DOWN) {
            if ((cur[1]+1) > sizeY) {
                this.endGame();
            } else return [cur[0], cur[1]+1]
        }
        if (step == STEP.UP) {
            if ((cur[1]-1) < 0) {
                this.endGame();
            } else return [cur[0], cur[1]-1]
        }
        if (step == STEP.LEFT) {
            if ((cur[0]-1) < 0) {
                this.endGame();
            } else return [cur[0]-1, cur[1]]
        }
        if (step == STEP.RIGHT) {
            if ((cur[0]+1) > sizeX) {
                this.endGame();
            } else return [cur[0]+1, cur[1]]
        }
    }

    doStep = () => {
        let {snake} = this.state;
        let newStep: Array<number> = this.process(snake[0]);
        if (snake.find(e => e[0] === newStep[0] && e[1] === newStep[1])) {
            this.endGame();
        } else {
            if (newStep) { //TODO no apple
                snake.pop();
            }
            snake.unshift(newStep);
            this.setState({snake});
        }       
    }

    onkeyEnter = (e) => {
        let step;
        switch (e.keyCode) {
            case 37: step = STEP.LEFT; break;
            case 38: step = STEP.UP; break; 
            case 39: step = STEP.RIGHT; break; 
            case 40: step = STEP.DOWN; break; 
            default: 
        }
        this.setState({step})
    }
  
    renderField = () => {
        let {sizeX, sizeY} = this.state;
        for (let i=0; i<sizeX; i++) {
            for (let i=0; i<sizeY; i++) {
                return <span className="cell"/>
            }
        }
    }
    render() {

        return (
            <div id="field">
                {this.renderField()}
            </div>
        )
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app')
)