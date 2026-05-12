import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getPosts', () => {
    it('returns an empty array when localStorage has no posts', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage value is null', () => {
      localStorage.removeItem('writespace_posts');
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
        },
        {
          id: '2',
          title: 'Another Post',
          content: 'More content',
          createdAt: '2024-01-02T00:00:00.000Z',
          authorId: 'user2',
          authorName: 'Another User',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ foo: 'bar' }));
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a string value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('hello'));
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a number', () => {
      localStorage.setItem('writespace_posts', JSON.stringify(42));
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = getPosts();
      expect(result).toEqual([]);

      spy.mockRestore();
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'Test User',
        },
      ];

      savePosts(posts);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(posts);
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);

      const stored = localStorage.getItem('writespace_posts');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual([]);
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: '1', title: 'Old' }];
      localStorage.setItem('writespace_posts', JSON.stringify(initialPosts));

      const newPosts = [{ id: '2', title: 'New' }];
      savePosts(newPosts);

      const stored = localStorage.getItem('writespace_posts');
      expect(JSON.parse(stored)).toEqual(newPosts);
    });

    it('does not throw when localStorage.setItem fails', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });

      expect(() => savePosts([{ id: '1' }])).not.toThrow();

      spy.mockRestore();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when localStorage has no users', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage value is null', () => {
      localStorage.removeItem('writespace_users');
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'u2',
          displayName: 'Jane Admin',
          username: 'janeadmin',
          password: 'admin456',
          role: 'admin',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', 'this is not json{{{');
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify({ user: 'data' }));
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains null JSON', () => {
      localStorage.setItem('writespace_users', JSON.stringify(null));
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains a boolean', () => {
      localStorage.setItem('writespace_users', JSON.stringify(true));
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = getUsers();
      expect(result).toEqual([]);

      spy.mockRestore();
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'John Doe',
          username: 'johndoe',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveUsers(users);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual(users);
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);

      const stored = localStorage.getItem('writespace_users');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored)).toEqual([]);
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: 'u1', username: 'old' }];
      localStorage.setItem('writespace_users', JSON.stringify(initialUsers));

      const newUsers = [{ id: 'u2', username: 'new' }];
      saveUsers(newUsers);

      const stored = localStorage.getItem('writespace_users');
      expect(JSON.parse(stored)).toEqual(newUsers);
    });

    it('does not throw when localStorage.setItem fails', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded');
      });

      expect(() => saveUsers([{ id: 'u1' }])).not.toThrow();

      spy.mockRestore();
    });
  });

  describe('integration: save then get', () => {
    it('can save and retrieve posts', () => {
      const posts = [
        {
          id: 'p1',
          title: 'Integration Test',
          content: 'Testing save and get',
          createdAt: '2024-06-15T12:00:00.000Z',
          authorId: 'a1',
          authorName: 'Tester',
        },
      ];

      savePosts(posts);
      const result = getPosts();
      expect(result).toEqual(posts);
    });

    it('can save and retrieve users', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Integration User',
          username: 'intuser',
          password: 'secret',
          role: 'user',
          createdAt: '2024-06-15T12:00:00.000Z',
        },
      ];

      saveUsers(users);
      const result = getUsers();
      expect(result).toEqual(users);
    });

    it('posts and users do not interfere with each other', () => {
      const posts = [{ id: 'p1', title: 'Post' }];
      const users = [{ id: 'u1', username: 'user' }];

      savePosts(posts);
      saveUsers(users);

      expect(getPosts()).toEqual(posts);
      expect(getUsers()).toEqual(users);
    });
  });
});