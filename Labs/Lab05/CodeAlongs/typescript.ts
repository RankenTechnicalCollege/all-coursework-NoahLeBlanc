
//Typescript is all about types
/**
 *|Number
 *|string
 *|boolean
 *|null
 *|undefined
 *|void used for functions that don't return anything like console.log
 *|Object
 *|Array
 *|Tuples
 *|any AVOID THIS it's for when you're dumb and don't know what type you ought to have
 *|never Used for errors
 *|unknown
 */
 /*Syntax*/
 //let variableName: type = value
let greeting: string = "Hello Niah";
let userId: number = 334466;
let isLoggedIn: boolean = false;

let myNum = 334455;

let hero: any;
hero = "thor";
hero = 42;
hero = true;

function addTwo(num: number): number {
  return num + 2;
}

function loginUser(name: string, email: string, isPaid: boolean = false): void {
  console.log(`${name} logged in`);
}

const getUpper = (val: string): string => {
  return val.toUpperCase();
};

function getValue(myVal: number): boolean | string {
  if (myVal > 5) {
    return true;
  }
  return "200 OK";
}

const user: { name: string; email: string; isActive: boolean } = {
  name: "Niah",
  email: "h@h.com",
  isActive: true
};

function createUser(user: { name: string; email: string; isPaid?: boolean }): void {
  console.log(user.name);
}

function createCourse(): { name: string; price: number } {
  return { name: "reactjs", price: 399 };
}

type User = {
  readonly _id: string;
  name: string;
  email: string;
  isActive: boolean;
  creditCardDetails?: number;
};

const niah: User = {
  _id: "1234",
  name: "niah",
  email: "h@h.com",
  isActive: false
};

type CardNumber = {
  cardnumber: string;
};

type CardDate = {
  cardDate: string;
};

type CardDetails = CardNumber & CardDate & {
  cvv: number;
};

const superHeros: string[] = [];
superHeros.push("spiderman");

const heroPower: number[] = [];
heroPower.push(2);

const heroNumbers: Array<number> = [];

type UserType = {
  name: string;
  isActive: boolean;
};

const allUsers: UserType[] = [];
allUsers.push({ name: "niah", isActive: true });

const MLModel: number[][] = [
  [255, 255, 255],
  [192, 192, 192]
];

let score: number | string = 33;
score = 44;
score = "55";

type AdminUser = {
  username: string;
  id: number;
};

type RegularUser = {
  name: string;
  id: number;
};

let niahUser: RegularUser | AdminUser = { name: "niah", id: 334 };
niahUser = { username: "hc", id: 334 };

function getDbId(id: number | string): void {
  if (typeof id === "string") {
    console.log(id.toLowerCase());
  } else {
    console.log(id + 2);
  }
}

const data: (string | number)[] = [1, 2, "3"];

let seatAllotment: "aisle" | "middle" | "window";
seatAllotment = "aisle";

let tUser: [string, number, boolean];
tUser = ["hc", 131, true];

type User2 = [number, string];
const newUser: User2 = [112, "example@google.com"];

enum SeatChoice {
  AISLE,
  MIDDLE,
  WINDOW,
  FOURTH
}

const hcSeat = SeatChoice.AISLE;

enum SeatChoice2 {
  AISLE = 10,
  MIDDLE = 22,
  WINDOW = 44
}

enum SeatChoice3 {
  AISLE = "aisle",
  MIDDLE = "middle",
  WINDOW = "window"
}

const enum Status {
  PENDING,
  COMPLETED,
  FAILED
}

interface UserInterface {
  readonly dbId: number;
  email: string;
  userId: number;
  googleId?: string;
  startTrial(): string;
  getCoupon(couponname: string): number;
}

const niahInterface: UserInterface = {
  dbId: 22,
  email: "h@h.com",
  userId: 2211,
  startTrial: () => {
    return "trial started";
  },
  getCoupon: (name: string) => {
    return 10;
  }
};

interface UserInterface {
  githubToken: string;
}

interface Admin extends UserInterface {
  role: "admin" | "ta" | "learner";
}

class UserClass {
  public email: string;
  public name: string;
  private readonly city: string = "Jaipur";
  
  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}

class UserClass2 {
  constructor(
    public email: string,
    public name: string,
    private userId: string
  ) {}
}

class UserWithGettersSetters {
  private _courseCount = 1;
  
  constructor(
    public email: string,
    public name: string
  ) {}
  
  get courseCount(): number {
    return this._courseCount;
  }
  
  set courseCount(courseNum: number) {
    if (courseNum <= 1) {
      throw new Error("Course count should be more than 1");
    }
    this._courseCount = courseNum;
  }
  
  private deleteToken(): void {
    console.log("Token deleted");
  }
  
  getAppleEmail(): string {
    return `apple${this.email}`;
  }
}

class SubUser extends UserClass {
  isFamily: boolean = true;
  
  changeCourseCount(): void {
  }
}

class UserProtected {
  protected _courseCount = 1;
  
  constructor(
    public email: string,
    public name: string
  ) {}
}

class SubUserProtected extends UserProtected {
  changeCourseCount(): void {
    this._courseCount = 4;
  }
}

abstract class TakePhoto {
  constructor(
    public cameraMode: string,
    public filter: string
  ) {}
  
  abstract getSepia(): void;
  
  getReelTime(): number {
    return 8;
  }
}

class Instagram extends TakePhoto {
  constructor(
    public cameraMode: string,
    public filter: string,
    public burst: number
  ) {
    super(cameraMode, filter);
  }
  
  getSepia(): void {
    console.log("Sepia");
  }
}

const hcInsta = new Instagram("test", "test", 3);

function identityOne<Type>(val: Type): Type {
  return val;
}

function identityTwo<T>(val: T): T {
  return val;
}

identityTwo(3);
identityTwo("3");
identityTwo(true);

interface Bottle {
  brand: string;
  type: number;
}

identityTwo<Bottle>({ brand: "milton", type: 1 });

function getSearchProducts<T>(products: T[]): T {
  const myIndex = 3;
  return products[myIndex];
}

const getMoreSearchProducts = <T,>(products: T[]): T => {
  const myIndex = 4;
  return products[myIndex];
};

interface Database {
  connection: string;
  username: string;
  password: string;
}

function anotherFunction<T extends Database>(val: T): T {
  return val;
}

class Sellable<T> {
  public cart: T[] = [];
  
  addToCart(product: T): void {
    this.cart.push(product);
  }
}

function detectType(val: number | string): number | string {
  if (typeof val === "string") {
    return val.toLowerCase();
  }
  return val + 3;
}

function provideId(id: string | null): void {
  if (!id) {
    console.log("Please provide ID");
    return;
  }
  console.log(id.toLowerCase());
}

interface UserNarrow {
  name: string;
  email: string;
}

interface AdminNarrow {
  name: string;
  email: string;
  isAdmin: boolean;
}

function isAdminAccount(account: UserNarrow | AdminNarrow): boolean {
  if ("isAdmin" in account) {
    return account.isAdmin;
  }
  return false;
}

function logValue(x: Date | string): void {
  if (x instanceof Date) {
    console.log(x.toUTCString());
  } else {
    console.log(x.toUpperCase());
  }
}

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function getFood(pet: Fish | Bird): string {
  if (isFish(pet)) {
    return "fish food";
  }
  return "bird food";
}

interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  side: number;
}

interface Rectangle {
  kind: "rectangle";
  length: number;
  width: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side * shape.side;
    case "rectangle":
      return shape.length * shape.width;
    default:
      const _defaultforShape: never = shape;
      return _defaultforShape;
  }
}

interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
  return { ...todo, ...fieldsToUpdate };
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
  description: "Clean up database"
};

type TodoPreview = Pick<Todo, "title">;

type TodoInfo = Omit<Todo, "description">;

type PageInfo = {
  title: string;
};

type Page = "home" | "about" | "contact";

const nav: Record<Page, PageInfo> = {
  home: { title: "Home" },
  about: { title: "About" },
  contact: { title: "Contact" }
};

console.log("TypeScript Complete Learning Guide - All Major Topics Covered!");