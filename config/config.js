import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC10IDHLpR5DWbvnkk_1R3JaU1p6JiJ4bk",
    authDomain: "looking-glass-exp1.firebaseapp.com",
    databaseURL: "https://looking-glass-exp1.firebaseio.com",
    projectId: "looking-glass-exp1",
    storageBucket: "looking-glass-exp1.appspot.com",
    messagingSenderId: "937553137237"
};

firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
