import { MOCK_TAGS } from "./data";
import { delay } from "./helpers";

export async function mockListTags() {
  await delay();
  return MOCK_TAGS;
}
