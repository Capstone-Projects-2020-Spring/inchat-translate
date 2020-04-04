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



  deleteFriend(uID: string, friendEmail: string) {
    this.dbRef.doc(uID).update(
      { 'userDB.friends': firebase.firestore.FieldValue.arrayRemove(friendEmail)}).then(() =>
        console.log(uID + ' removed friend ' + friendEmail));
    alert(friendEmail + ' removed');
    return true;
  }

  addFriend(uID: string, friendEmail: string) {
    return this.db.collection('users', ref => ref.where('email', '==', friendEmail)).valueChanges();
  }

}
