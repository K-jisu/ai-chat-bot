import { expect, test } from "@playwright/test";

test.describe("선형 AI 챗봇", () => {
  test("사용자 입력 후에도 흐름이 끊기지 않고 미디어가 제때 노출된다", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("새로운 여정을 시작해요")).toBeVisible();

    const input = page.getByPlaceholder("어떤 말이든 남기면 다음 장면으로 이어집니다.");
    const send = page.getByRole("button", { name: "보내기" });

    for (let i = 0; i < 5; i += 1) {
      await input.fill(`테스트 입력 ${i}`);
      await send.click();
      await expect(page.getByText("다음 장면을 불러오는 중...")).toBeVisible();
      await expect(page.getByText(/머그컵|속도 체크|파도가 묻은/)).toBeVisible({ timeout: 7000 });
    }

    await expect(page.getByRole("img", { name: /파도/ })).toBeVisible({ timeout: 8000 });
    await expect(page.getByText("짧은 영상으로 공기를 전해볼게요")).toBeVisible({ timeout: 12000 });
    await expect(page.locator("video[title='햇살 아래 들꽃 필드']")).toBeVisible({ timeout: 12000 });
  });
});
