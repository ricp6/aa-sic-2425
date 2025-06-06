import { User } from "./user";

export interface Notification {
    id: number,
    title: string,
    body: string,
    isRead: boolean,
    createdAt: string;
}
