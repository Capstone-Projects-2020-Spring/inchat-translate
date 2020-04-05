import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { UserService } from '../services/user.service';
import { FriendsService } from '../services/friends.service';
import { SettingsService } from '../services/settings.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  constructor(
    public chat: ChatService,
    public friendsService: FriendsService,
    private afAuth: AuthService,
    public messageService: MessageService,
    public userService: UserService) { }

  messages;
  translatedMessages: string[] = [];
  ngOnInit() {
    this.afAuth.Auth.auth.onAuthStateChanged(() => {
      if (this.afAuth.Auth.auth.currentUser === null) {
        console.log('No chats to display');
      } else {
        console.log(this.afAuth.Auth.auth.currentUser.uid);
        this.messageService.getMessages('test-id').subscribe(response => {
            response.sort(this.messageSorter);
            this.messages = response;
        });
      }

    });
  }

  messageSorter(a: Message, b: Message) {
    if (a.timeSent === b.timeSent) {
      return 0;
    } else {
      return a.timeSent < b.timeSent ? -1 : 1;
    }
  }

}

