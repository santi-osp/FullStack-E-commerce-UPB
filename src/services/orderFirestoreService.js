import { collection, addDoc } from 'firebase/firestore'
import { getFirestoreDb, isFirebaseReady } from '../config/firebase.js'

export async function createOrder({ userId, items, totalAmount, shipping }) {
  if (!isFirebaseReady()) {
    return { orderId: `local-${Date.now()}`, local: true }
  }
  const db = getFirestoreDb()
  const payload = {
    userId: userId || 'guest',
    items: items.map((i) => ({
      productId: i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
    })),
    totalAmount,
    shipping,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  const docRef = await addDoc(collection(db, 'orders'), payload)
  return { orderId: docRef.id, local: false }
}
