import React, {Component} from 'react';

export default class TimeMachine extends Component {

  constructor (props) {
    super(props);
    console.log('In time machine constructor');

    this.state = {
      commitIndex: 0, 
    };
  }

  componentDidMount () {
    console.log('Time machine mounted');
  }

  render () {
    return (
      <div className="tardis">
        <label htmlFor='timeline'> Timeline </label>
        <input type='range' name='timeline'/>
      </div>
    );
  }
}

