export interface Message {
  author: string;
  content: string;
  created: string;
}

export type NewMessage = Message['content'];
