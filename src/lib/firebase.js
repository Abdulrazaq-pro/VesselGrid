import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Firebase web config. These values identify the project to the client and are public by design;
// access is enforced by Firebase Authentication and the Firestore security rules in firestore.rules.
const firebaseConfig = {
  apiKey: 'AIzaSyBftYLwe7RCrYv74icFPtZmSObMAn89QLE',
  authDomain: 'fir-project-8d610.firebaseapp.com',
  projectId: 'fir-project-8d610',
  storageBucket: 'fir-project-8d610.firebasestorage.app',
  messagingSenderId: '389931478661',
  appId: '1:389931478661:web:11cb8c46541ee6efeb03ec',
  measurementId: 'G-2BX8XN7EJB',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export let analytics = null
isSupported().then((ok) => { if (ok) analytics = getAnalytics(app) }).catch(() => {})
