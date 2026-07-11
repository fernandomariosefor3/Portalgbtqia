import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

function requireUser() {
  const user = auth.currentUser;
  if (!user) throw new Error('Faça login para participar da verificação comunitária.');
  return user;
}

export async function createSafeSpaceReview(input: {
  spaceSlug: string;
  spaceName: string;
  rating: number;
  reviewerTag: string;
  answers: Record<string, boolean>;
}) {
  const user = requireUser();
  await addDoc(collection(db, 'safe_space_reviews'), {
    ...input,
    userId: user.uid,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function verifySafeSpace(spaceSlug: string, spaceName: string) {
  const user = requireUser();
  await setDoc(doc(db, 'safe_space_verifications', spaceSlug + '_' + user.uid), {
    spaceSlug,
    spaceName,
    userId: user.uid,
    verified: true,
    createdAt: serverTimestamp(),
  });
}

export async function reportSafeSpace(input: {
  spaceSlug: string;
  spaceName: string;
  reason: string;
  details: string;
}) {
  const user = requireUser();
  await addDoc(collection(db, 'safe_space_reports'), {
    ...input,
    userId: user.uid,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}
