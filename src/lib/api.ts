
import axios from 'axios';

// Categories API
export const apiCats = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CATS,
  headers: { 'Content-Type': 'application/json' },
});

// login API
export const apiAccount = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ACCOUNT_API,
  headers: { 'Content-Type': 'application/json' },
});

// users API
export const apiUsers = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USERS_API,
  headers: { 'Content-Type': 'application/json' },
});

// role APIs
export const apiRoles = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ROLE_API,
  headers: { 'Content-Type': 'application/json' },
});
// user role APIs
export const apiUserRoles = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_ROLE_API,
  headers: { 'Content-Type': 'application/json' },
});
