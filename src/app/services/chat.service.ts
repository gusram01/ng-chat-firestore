import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Item {
  [key: string]: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Item>;
  chats: Item[];
  items: Observable<Item[]>;
  user: any = {};

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      if (!user) {
        this.user = {};
        return;
      }
      this.user = {
        name: user.displayName,
        id: user.uid,
      };
    });
  }

  login(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout(): void {
    this.auth.signOut();
  }

  loadData(): Observable<Item[]> {
    this.itemsCollection = this.afs.collection<Item>('chats', (ref) =>
      ref.orderBy('date', 'desc').limit(15)
    );

    return this.itemsCollection.valueChanges().pipe(
      map((items) => {
        this.chats = items;
        this.chats.sort((a: Item, b: Item) => +a.date - +b.date);
        return this.chats;
      })
    );
  }

  addItem(item: Item): Promise<DocumentReference> {
    return this.itemsCollection.add({
      ...item,
      ...this.user,
      date: new Date().getTime(),
    });
  }
}
