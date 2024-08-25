# Node.js Archax Backend Developer Test

This document contains answers and code solutions for a Node.js Archax backend developer test.

## 1. Why `{ a: 1 } === { a: 1 }` is False in JavaScript

In JavaScript, objects are compared by reference, not by value. Even though two objects may have identical properties and values, they are not considered equal unless they reference the same memory location.

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 1 };

console.log(obj1 === obj2); // false
```
