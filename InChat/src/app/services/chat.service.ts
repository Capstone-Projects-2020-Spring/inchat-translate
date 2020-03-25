import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  chatDocRef;
  currentChat;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,) { }


  // Creating a Chat
  creatchats(chatName) {
    return new Promise((resolve) => { this.db.collection('chats').add({
        chatName,
        creator: this.afAuth.auth.currentUser.email,
        chatId: '',
      }).then((docRef) => { this.chatDocRef = docRef.id;
        docRef.collection('users').add({
          email: this.afAuth.auth.currentUser.email,
          displayNAme: this.afAuth.auth.currentUser.displayName
        }).then(() => { this.db.collection('chats').add({
            chatName,
            creator: this.afAuth.auth.currentUser.email
          }).then((docRef) => { this.db.collection('chats').doc(this.chatDocRef).update({
              chatId: docRef.id
            }).then(() => {
              resolve();
            });
          });
        });
      });
    });
  }

  getChats() {
    return new Promise((resolve) => {
      const createdChatObs = this.db.collection('chats', ref => ref.where('creator', '==', this.afAuth.auth.currentUser.email)).valueChanges();
      const UserofCollRef = this.db.collection('Userof').ref;
      const queryRef = UserofCollRef.where('email', '==', this.afAuth.auth.currentUser.email);
      queryRef.get().then((snapShot) => {
        if (!snapShot.empty) {
          const UserofObs = this.db.doc('Userof/' + snapShot.docs[0].id).collection('Users').valueChanges();
          const combinedObs = combineLatest(createdChatObs, UserofObs);
          resolve(combinedObs);
        } else {
          resolve(createdChatObs);
        }
      });
    });
  }
  
  //Add users to chat
   addUser(user) {
    return new Promise((resolve) => {
      const docRef = this.db.collection('chats').ref;
      const firstlevelquery = docRef.where('chatID', '==', this.currentChat.chatId);
      const secondquery = firstlevelquery.where('creator', '==', this.afAuth.auth.currentUser);
      secondquery.get().then((snapShot) => {
        if (!snapShot.empty) {
          this.db.doc('chats/' + snapShot.docs[0].id).collection('users').add(user).then(() => {
            const userOfDocRef = this.db.collection('userof').ref;
            const queryRef = userOfDocRef.where('email', '==', user.email);
            queryRef.get().then((snapShot) => {
              if (snapShot.empty) {
                this.db.collection('userof').add({
                  email: user.email
                }).then((docRef) => {
                  this.db.doc('userof/' + docRef.id).collection('chats').add(this.currentChat).then(() => {
                    resolve();
                  });
                });
              } else {
                this.db.doc('userof/' + snapShot.docs[0].id).collection('chats').add(this.currentChat).then(() => {
                  resolve();
                });
              }
            });
          });
        }
      });
    });
  }

  //get users from a chat
  getUserChats() {
    return new Promise((resolve) => {
      const docRef = this.db.collection('chats').ref;
      const queryRef = docRef.where('chatID', '==', this.currentChat.chatID).where('creator', '==', this.currentChat.creator);
      queryRef.get().then((snapShot) => {
        resolve(this.db.doc('chats/' + snapShot.docs[0].id).collection('users').valueChanges());
      });
    });
  }
}


