import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
//import getStreamFromPFS from '../../coral-framework';

import {
  itemActions,
  Notification,
  notificationActions,
  authActions
} from '../../coral-framework';
const {addItem, updateItem, postItem, getStream, getStreamFromPFS, postAction, deleteAction, appendItemArray} = itemActions;

export class TimeMachine extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    refreshComments: PropTypes.func.isRequired,
  }
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

  loadTimestamp = (e) => {
    console.log('Going to update the comments');
    console.log('Got value:', e);
	// I want to fire an action here, e.g.
	getStreamFromPFS("foo");
  }

  render () {
    console.log("in TM render()");
    return (
      <div className="tardis">
        <label htmlFor='timeline'> Timeline </label>
        <input type='range' name='timeline' onChange={this.loadTimestamp}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.items.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  refreshComments: (commitId) => dispatch(getStreamFromPFS(commitId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeMachine);
