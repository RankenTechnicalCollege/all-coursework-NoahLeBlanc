//|====================================================================================================|
//|--------------------------------------------[-IMPORTS-]---------------------------------------------|
//|====================================================================================================|
import { ObjectId } from 'mongodb';

//|====================================================================================================|
//|--------------------------------------------[-TYPES-]-----------------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-------------------[-USER-TYPE-]------------------|
//|==================================================|
export type User = {
  id?: ObjectId;
  email: string;
  password: string;
  givenName: string;
  familyName: string;
  role:
    | 'developer'
    | 'quality analyst'
    | 'business analyst'
    | 'product manager'
    | 'technical manager';
};
//|==================================================|
//|-------------------[-BUG-TYPE-]-------------------|
//|==================================================|
export type Bug = {
  id?: ObjectId;
  title: string;
  description: string;
  stepsToReproduce: string;
  classification?: 'critical' | 'major' | 'minor' | 'trivial';
  assignedToUserId?: ObjectId;
  closed?: boolean;
  createdBy?: ObjectId;
  creationDate?: Date;
};

//|==================================================|
//|-------------------[-COMMENT-TYPE-]---------------|
//|==================================================|
export type Comment = {
  id?: ObjectId;
  author: string; // Could also be a reference to User id: ObjectId
  commentText: string;
  bugId?: ObjectId;
  createdAt?: Date;
};
//|==================================================|
//|-------------------[-TEST-TYPE-]------------------|
//|==================================================|
export type Test = {
  id?: ObjectId;
  description: string;
  preconditions: string;
  steps: string;
  expectedResult: string;
  actualResult: string;
};

//|==================================================|
//|-------------------[-COLLECTIONS-TYPE-]-----------|
//|==================================================|
export type Collections = {
  users: User;
  bugs: Bug;
  comments: Comment;
  tests: Test;
};
