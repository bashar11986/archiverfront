
// import axios from 'axios'

// // const api = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost: 7011/identity/Account',
// //   //7011/identity/Account/NewUser
// //   headers: { 
// //     'Content-Type': 'application/json'
// //   }
// // })
//  const apiLogin = axios.create({
//    baseURL: process.env.LOGIN_API || 'https://localhost:44318/Account',
//    //7011/identity/Account/NewUser
//    headers: { 
//      'Content-Type': 'application/json'
//    }
//  })
// const apiGetCategories = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_GET_CATS || 'https://localhost:44330/api/app/categories',
//   //7011/identity/Account/NewUser
//   headers: { 
//     'Content-Type': 'application/json'
//   }
// })
// export default  apiGetCategories


import axios from 'axios';

// مثيل للاتصال بخدمة الأقسام (Categories API)
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
