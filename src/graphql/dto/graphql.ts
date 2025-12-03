
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class CreateUserInput {
    email: string;
    name?: Nullable<string>;
    role?: Nullable<Role>;
}

export class UpdateUserInput {
    id: number;
}

export abstract class IMutation {
    abstract createUserInput(createUserInput: CreateUserInput): UserOutput | Promise<UserOutput>;
}

export class Post {
    authorId: number;
    content?: Nullable<string>;
    published: boolean;
    title: string;
    viewCount: number;
}

export abstract class IQuery {
    abstract findAllUser(): Nullable<Nullable<UserOutput>[]> | Promise<Nullable<Nullable<UserOutput>[]>>;

    abstract findEmailWithPost(email: string): Nullable<UserOutput> | Promise<Nullable<UserOutput>>;

    abstract findUserWithLeastPost(): Nullable<Nullable<UserWithPosts>[]> | Promise<Nullable<Nullable<UserWithPosts>[]>>;
}

export class UserOutput {
    email: string;
    name?: Nullable<string>;
    role?: Nullable<Role>;
}

export class UserWithPosts {
    email: string;
    name?: Nullable<string>;
    posts?: Nullable<Nullable<Post>[]>;
    role?: Nullable<Role>;
}

type Nullable<T> = T | null;
