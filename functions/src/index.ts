import * as functions from 'firebase-functions';
import createReducer from '../../src/reducers/index';
import { Action } from '../../src/constants';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const handleAction = functions.database.ref('/rooms/{room}/messageQueue')
  .onWrite(event => {
    const action = event.data.val() as Action
    console.log(action)
    return event.data!.ref!.parent!.child('game').once('value').then((snapshot) => {
      const state = snapshot.val()
      if (state) {
        const newState = createReducer(true)(state, action)
        return snapshot.ref.set(newState);
      }
    })
  })