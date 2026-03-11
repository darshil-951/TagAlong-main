/**
 * Returns a valid avatar URL for a user.
 * If the stored avatar points to an old local /uploads/ path or is empty,
 * returns a generated initials avatar from ui-avatars.com.
 */
export const getAvatarSrc = (avatar?: string | null, name?: string): string => {
  if (avatar && !avatar.includes('/uploads/')) {
    return avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0D8ABC&color=fff&size=256`;
};
