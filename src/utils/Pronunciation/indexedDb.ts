import type { PendingPronunciationUpload } from '@/types/pronunciation';

const DB_NAME = 'pronunciation-upload-db';
const STORE_NAME = 'pending-pronunciation-uploads';
const DB_VERSION = 1;

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'localId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });

const withStore = async <T>(mode: IDBTransactionMode, handler: (store: IDBObjectStore) => IDBRequest<T>) => {
  const database = await openDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = handler(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB operation failed'));

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('IndexedDB transaction failed'));
    };
  });
};

export const pronunciationUploadDb = {
  put: (upload: PendingPronunciationUpload) => withStore('readwrite', (store) => store.put(upload)),
  get: (localId: string) => withStore<PendingPronunciationUpload | undefined>('readonly', (store) => store.get(localId)),
  delete: (localId: string) => withStore('readwrite', (store) => store.delete(localId)),
  list: () => withStore<PendingPronunciationUpload[]>('readonly', (store) => store.getAll()),
};
