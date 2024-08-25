### Node.js backend developer test

#### 1. Explain why `{ a: 1 } === { a: 1 }` is `false` in JavaScript

#### 2. Describe the runtime difference(s) between `for await (const a  of [p1, p2, p3]) { ... }` vs `[p1, p2, p3].forEach(async (p) {  await p })`

#### 3. Explain the difference between nodejs and V8

#### 4. Using typescript, what is the difference between an enum and an object?

#### 5. Write a typescript variable declaration for a variable `a` that  will guarantee that it is a property name or key of object `b`

#### 6. Describe some drawbacks or common pitfalls when using typescript in large applications

#### 7. Write a simple HTTP server in nodejs that:
1. Uses only the built in nodejs modules
2. Does not use the HTTP, HTTP/2 or HTTPS modules
3. Implements a GET /time route that returns the time in JSON
4. Implements a GET /data route that returns any data after 1 second
5. Uses correct HTTP headers
6. Holds up to any industry standard HTTP traffic generator tool

Not every HTTP feature is required, only as needed to implement the route. Describe any thought processes as required.

#### 8. Demonstrate a nodejs function that increases the major garbage collection

#### 9. Write a jest mock of a class having a function `fetchAllRecords`, that will return a resolved promise immediately to array `[1, 2, 3]`.

