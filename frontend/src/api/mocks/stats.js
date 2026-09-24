import { MOCK_STATS } from "./data";
import { delay } from "./helpers";

export async function mockStatsSummary() {
  await delay();
  console.log("-", MOCK_STATS)
  return MOCK_STATS;
}
