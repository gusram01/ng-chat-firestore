import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [],
})
export class ChatComponent implements OnInit {
  message = '';
  chats: any[];
  ele: HTMLDivElement;

  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.loadData().subscribe(() => {
      this.ele = document.getElementById('app-mensajes') as HTMLDivElement;
      if (this.chatService.user.id) {
        setTimeout(
          () =>
            this.ele.scrollTo({
              top: this.ele.scrollHeight + 400,
              left: 0,
              behavior: 'smooth',
            }),
          400
        );
      }
    });
  }

  send(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.chatService
      .addItem({ message: this.message })
      .then()
      .catch(console.error);
    form.reset();
  }
}
