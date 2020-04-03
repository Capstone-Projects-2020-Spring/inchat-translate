import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class FriendsService {

  constructor(private http: HttpClient, private db: AngularFirestore, private afAuth: AuthService) { }
  dbRef = this.db.collection('users');
  currentUser = this.afAuth.Auth.auth.currentUser;

  /* unneeded
  async listFriends(uID: string) {
    // not reactive, but works, wont update with added friends
    let friends = await this.dbRef.doc(uID).ref.get().then(doc => {
      console.log(doc.data());
      return doc.data().userDB.friends;
    });

    // Dynamic as per "valueChanges()," automatically updates when friends are added
    // doesn't work though
    var friends = await this.dbRef.doc(uID).valueChanges().subscribe(doc => {
      const user = doc as User;
      console.log(user.uName);
      console.log(user);
      return userDB.friends;
      //return doc.data().userDB.friends;
      });
    return friends;
  }
  */

  deleteFriend(uID: string, fID: string) {
    this.dbRef.doc(uID).update(
      { 'userDB.friends': firebase.firestore.FieldValue.arrayRemove(fID)}).then(() =>
        console.log(uID + ' removed friend ' + fID));
    alert(fID + ' removed');
    return true;
  }

  addFriend(uID: string, fID: string) {
    this.dbRef.doc(uID).update(
      { 'userDB.friends': firebase.firestore.FieldValue.arrayUnion(fID)}).then(() =>
        console.log(uID + ' added friend ' + fID));
    alert(fID + ' added');
    return true;
  }

  /*under development
  addFriendEmail(uID:string, friendEmail:string){
    var friendID = this.db.collection('users', ref => ref.where('email', '==', friendEmail)).valueChanges(
      {idField: 'eventId'}
    );

    this.addFriend(uID, friendID);
    return true;
  }
  */

  
}
