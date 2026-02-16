export const USER_STORAGE_KEY = 'replaix_user';

export interface MockUser {
  name: string;
  username: string;
  email: string;
  plan: 'Starter' | 'Pro' | 'Growth';
  repliesUsedToday: number;
  repliesLimit: number;
  joinDate: string;
  avatar: string;
}

const defaultUser: MockUser = {
  name: 'Martí',
  username: '@martifons',
  email: 'martí@example.com',
  plan: 'Starter',
  repliesUsedToday: 5,
  repliesLimit: 15,
  joinDate: '2026-01-10',
  avatar: 'https://i.pravatar.cc/150?img=32',
};

export function getUser(): MockUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function setUser(user: MockUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function updateUsage(): void {
  const user = getUser();
  if (!user) return;
  const next = Math.min(user.repliesUsedToday + 1, user.repliesLimit);
  setUser({ ...user, repliesUsedToday: next });
}

export function createUser(overrides?: Partial<MockUser>): MockUser {
  return { ...defaultUser, ...overrides };
}
