import firebase from 'firebase';

const firebaseConfig = {
    // Your Credentials
    apiKey: "AIzaSyCcFDbaSCznGSQn57LW9KQhZxFzy0jt7ys",
    authDomain: "movinghousefunction.firebaseapp.com",
    databaseURL: "https://movinghousefunction-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "movinghousefunction",
    storageBucket: "movinghousefunction.appspot.com",
    messagingSenderId: "905522672574",
    appId: "1:905522672574:web:14c12bf850a280ad117fef",
    measurementId: "G-YPFQDYL6FR"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

export default database;