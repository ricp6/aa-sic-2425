import { User } from "./user";

export interface Notification {
    id: number,
    user: User,
    title: string,
    body: string,
    isRead: boolean,
    createdAt: Date;
}
