
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class AddPostInput {
    authorId: string;
    content?: Nullable<string>;
    title: string;
}

export class EditPostInput {
    authorId?: Nullable<string>;
    content?: Nullable<string>;
    title?: Nullable<string>;
}

export abstract class IMutation {
    abstract addPost(post?: Nullable<AddPostInput>): Post | Promise<Post>;

    abstract deletePost(postId: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract increaseViewCount(postId: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract updatePost(editPost: EditPostInput, postId: string): Nullable<Post> | Promise<Nullable<Post>>;
}

export class Post {
    author?: Nullable<User>;
    content?: Nullable<string>;
    id: string;
    published: boolean;
    title: string;
    viewCount: number;
}

export class Profile {
    bio: string;
    id: string;
    user?: Nullable<User>;
}

export abstract class IQuery {
    abstract post(id: string): Nullable<Post> | Promise<Nullable<Post>>;

    abstract posts(): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;

    abstract profile(id: string): Nullable<Profile> | Promise<Nullable<Profile>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;

    abstract users(): Nullable<Nullable<User>[]> | Promise<Nullable<Nullable<User>[]>>;
}

export class User {
    email: string;
    id: string;
    name: string;
    posts?: Nullable<Nullable<Post>[]>;
    profile?: Nullable<Profile>;
    role: string;
}

type Nullable<T> = T | null;
