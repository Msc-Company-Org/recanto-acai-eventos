import { test, expect } from "@playwright/test";

test.describe("Recanto do Açaí E2E Funnel Tests", () => {
  test("Should navigate through the complete funnel (Home -> Reserva -> Obrigado)", async ({ page }) => {
    // Increase test timeout to 120 seconds to allow Next.js turbopack on-demand compilation
    test.setTimeout(120000);

    // Debugging hooks
    page.on("console", (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on("pageerror", (err) => console.error(`[BROWSER ERROR] ${err.message}`));

    // 1. Visit the Home Page
    await page.goto("/");
    await expect(page).toHaveTitle(/Estação de Açaí para Eventos no RJ | Recanto do Açaí/);

    // Verify main copy elements
    await expect(page.locator("text=Monte seu orçamento")).toBeVisible();
    await expect(page.locator("text=Estrutura e serviço gourmet inclusos")).toBeVisible();

    // 2. Fill the Quote Form (Home Page)
    // Date
    const today = new Date();
    today.setDate(today.getDate() + 30); // 30 days in the future
    const futureDateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
    await page.fill('input[type="date"]', futureDateStr);

    // Name
    await page.fill('input[placeholder="Como te chamamos?"]', "Cliente Teste E2E");

    // WhatsApp
    await page.fill('input[placeholder="(21) 9...."]', "21987654321");

    // Convidados
    await page.fill('input[placeholder="50"]', "120");

    // Tipo de evento (select)
    await page.selectOption('label:has-text("Tipo de evento") select', { label: "Casamentos" });

    // Package Selection (click Combo Açaí + Sorvete)
    await page.click('button:has-text("Açaí + Sorvete")');

    // Click submit button to advance
    // This will trigger ENVIO_FORMULARIO and QUALIFY_LEAD and CLOSE_CONVERT_LEAD events
    await Promise.all([
      page.waitForURL(/.*\/reserva\?.*/),
      page.click('button:has-text("Avançar para Agendamento e Pagamento")'),
    ]);

    // 3. Verify Reserva Page
    await expect(page.url()).toContain("/reserva");
    await expect(page.locator("text=Dados do seu Evento")).toBeVisible();
    
    // Verify fields are pre-filled from query parameters
    await expect(page.locator('input[placeholder="Ex: Maria Silva"]')).toHaveValue("Cliente Teste E2E");
    await expect(page.locator('input[placeholder="Ex: (21) 99999-9999"]')).toHaveValue("21987654321");
    await expect(page.locator('input[type="date"]')).toHaveValue(futureDateStr);
    
    // Choose Region to trigger price recalculation (Baixada Fluminense -> adds R$ 150)
    await page.selectOption('label:has-text("Local do Evento") select', { value: "baixada" });
    
    // Check pricing calculation
    // Base Combo: R$ 1690 + R$ 150 frete = R$ 1840 total
    // 50% signal = R$ 920
    await expect(page.locator("text=Investimento Total:")).toBeVisible();
    await expect(page.locator("text=R$ 1.840,00")).toBeVisible();
    await expect(page.locator("text=R$ 920,00")).toBeVisible();

    // 4. Simulate payment redirection click (Checkout)
    // We mock the /api/checkout response to return a mock stripe URL
    await page.route("**/api/checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "http://localhost:3000/obrigado?session_id=mock_session_123" }),
      });
    });

    // Click confirm reservation button (starts checkout)
    await page.click('button:has-text("Confirmar Reserva")');
    
    // The page should navigate to the redirect URL (/obrigado?session_id=mock_session_123)
    await page.waitForURL(/.*\/obrigado\?session_id=mock_session_123/);

    // 5. Verify Obrigado Page
    await expect(page.locator("text=Sua data está reservada!")).toBeVisible();
    await expect(page.locator("text=O pagamento do sinal foi processado com sucesso")).toBeVisible();
    
    // Verify "Voltar para a Página Inicial" link
    await expect(page.locator('a:has-text("Voltar para a Página Inicial")')).toBeVisible();
  });
});
