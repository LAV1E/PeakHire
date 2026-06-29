const PROFILE_WEIGHTS = {
  avatar: 10,
  resume: 20,
  bio: 10,
  skills: 15,
  experience: 20,
  education: 15,
  socialLinks: 10,
};

export function calculateProfileCompletion(
  user
) {
  let percentage = 0;
  let completedSections = 0;

  if (user.avatar?.url) {
    percentage += PROFILE_WEIGHTS.avatar;
    completedSections++;
  }

  if (user.resume?.url) {
    percentage += PROFILE_WEIGHTS.resume;
    completedSections++;
  }

  if (user.bio?.trim()) {
    percentage += PROFILE_WEIGHTS.bio;
    completedSections++;
  }

  if (user.skills?.length > 0) {
    percentage += PROFILE_WEIGHTS.skills;
    completedSections++;
  }

  if (
    user.experience?.length > 0
  ) {
    percentage += PROFILE_WEIGHTS.experience;
    completedSections++;
  }

  if (
    user.education?.length > 0
  ) {
    percentage += PROFILE_WEIGHTS.education;
    completedSections++;
  }

  const links =
    user.socialLinks || {};

  if (
    links.github ||
    links.linkedin ||
    links.portfolio ||
    links.leetcode ||
    links.codeforces ||
    links.hackerrank
  ) {
    percentage +=
      PROFILE_WEIGHTS.socialLinks;

    completedSections++;
  }

  return {
    percentage,
    completedSections,
    totalSections: 7,
  };
}