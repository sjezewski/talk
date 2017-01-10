import coralApi from '../helpers/response';
import {fromJS} from 'immutable';
import {UPDATE_CONFIG} from '../constants/config';

/**
* Action name constants
*/

export const ADD_ITEM = 'ADD_ITEM';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const APPEND_ITEM_ARRAY = 'APPEND_ITEM_ARRAY';
export const LOAD_COMMITS = 'LOAD_COMMITS';
export const UPDATE_COMMIT_INDEX = 'UPDATE_COMMIT_INDEX';

export const loadCommitsAction = (commits) => {
	return {
		type: LOAD_COMMITS,
		commits,
	}
}

export const updateCommitIndex = (index) => {
	return {
		type: UPDATE_COMMIT_INDEX,
		index,
	}
}

/**
 * Action creators
 */

 /*
 * Adds an item to the local store without posting it to the server
 * Useful for optimistic posting, etc.
 *
 * @params
 *  item - the item to be posted
 *
 */

export const addItem = (item, item_type) => {
  if (!item.id) {
    console.warn('addItem called without an item id.');
  }
  return {
    type: ADD_ITEM,
    item,
    item_type,
    id: item.id
  };
};

/*
* Updates an item in the local store without posting it to the server
* Useful for item-level toggles, etc.
*
* @params
*  id - the id of the item to be posted
*  property - the property to be updated
*  value - the value that the property should be set to
*  item_type - the type of the item being updated (users, comments, etc)
*
*/
export const updateItem = (id, property, value, item_type) => {
  return {
    type: UPDATE_ITEM,
    id,
    property,
    value,
    item_type
  };
};

/*
* Appends data to an array in an item in the local store without posting it to the server
* Useful for adding a recently posted reply to a comment, etc.
*
* @params
*  id - the id of the item to be posted
*  property - the property to be updated (should be an array)
*  value - the value that should be added to the array
*  add_to_front - boolean that defines whether value is added at the beginning (unshift) or end (push)
*  item_type - the type of the item being updated (users, comments, etc)
*
*/
export const appendItemArray = (id, property, value, add_to_front, item_type) => {
  return {
    type: APPEND_ITEM_ARRAY,
    id,
    property,
    value,
    add_to_front,
    item_type
  };
};


function getStreamHelper(dispatch, json) {
 console.log('GOT SOME JSON:', json);
 /* Add items to the store */
 Object.keys(json).forEach(type => {
   console.log('type:', type);
   if (type === 'actions') {
     json[type].forEach(action => {
       action.id = `${action.action_type}_${action.item_id}`;
       dispatch(addItem(action, 'actions'));
     });
   } else if (type === 'settings') {
     dispatch({type: UPDATE_CONFIG, config: fromJS(json[type])});
   } else {
     json[type].forEach(item => {
       dispatch(addItem(item, type));
     });
   }
 });

 const assetId = json.assets[0].id;

 /* Sort comments by date*/
 json.comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
 const rels = json.comments.reduce((h, item) => {

   /* Check for root and child comments. */
   if (
     item.asset_id === assetId &&
     !item.parent_id) {
     h.rootComments.push(item.id);
   } else if (
     item.asset_id === assetId
   ) {
     let children = h.childComments[item.parent_id] || [];
     h.childComments[item.parent_id] = children.concat(item.id);
   }
   return h;
 }, {rootComments: [], childComments: {}});

 dispatch(updateItem(assetId, 'comments', rels.rootComments, 'assets'));

 Object.keys(rels.childComments).forEach(key => {
   dispatch(updateItem(key, 'children', rels.childComments[key].reverse(), 'comments'));
 });

 /* Hydrate actions on comments */
 json.actions.forEach(action => {
   dispatch(updateItem(action.item_id, action.action_type, action.id, 'comments'));
 });

 return (json);
}

/*
* Get Items from Query
* Gets a set of items from a predefined query
*
* @params
*   Query - a predefiend query for retreiving items
*
* @returns
*   A promise resolving to a set of items
*
* @dispatches
*   A set of items to the item store
*/
export function getStream (assetUrl) {
  return (dispatch) => {
    return coralApi(`/stream?asset_url=${encodeURIComponent(assetUrl)}`)
      .then((json) => {
			return getStreamHelper(dispatch, json);
		});
  };
}

export function getStreamFromPFS (commitID) {
  console.log("in getStreamFromPFS()");

  // Here I think I want to remove all the existing comments?

  return (dispatch) => {
	let dummy_data = {"assets":[{"_id":"586ee6a032593a5a3ea45c5e","url":"http://localhost:3000/timemachine","created_at":"2017-01-06T00:36:48.468Z","updated_at":"2017-01-09T19:53:28.916Z","title":"Coral Talk","description":"A description of this article.","image":"https://coralproject.net/images/splash-md.jpg","author":"A. J. Ournalist","publication_date":"2016-11-16T16:46:06.000Z","modified_date":"2016-11-16T17:09:44.000Z","section":"The Section!","settings":{"moderation":"post"},"closedMessage":null,"closedAt":null,"scraped":"2017-01-06T00:36:50.162Z","type":"assets","id":"9ce1f45c-f943-4662-80d5-8968b46358fc"}],"comments":[{"updated_at":"2017-01-09T19:33:15.424Z","created_at":"2017-01-09T19:33:15.424Z","body":"sss1","asset_id":"9ce1f45c-f943-4662-80d5-8968b46358fc","author_id":"927d59de-07be-4946-ab66-04aecf5ff01f","__v":0,"status_history":[],"id":"50f08f5c-c710-4531-8685-9546ea9aa74a","status":null},{"updated_at":"2017-01-09T19:33:26.435Z","created_at":"2017-01-09T19:33:26.435Z","body":" ggggg","asset_id":"9ce1f45c-f943-4662-80d5-8968b46358fc","parent_id":"50f08f5c-c710-4531-8685-9546ea9aa74a","author_id":"927d59de-07be-4946-ab66-04aecf5ff01f","__v":0,"status_history":[],"id":"2c8d5d2a-ffdf-4608-8288-afed15b28e45","status":null},{"updated_at":"2017-01-09T19:33:30.845Z","created_at":"2017-01-09T19:33:30.845Z","body":"dfghdfgh","asset_id":"9ce1f45c-f943-4662-80d5-8968b46358fc","parent_id":"50f08f5c-c710-4531-8685-9546ea9aa74a","author_id":"927d59de-07be-4946-ab66-04aecf5ff01f","__v":0,"status_history":[],"id":"5f53bf6c-3487-4c6d-8d69-1adf60e05776","status":null}],"users":[{"updated_at":"2017-01-09T18:39:08.448Z","created_at":"2017-01-04T00:35:33.982Z","displayName":"sean","__v":0,"settings":{"bio":""},"status":"active","roles":["admin"],"profiles":[{"id":"sean@pachyderm.io","provider":"local"}],"id":"927d59de-07be-4946-ab66-04aecf5ff01f"}],"actions":[],"settings":{"updated_at":"2017-01-06T00:36:43.084Z","wordlist":{"suspect":[],"banned":[]},"created_at":"2017-01-04T00:34:09.279Z","__v":0,"_id":"586c430132593a5a3ea45c5c","charCountEnable":false,"charCount":5000,"closedMessage":"","closedTimeout":1209600,"infoBoxContent":"","infoBoxEnable":false,"moderation":"post","id":"1"}};
	return getStreamHelper(dispatch, dummy_data);
  };
}

function PFSListCommit() {
	return [
		{
			"id": "59827345tsdkjfghow3ty8",
			"started": "45 seconds ago",
		},
		{
			"id": "dklasfjgsldkjfhg98345j",
			"started": "25 seconds ago",
		},
		{
			"id": "skjdfnglkjndf9dfuglkjh",
			"started": "15 seconds ago",
		},
	]
}

export function loadCommits() {
  return (dispatch) => {
	let commits = PFSListCommit();
	dispatch(loadCommitsAction(commits));
	return commits
  };
}

/*
* Get Items Array
* Gets a set of items from an array of item ids
*
* @params
*   Query - a predefiend query for retreiving items
*
* @returns
*   A promise resolving to a set of items
*
* @dispatches
*   A set of items to the item store
*/

export function getItemsArray (ids) {
  return (dispatch) => {
    return coralApi(`/item/${ids}`)
      .then((json) => {
        for (let i = 0; i < json.items.length; i++) {
          dispatch(addItem(json.items[i]));
        }
        return json.items;
      });
  };
}

/*
* PutItem
* Puts an item
*
* @params
*   Item - the item to be put
*
* @returns
*   A promise resolving to an item is
*
* @dispatches
*   The newly put item to the item store
*/

export function postItem (item, type, id) {
  return (dispatch) => {
    if (id) {
      item.id = id;
    }
    return coralApi(`/${type}`, {method: 'POST', body: item})
      .then((json) => {
        dispatch(addItem({...item, id:json.id}, type));
        return json;
      });
  };
}

/*
* PostAction
* Posts an action to an item
*
* @params
*   id - the id of the item on which the action is taking place
*   action - the action object.
*       Must include an 'action_type' string.
*       May optionally include a `metadata` object with arbitrary action data.
*   user - the user performing the action
*   host - the coral host
*
* @returns
*   A promise resolving to null or an error
*
*/

export function postAction (item_id, item_type, action) {
  return () => {
    return coralApi(`/${item_type}/${item_id}/actions`, {method: 'POST', body: action});
  };
}

/*
* DeleteAction
* Deletes an action to an item
*
* @params
*   id - the id of the item on which the action is taking place
*   action - the name of the action
*   user - the user performing the action
*   host - the coral host
*
* @returns
*   A promise resolving to null or an error
*
*/

export function deleteAction (action_id) {
  return () => {
    return coralApi(`/actions/${action_id}`, {method: 'DELETE'});
  };
}
