# User and Tags REST API

## Description

This project provides [rest API](#endpoints) for user and tags.

## Usage

1. Clone project `git clone https://github.com/vladkondakov/outside-ocean-test-task`
2. `npm install`
3. `npm install -g db-migrate db-migrate-pg`
4. Setup .development.yaml file
5. Create tables with `npm run migration:up`
6. Run server `npm run start:dev`

## Tables

### User:

| field    |    type     |
| -------- | :---------: |
| uid      |    uuid     |
| email    | string(100) |
| password | string(100) |
| nickname | string(30)  |

### Tag:

| field     |      type      |
| --------- | :------------: |
| id        |      int       |
| creator   |      uuid      |
| name      |   string(40)   |
| sortOrder | int default(0) |

### Refresh token:

| field     |   type    |
| --------- | :-------: |
| hash      |  string   |
| createdAt | timestamp |
| user_uid  |   uuid    |

### User tags:

| field    | type |
| -------- | :--: |
| user_uid | uid  |
| tag_id   | int  |

## Endpoints

#### [Postman collection](https://github.com/vladkondakov/outside-ocean-test-task/blob/master/postman.collections.json)

#### **Swagger documentation** is available here: /api

| Methods | Endpoints                                     | Description                                                                                                                                   |
| :-----: | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
|  POST   | /api/auth/signin                              | Sign in. Returns access and refresh tokens tokens                                                                                             |
|  POST   | /api/auth/login                               | Login. Returns access and refresh tokens tokens                                                                                               |
|  POST   | /api/auth/logout                              | Logout user                                                                                                                                   |
|  POST   | /api/auth/refresh                             | Refresh token. Returns new access and refresh tokens                                                                                          |
|   GET   | /api/user                                     | Returns current user info                                                                                                                     |
|   PUT   | /api/user                                     | Update current user. Returns updated user                                                                                                     |
| DELETE  | /api/user                                     | Delete (cascade) and logout current user                                                                                                      |
|  POST   | /api/tag                                      | Create new tag. Returns created tag                                                                                                           |
|   GET   | /api/tag/:id                                  | Returns tag with info about the creator                                                                                                       |
|   GET   | /api/tag?sortByOrder&sortByName&page&pageSize | Returns the sorted and paginated list of tags with info about the creators and pagination meta                                                |
|   PUT   | /api/tag/:id                                  | Update tag if it was created by the current user. Returns tag with full info about the creator                                                |
| DELETE  | /api/tag/:id                                  | Delete (cascade) tag if it was created by current user                                                                                        |
|  POST   | /api/user/tag                                 | Adds tags to the current user. If one of provided tags does not exist then no tags will be added. Returns list with info about the added tags |
| DELETE  | /api/user/tag/:id                             | Delete tag from the current user                                                                                                              |
|   GET   | /api/user/tag/my                              | Returns list of the current user tags                                                                                                         |
|   PUT   | /api/subscription/:userID                     | Give user subscription or extend it                                                                                                           |

## Information

- **Email** (_string_)
  > Must be an email. Max length is 100 symbols. Unique.
- **Password** (_string_)
  > Must contain at least one uppercase letter, one lowercase letter and one number. Max length is 100 symbols.
- **Nickname** (_string_)
  > Must be unique. Max length is 30 symbols
- **creator** (_string_)
  > uid of the user who created the tag. Only this user can update and delete this tag.
- **name** (_string_).
  > Must be unique. Max length is 40 symbols. The name of the tag.
- **sortOrder** (_int_)
  > Default value is 0. This field is kinda represent of priority.

**All endpoints after _api/auth/logout_ require bearer token in authorization header**
