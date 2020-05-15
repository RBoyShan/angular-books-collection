import { BookMark } from './bookmarks';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    bookmarks?: BookMark[];
    token?: string;
    roles?: Roles;
}

interface Roles {
    admin?: boolean;
    reader?: boolean;
}
