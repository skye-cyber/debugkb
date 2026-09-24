import { MOCK_SKILLS, MOCK_ISSUES } from "./data";
import { delay } from "./helpers";

export async function mockListSkills() {
  await delay();
  return MOCK_SKILLS;
}

export async function mockGetSkill(id) {
  await delay();
  const skill = MOCK_SKILLS.find((s) => String(s.id) === String(id));
  if (!skill) {
    const err = new Error("Not found");
    err.status = 404;
    throw err;
  }
  return skill;
}

export async function mockSkillIssues(id) {
  await delay();
  return MOCK_ISSUES.slice(0, 4);
}
