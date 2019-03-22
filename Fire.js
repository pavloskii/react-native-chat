import firebase from "firebase";

class Fire {
  constructor() {
    this.init();

    this.observeAuth();
  }

  observeAuth = () => {
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  };

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  get ref() {
    return firebase.database().ref("messages");
  }

  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)));

  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  off() {
    this.ref.off();
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp
      };
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  init = () =>
    firebase.initializeApp({
      apiKey: "AIzaSyBq_UV45-TRbeP8wfYlK9AIBkjxdaEcZMs",
      authDomain: "boxchain-chat.firebaseapp.com",
      databaseURL: "https://boxchain-chat.firebaseio.com",
      projectId: "boxchain-chat",
      storageBucket: "boxchain-chat.appspot.com",
      messagingSenderId: "545326432640"
    });
}

Fire.shared = new Fire();
export default Fire;
