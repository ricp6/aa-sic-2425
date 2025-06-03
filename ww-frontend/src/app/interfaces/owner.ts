import { Track } from "./track";
import { User } from "./user";

export interface Owner extends User {
    tracks: Track[]
}
