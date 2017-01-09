
C) create a new view for the time machine

D) hook in the slider to request the data at that commit


E) update the pipeline to output the data in that format


A) get the node proxy working

F) also once the slider updates, request the aggregate metrics from pachyderm (from a different repo) and display those as well

B) get the comment save saving to pachyderm


-----

Questions

- how does the view map to a query?
- the iframe creates a new CommentStream object ... which seems to load its props
- but ... how do you specify a subset?


getStream() in /coral-framework/actions/items.js

defines how to construct the UI from JSON, which is supplied as a param

so ... I'll need to augment that to handle a new query value that instead gets the JSON from pachyderm


or perhaps the `coralApi()` function in helpers/response.js

well ... I could do it there ... I need to retrieve from PFS not actually do the 'fetch'

I think the thing that makes the most sense is to do `getStreamFromPFS()` in items.js, and re-use the code in commong w `GetStream()`


---


OK ... So I have the `/timemachine` view loading the `CommentStream` object which in turn loads the `TimeMachine` object

The `TimeMachine` object has a slider and an event handler. Next I need to:

- have the event handler dispatch? a `loadCommentsAtCommit` action
- then I need to write a new reducer on the `CommentStream` object so that the comments get updated properly



