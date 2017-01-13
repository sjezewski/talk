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
    updateCommitIndex: PropTypes.func.isRequired,
  }

  gbcConnection = null;

  constructor (props) {
    super(props);
    console.log('In time machine constructor');
    let GBC = require("grpc-bus-websocket-client");
    let serviceConfig = {pfs: {API: 'localhost:30650'}};
    this.gbcConnection = new GBC("ws://localhost:8081/", 'pfs.proto.json', serviceConfig)
     .connect()
  }

  componentDidMount () {
    console.log('Time machine mounted');
	this.props.loadCommits(this.gbcConnection);
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
	this.props.refreshComments(this.gbcConnection, this.props.items.commitInfos[value]);
	return false;
  }

  render () {
    console.log("in TM render()");
	const commitIndex = this.props.items.commitIndex;
	const currentCommitInfo = this.props.items.commitInfos[commitIndex];
    let rawTimestamp = currentCommitInfo ? currentCommitInfo.finished : null;
    let d = new Date(0);
    if (rawTimestamp !== null) {
        d.setUTCSeconds(rawTimestamp.seconds.low);
    }
    const timestamp = rawTimestamp ? (d.toLocaleDateString() + " " + d.toLocaleTimeString()) : "?";

    console.log("timestamp:", timestamp);
    const commitID = currentCommitInfo ? currentCommitInfo.commit.id : "?";
    const comments = "blah"; //this.props.items.comments;
    const actions  = "blah"; //this.props.items.actions;
    const users    = "blah"; //this.props.items.users;
    return (
      <div className="tardis">
	    <div className="control">
          <label htmlFor='timeline'> Timeline </label>
          <input
			id='timemachineSlider'
			type='range'
			name='timeline'
			value={commitIndex}
			min='0'
			max={this.props.items.commitInfos.length - 1}
			onChange={this.loadTimestamp}/>
	    </div>
		<div className="metadata">
			<div className="stateInfo">
			  <div> Time: {timestamp} </div>
			  <div> Commit ID: {commitID} </div>
			</div>
            <div className="comments">
            Comments:
            { comments } 
            </div>
            <div className="users">
            Users:
            { users }
            </div>
            <div className="actions">
            Actions:
            { actions }
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
  refreshComments: (gbcConnection, commitId) => dispatch(getStreamFromPFS(gbcConnection, commitId)),
  loadCommits: (gbcConnection) => dispatch(loadCommits(gbcConnection)),
  updateCommitIndex: (index) => dispatch(updateCommitIndex(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeMachine);
