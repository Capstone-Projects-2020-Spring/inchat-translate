import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { AuthService } from './auth.service';
import { Message } from '../models/message.model';
import { Time } from '@angular/common';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  chatId: string;
  constructor(
    private db: AngularFirestore,
    private afAuth: AuthService,
    private userService: UserService) { }

  getMessages(chatId: string) {
    return this.db.collection('messages', ref => ref.where('chatId', '==', chatId)).valueChanges();
  }

  // function used for sending messages. A user would send a message that would get stored on the database
  sendMessage(chatId: string = 'test-id', contents: string) {
    console.log(this.userService.getCurrentUser().userDB.language);
    let time: Date = new Date();
    let message: Message = {
      chatId: chatId,
      isTextBased: true,
      userId: this.afAuth.Auth.auth.currentUser.uid,
      uName: this.userService.getCurrentUser().userDB.uName,
      timeSent: time,
      originalLanguage: this.userService.getCurrentUser().userDB.language,
      originalMessage: contents,
    }; // message object to be stored in database
    console.log('In mService: ' + this.userService.getCurrentUser().userDB.language);

    this.db.collection('messages').add(message).then((docRef) => {
      console.log('Message logged with ID: ', docRef.id);
    }).catch((error) => {
      console.error('Error adding document: ', error);
    });
  }

  textToSpeech(text:string){
    const googleLink = 'link...' + text + 'more of the link'
    //do your function
  }
}


