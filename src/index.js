// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app'
import{
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth, 
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
}from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA5BcnN8Y2jyyNCF2SM6yi-hZD6YkfH3SE",
    authDomain: "iheartyou-f11af.firebaseapp.com",
    projectId: "iheartyou-f11af",
    storageBucket: "iheartyou-f11af.appspot.com",
    messagingSenderId: "610345514558",
    appId: "1:610345514558:web:d0541808470e68fc99436f",
    measurementId: "G-987WXYQK6P"
  };

// init firebase app
initializeApp(firebaseConfig);
const auth = getAuth()

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'books')

//queries
const q = query(colRef, orderBy('createdAt'))

//real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
  })

//adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit',(e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset()
    })
})


//deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
    .then(() => {
        deleteBookForm.reset()
    })
})

//get a single document
const docRef = doc(db, 'books', 'NdKWUYAIOYXlnlX2lyB9')

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

//updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateForm.reset()
    })
})

//signing user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
     .then((cred) => {
        //console.log('user created: ', cred.user)
        signupForm.reset()
     })
     .catch((err) => {
        console.log(err.message)
     })
})

//logging ing and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
     .then(() => {
        //console.log('the user signed out')
     })
     .catch((err) => {
        console.log(err.message)
     })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
     .then((cred) => {
        //console.log('user logged in', cred.user)
     })
     .catch((err) => {
        console.log(err.message)
     })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user)
})

//unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()

})