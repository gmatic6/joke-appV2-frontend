import { User } from '../user/user';

export class Joke {

    id: number;
    jokeText: string;
    likes: number;
    dislikes: number;
    user: User;
    favouritedBy: Set<User>;
}
