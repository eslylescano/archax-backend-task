# Node.js Archax Backend Developer Test

This document contains answers and code solutions for a Node.js Archax backend developer test.

## 1. Why `{ a: 1 } === { a: 1 }` is False in JavaScript

In JavaScript, objects are compared by reference, not by value. Even though two objects may have identical properties and values, they are not considered equal unless they reference the same memory location.

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 1 };

console.log(obj1 === obj2); // false
```

## 2. Runtime Difference: `for await` vs. `forEach` with `async/await`

- **`for await ... of` loop**: Handles promises sequentially, waiting for each to resolve before continuing.
- **`forEach` with `async/await`**: Triggers all async operations concurrently but does not properly handle awaiting each operation in sequence.

```javascript
// Sequential execution
for await (const p of [p1, p2, p3]) {
    await p;
}

// Concurrent execution
[p1, p2, p3].forEach(async (p) => {
    await p;
});
```

## 3. Difference Between Node.js and V8

- **Node.js**: A runtime environment that allows JavaScript to run server-side, providing additional APIs and libraries.
- **V8**: The JavaScript engine developed by Google, used to execute JavaScript code by converting it to native machine code.

## 4. TypeScript: Enum vs. Object

- **Enum**: Immutable, type-safe constants.
- **Object**: Mutable collection of key-value pairs.

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

const Direction = {
    Up: 1,
    Down: 2,
    Left: 3,
    Right: 4
};
```

## 5. TypeScript Variable Declaration for Object Key

```typescript
const b = {
    name: "John",
    age: 30,
    job: "Developer"
};

type KeysOfB = keyof typeof b;
let a: KeysOfB;  // a can only be "name", "age", or "job"
```