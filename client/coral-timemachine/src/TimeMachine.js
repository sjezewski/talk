import React, {Component} from 'react';
import {connect} from 'react-redux';

export default class TimeMachine extends Component {

    constructor (props) {
        super(props);
        console.log("In time machine constructor");

        this.state = {
            commitIndex: 0, 
        };
    }

    componentDidMount () {
        console.log("Time machine mounted");

    }

    render () {
        return <div class="tardis">
        {
            rootItem
            ? <div className="thedoctor"></div>
            : <p> no time machine </p>
        }
        </div>;
    }
}



