import { Component } from 'react';
import * as React from 'react';
import { Special } from './Special';
import { SpecialModel } from '../models/SpecialModel';

interface IState {
    specials: Map<string, SpecialModel[]>
}

export class Specials extends Component<{}, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            specials: new Map<string, SpecialModel[]>()
        }
    }

    componentDidMount() {
        this.populate();
    }
    
    render() {
        let count = 0;
        return this.state.specials.size === 0 ? ''
            : (<div>
                <h2>Specials</h2>
                {Array.from(this.state.specials.keys()).map(day =>
                    <div key={'special-' + day}>
                        <h4>{day}</h4>
                        {this.state.specials.get(day)?.map(special =>
                            <Special special={special} key={'spec-' + day + '-' + (count++)} />
                        )}
                    </div>
                )}
            </div>)
    }

    async populate() {
        const response = await fetch('api/specials');
        const data = await response.json();
        this.setState({ specials: new Map<string, SpecialModel[]>(Object.entries(data)) });
    }
}
