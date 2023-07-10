import { test, expect } from '@playwright/test';

test.describe('manage a subscriber\'s flight quota', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const openModal = (page) => page.getByRole('listitem', { name: 'Subscriber 3' })
    .getByRole('button', { name: 'Edit quota' }).click();
  const getQuotaText = (page) => page.getByRole('region', { name: 'quota' }).textContent();
  const getSelectMotiveElement = (page) => page.getByRole('combobox');
  const getIncrementButton = (page) => page.getByRole('button', { name: '>' });
  const getDecrementButton = (page) => page.getByRole('button', { name: '<' });
  const getSaveButton = (page) => page.getByRole('button', { name: 'Save' });

  test('successfully modifies a subscriber\s quota and displays a success message', async ({ page }) => {
    await openModal(page);

    // Fill the required fields
    await getIncrementButton(page).click();
    await getSelectMotiveElement(page).selectOption('airline_canceled');

    // Mock a success response
    await page.route('https://httpstat.us/random/*', async (route) => route.fulfill({ status: 201 }));

    await getSaveButton(page).click();

    await expect(page.getByRole('region', { name: 'success-message' })).toBeInViewport();
  });

  test('Closing the modal without saving should reset the modified values', async ({ page }) => {
    await openModal(page);

    const initialValue = await getQuotaText(page);

    // Increment quota and select a motive
    await getIncrementButton(page).click();
    await getSelectMotiveElement(page).selectOption('airline_canceled');

    // Save the modified value for further comparison
    const modifiedValue = await getQuotaText(page);

    await page.getByRole('button', { name: '✕' }).click();

    await openModal(page);

    // Read again the untouched value shown in the modal
    const defaultValue = await getQuotaText(page);

    // Quota value should be reset back to the default
    expect(defaultValue).not.toEqual(modifiedValue);
    expect(defaultValue).toEqual(initialValue);
  });

  test('Displays a set of motives when incrementing a quota value', async ({ page }) => {
    await openModal(page);

    await getIncrementButton(page).click();
    const options = await getSelectMotiveElement(page).getByRole('option');

    await expect(options.nth(1)).toHaveText('Subscriber canceled flight');
    await expect(options.nth(2)).toHaveText('Airline canceled flight');

  });

  test('Displays a set of motives when subtracting a quota value', async ({ page }) => {
    await openModal(page);

    await getDecrementButton(page).click();
    const options = await getSelectMotiveElement(page).getByRole('option');

    await expect(options.nth(1)).toHaveText('Flight not redeposited after a flight cancellation');
    await expect(options.nth(2)).toHaveText('Subscriber had log in or password issues');
    await expect(options.nth(3)).toHaveText('Subscriber had issues when booking');
    await expect(options.nth(4)).toHaveText('Subscription has not renewed correctly');
  });

  test('Disabled buttons flow', async ({ page }) => {
    await openModal(page);

    let quotaText;

    // Motive select and Save buttons are disabled by default
    await expect(getSelectMotiveElement(page)).toHaveAttribute('disabled', '');
    await expect(getSaveButton(page)).toHaveAttribute('disabled', '');

    // Decrement button is disabled when the limit is reached
    const decrementButton = await getDecrementButton(page);
    await decrementButton.click({ clickCount: 5 });
    quotaText = await getQuotaText(page);
    await expect(decrementButton).toHaveAttribute('disabled', '');
    expect(quotaText).toBe('0');

    // Increment button is disabled when the limit is reached
    const incrementButton = await getIncrementButton(page);
    await incrementButton.click({ clickCount: 5 });
    quotaText = await getQuotaText(page);
    await expect(incrementButton).toHaveAttribute('disabled', '');
    expect(quotaText).toBe('3');
  });

  test('Shows an error message when changes can\'t be saved', async ({ page }) => {
    await openModal(page);

    // Fill the required fields
    await getIncrementButton(page).click();
    await getSelectMotiveElement(page).selectOption('airline_canceled');

    // Mock an error response
    await page.route('https://httpstat.us/random/*', async (route) => route.fulfill({ status: 504 }));

    await getSaveButton(page).click();

    await expect(page.getByRole('region', { name: 'error-message' })).toBeInViewport();
  });
});