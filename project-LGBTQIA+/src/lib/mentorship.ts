import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { auth, db } from './firebase';

export const mentorshipTopics = [
  'Coming out',
  'Família acolhedora',
  'Transição de gênero',
  'Empregabilidade LGBTQIA+',
] as const;

export type MentorshipTopic = (typeof mentorshipTopics)[number];

export interface MentorProfile {
  id: string;
  userId: string;
  displayName: string;
  identity: string;
  region: string;
  topics: MentorshipTopic[];
  bio: string;
  availability: string;
  status: 'available' | 'paused';
}

function requireUser() {
  const user = auth.currentUser;
  if (!user) throw new Error('Faça login para participar da mentoria.');
  return user;
}

export async function saveMentorProfile(profile: Omit<MentorProfile, 'id' | 'userId' | 'status'>) {
  const user = requireUser();
  await setDoc(doc(db, 'mentor_profiles', user.uid), {
    ...profile,
    userId: user.uid,
    status: 'available',
    updatedAt: serverTimestamp(),
  });
}

export async function findMentors(preferences: {
  identity: string;
  region: string;
  topics: MentorshipTopic[];
}) {
  requireUser();
  const snapshot = await getDocs(query(collection(db, 'mentor_profiles'), where('status', '==', 'available')));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() } as MentorProfile))
    .map((mentor) => {
      const topicMatches = mentor.topics.filter((topic) => preferences.topics.includes(topic)).length;
      const regionMatch = mentor.region.trim().toLowerCase() === preferences.region.trim().toLowerCase() ? 2 : 0;
      const identityMatch = preferences.identity && mentor.identity.toLowerCase().includes(preferences.identity.toLowerCase()) ? 1 : 0;
      return { mentor, score: topicMatches * 3 + regionMatch + identityMatch };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}

export async function requestMentorship(mentor: MentorProfile, topics: MentorshipTopic[], message: string) {
  const user = requireUser();
  await addDoc(collection(db, 'mentorship'), {
    mentor_id: mentor.userId,
    mentee_id: user.uid,
    mentorName: mentor.displayName,
    topics,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

export async function joinSupportGroup(groupId: string, groupName: string) {
  const user = requireUser();
  await setDoc(doc(db, 'support_group_memberships', groupId + '_' + user.uid), {
    groupId,
    groupName,
    userId: user.uid,
    status: 'active',
    joinedAt: serverTimestamp(),
  });
}
