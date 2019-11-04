import { Joke } from '../joke/joke';

export class User {
    id: number;
    username: string;
    password: string;
    favourites: Set<Joke>;
    role: string;
}
