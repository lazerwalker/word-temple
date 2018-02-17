import * as functions from 'firebase-functions';
import createReducer from '../../src/reducers/index';
import { Action } from '../../src/constants';

import * as admin from 'firebase-admin'
import { create } from 'domain';
admin.initializeApp(functions.config().firebase);

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export const handleAction = functions.database.ref('/rooms/{room}/messageQueue')
  .onWrite(event => {
    const actionObj = event.data.val() as {string: Action}
    const actions = Object.keys(actionObj).map(k => actionObj[k])

    return event.data.ref.parent.child('game').once('value').then((snapshot) => {
      const state = snapshot.val()
      if (state) {
        const reducer = createReducer(true)
        let newState = state
        actions.forEach((a) => newState = reducer(newState, a))
        return snapshot.ref.set(newState);
      }
    })
  })