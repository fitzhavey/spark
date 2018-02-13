var firebase = require('firebase');
// alternatively to line above you can paste the below line into the html file
//<script src="https://www.gstatic.com/firebasejs/4.9.1/firebase.js"></script>


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
        return this.db.ref(path).once('value').then(snap => {
            return snap.val();
        });
    }

    /**
     * Write object at location in firebase database
     * @param path location at which to write the data
     * @param data object to be uploaded
     * @returns a Promise of the uploaded object that will be resolved when upload completes
     */
    write(path, data) {
        return Promise.all([
            this.db.ref(path).set(data),
            data
        ])
            .then(data => {
                return data[1];
            });
    }

    /**
     * Push object to location under new unique key
     * @param path location at which to write the data
     * @param data object to be uploaded
     * @returns a Promise of the uploaded object that will be resolved when upload completes
     */
    push(path, data) {
        let key = this.getNewKey();
        return this.write(path + key, data).then(data => {
            return data;
        });
    }

    /**
     * Delete object at location in firebase database
     * @param path location at which to delete the data
     * @returns a Promise of the object deleted that will be resolved when the delete is successful
     */
    delete(path) {
        //#todo return whether success or not
        return Promise.all([
            this.read(path).then(obj => {
                this.write(path, {});
                return obj;
            })
        ])
        .then(data => {
            return data[0];
        });
    }

    /**
     * Get children of object at loction as an array
     * @param path location which should have children read
     * @returns promise of array of objects
     */
    readAsArray(path) {
        return this.read(path).then(data => {
            return Object.values(data);

        });
    }

    /**
     * Set a callback function to run when data updates at location
     * @param path location of data to listen to
     * @param callback function to be run when data changes
     * @returns a Promise of true is subscription is successful
     */
    subscribe(path, callback) {
        return Promise.all([
            this.db.ref(path).on('value', snap => {
                callback(snap.val());
            }),
            true
        ])
        .then(data => {
            return data[1];
        })
    }

    /**
     * Subscribes to an array of children of object at location
     * @param path parent of children to listen to
     * @param callback function to be run when data changes
     * @returns a Promise of true is subscription is successful
     */
    subscribeToArray(path, callback) {
        return Promise.all([
            this.db.ref(path).on('value', snap => {
                callback(Object.values(snap.val()));
            }),
            true
        ])
        .then(data => {
            return data[1];
        })
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