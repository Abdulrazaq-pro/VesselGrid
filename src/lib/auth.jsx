import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

const messages = {
  'auth/email-already-in-use': 'An account with this email already exists. Sign in instead.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/weak-password': 'Use a stronger password (at least 8 characters).',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'Email sign-in is not enabled for this project yet.',
  'permission-denied': 'The database refused this request (security rules). Contact nimot@vesselgrid.site if this continues.',
}
export const withTimeout = (p, ms = 12000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('The database did not respond. Check your connection and try again.'), { code: 'timeout' })), ms))])
export const errText = (e) => messages[e?.code] || e?.message || 'Something went wrong. Please try again.'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [fbUser, setFbUser] = useState(undefined) // undefined = still checking
  const [profile, setProfile] = useState(null)

  useEffect(() => onAuthStateChanged(auth, (u) => { setFbUser(u); if (!u) setProfile(null) }), [])
  useEffect(() => {
    if (!fbUser) return
    return onSnapshot(doc(db, 'users', fbUser.uid), (s) => setProfile(s.exists() ? s.data() : { name: fbUser.displayName || '', email: fbUser.email, org: null }), () => setProfile({ name: fbUser.displayName || '', email: fbUser.email, org: null }))
  }, [fbUser])

  const loading = fbUser === undefined || (fbUser && !profile)
  const user = fbUser && profile ? { uid: fbUser.uid, email: fbUser.email, name: profile.name || fbUser.displayName || '', org: profile.org || null } : null

  const signup = async ({ name, email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
    await updateProfile(cred.user, { displayName: name.trim() })
    await withTimeout(setDoc(doc(db, 'users', cred.user.uid), { name: name.trim(), email: cred.user.email, org: null, createdAt: serverTimestamp() })).catch(() => {}) // profile is retried at onboarding
    return cred.user
  }
  const login = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
    const s = await withTimeout(getDoc(doc(db, 'users', cred.user.uid))).catch(() => null)
    if (!s) return { name: cred.user.displayName || '', org: null }
    return { name: s.data()?.name || cred.user.displayName || '', org: s.data()?.org || null }
  }
  const logout = () => signOut(auth)
  const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim())
  const updateUser = (patch) => withTimeout(setDoc(doc(db, 'users', fbUser.uid), { name: profile?.name || fbUser.displayName || '', email: fbUser.email, ...patch, updatedAt: serverTimestamp() }, { merge: true }))

  return <AuthCtx.Provider value={{ user, loading, signup, login, logout, updateUser, resetPassword }}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)

export function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-sand/40" role="status" aria-label="Loading">
      <div className="w-64 space-y-3">{[80, 100, 60].map((w) => <div key={w} className="h-3 animate-pulse rounded bg-ink/10" style={{ width: `${w}%` }} />)}</div>
    </div>
  )
}

/* ---------- Toasts ---------- */
const ToastCtx = createContext(() => {})
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const push = useCallback((msg, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2)
    setItems((xs) => [...xs, { id, msg, kind }])
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3600)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-start gap-2 rounded-xl border border-ink/10 bg-white p-3 text-sm shadow-lg animate-[toast_.25s_ease]">
            {t.kind === 'err' ? <AlertCircle size={18} className="shrink-0 text-signal" /> : <CheckCircle2 size={18} className="shrink-0 text-sea" />}
            <span className="flex-1">{t.msg}</span>
            <button onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))} aria-label="Dismiss"><X size={15} className="text-ink/40" /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)
