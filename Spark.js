var firebase = require('firebase');


/**
 * Class to interact with the firebase database
 * 
 * author: Michael Fitzhavey
 * 
 * ReadMe:
 *  - Requires 'npm init' and 'npm install --save firebase'
 *  - Alternatively firebase can be included via cdn or included file and inline also.
 *  - Setup in firebaseConfig object below
 * 
 * Todo:
 *  - consider setting up SparkStorage as endpoint to use google cloud storage.
 */

var firebaseConfig = {
    apiKey: "AIzaSyCBSeq7wRNRQQYZnxZGYt35P-6-yHvwXIg",
    authDomain: "asdsa-48c2f.firebaseapp.com",
    databaseURL: "https://asdsa-48c2f.firebaseio.com",
    projectId: "asdsa-48c2f",
    storageBucket: "asdsa-48c2f.appspot.com",
    messagingSenderId: "92593551317"
}

class Spark {

    constructor() {
        let app = firebase.initializeApp(firebaseConfig);
        this.db = app.database();
    }

    /**
     * Get object at location in firebase database
     * @param path location of object to get
     * @returns promise of object
     */
    read(path) {
        //#todo handle invalid readqwq
        return this.db.ref(path).once('value').then(snap => {
            return snap.val();
        });
    }

    /**
     * Write object at location in firebase database
     * @param path location at which to write the data
     * @param data object to be uploaded
     */
    write(path, data) {      
        //#todo return whether success or not
        this.db.ref(path).set(data);
    }

    /**
     * Delete object at location in firebase database
     * @param path location at which to delete the data
     */
    delete(path){      
        //#todo return whether success or not
        this.write(path, {});
    }

    /**
     * Get children of object at loction as an array
     * @param path location which should have children read
     * @returns promise of array of objects
     */
    readAsArray(path) {     
        //#todo handle checking for nonexistent node
        return this.read(path).then(data => {
            return Object.values(data);
        });
    }

    /**
     * Set a callback function to run when data updates at location
     * @param path location of data to listen to
     * @param callback function to be run when data changes
     */
    subscribe(path, callback){    
        this.db.ref(path).on('value', snap => {
            callback(snap.val());
        });
    }

    /**
     * Subscribes to an array of children of object at location
     * @param path parent of children to listen to
     * @param callback function to be run when data changes
     */
    subscribeToArray(path, callback){    
        this.db.ref(path).on('value', snap => {
            callback(Object.values(snap.val()));
        });
    }

    /**
     * Generates a new unique GUID with firebase
     * @returns new GUID as string
     */
    getNewKey() {
        let key = this.db.ref('/').push('-').key;
        this.db.ref(key).remove();
        return key;
    }

    /**
     * Gets the firebase reference at a specific location
     * @param path location at which to get the reference
     * @returns firebase reference as Object
     */
    getRef(path) {
        return this.db.ref(path);
    }

}

module.exports = new Spark();