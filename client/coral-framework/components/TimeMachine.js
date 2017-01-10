import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
//import getStreamFromPFS from '../../coral-framework';

import {
  itemActions,
  Notification,
  notificationActions,
  authActions
} from '../../coral-framework';
const {addItem, updateItem, postItem, getStream, getStreamFromPFS, loadCommits, updateCommitIndex, postAction, deleteAction, appendItemArray} = itemActions;

export class TimeMachine extends Component {

  static propTypes = {
    items: PropTypes.object.isRequired,
    refreshComments: PropTypes.func.isRequired,
	loadCommits: PropTypes.func.isRequired,
  }

  constructor (props) {
    super(props);
    console.log('In time machine constructor');

  }

  componentDidMount () {
    console.log('Time machine mounted');
	this.props.loadCommits();
  }

  loadTimestamp = (e) => {
    console.log('Going to update the comments');
    console.log('Got value:', e);
	console.log('this:', this);
//	let value = e["[[Target]]"].target().value; // something like this
	let value = parseInt(document.getElementById("timemachineSlider").value);
	console.log("Value of slider:", value);
	this.props.updateCommitIndex(value);
	console.log("Updated commit index");
	this.props.refreshComments(this.props.items.commits[value]);
  }

  render () {
    console.log("in TM render()");
    return (
      <div className="tardis">
	    <div className="control">
          <label htmlFor='timeline'> Timeline </label>
          <input
			id='timemachineSlider'
			type='range'
			name='timeline'
			value='{this.state.commitIndex}'
			min='0'
			max={this.props.items.commits.length - 1}
			onChange={(e) => this.loadTimestamp(e)}/>
	    </div>
		<div className="metadata">
			<div className="stateInfo">
			  <span> Time: {} </span>
			  <span> Commit ID: {} </span>
			</div>
		</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.items.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  refreshComments: (commitId) => dispatch(getStreamFromPFS(commitId)),
  loadCommits: () => dispatch(loadCommits()),
  updateCommitIndex: (index) => dispatch(updateCommitIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeMachine);
