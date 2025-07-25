const { test, expect } = require('@playwright/test');

test.describe('Patient Registration - Mandatory Fields', () => {
  test('should successfully register a new patient with mandatory fields', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Login with provided credentials
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'amol.shete+TP@medarch.com');
    await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i]', 'Test@123$');
    
    // Click login button (various possible selectors)
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), input[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    
    // Click "Let's Get Started"
    await page.click('button:has-text("Let\'s Get Started"), a:has-text("Let\'s Get Started"), *:has-text("Let\'s Get Started")');
    
    // Wait for the next page to load
    await page.waitForLoadState('networkidle');
    
    // Click on "Create" dropdown button in white box
    await page.click('button:has-text("Create"), .dropdown-toggle:has-text("Create"), [data-testid="create-dropdown"]');
    
    // Wait for dropdown to appear
    await page.waitForTimeout(1000);
    
    // Click on "New Patient" button from the dropdown menu
    await page.click('button:has-text("New Patient"), a:has-text("New Patient"), li:has-text("New Patient")');
    
    // Wait for the patient creation page to load
    await page.waitForLoadState('networkidle');
    
    // Click and select on "Enter Patient Details" box
    await page.click('*:has-text("Enter Patient Details"), [data-testid="patient-details"], .patient-details-box');
    
    // Click on "Next" button
    await page.click('button:has-text("Next"), input[value="Next"]');
    
    // Wait for the form to appear
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Fill in mandatory Patient Details
    
    // First Name: Tony
    await page.fill('input[name="firstName"], input[placeholder*="first name" i], #firstName', 'Tony');
    
    // Last Name: Stark
    await page.fill('input[name="lastName"], input[placeholder*="last name" i], #lastName', 'Stark');
    
    // Date Of Birth: 05-07-1999
    await page.fill('input[name="dateOfBirth"], input[type="date"], input[placeholder*="date" i], #dateOfBirth', '1999-07-05');
    
    // Alternative date format if the above doesn't work
    try {
      await page.fill('input[name="dob"], input[placeholder*="dd/mm/yyyy" i]', '05/07/1999');
    } catch (error) {
      // Continue if alternative date format fails
    }
    
    // Click on the Gender dropdown button and select Male
    await page.click('select[name="gender"], #gender, .gender-dropdown, button:has-text("Select Gender")');
    await page.waitForTimeout(500);
    
    // Select Male from dropdown
    await page.click('option:has-text("Male"), li:has-text("Male"), [value="male"], [data-value="male"]');
    
    // Fill out mandatory Contact Info
    
    // Mobile: 9876544400 (Copy and paste same)
    const mobileNumber = '9876544400';
    await page.fill('input[name="mobile"], input[name="phone"], input[placeholder*="mobile" i], #mobile', mobileNumber);
    
    // Email: tony.stark@yopmail.com (Copy and paste same)
    const emailAddress = 'tony.stark@yopmail.com';
    await page.fill('input[name="email"], input[type="email"], input[placeholder*="email" i], #email', emailAddress);
    
    // Click on "Save" button
    await page.click('button:has-text("Save"), input[value="Save"], button[type="submit"]');
    
    // Wait for the save operation to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Verify the patient was created successfully
    // Look for success message or patient in the list
    await expect(page.locator('*:has-text("Tony Stark"), *:has-text("Patient saved"), *:has-text("Success")')).toBeVisible({ timeout: 10000 });
    
    // Additional verification - check if we're redirected to patient list or dashboard
    await page.waitForURL('**/patients**', { timeout: 10000 }).catch(() => {
      // If URL doesn't change, that's okay - just continue
    });
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'patient-registration-success.png' });
    
    console.log('Patient registration completed successfully');
  });
});

// Alternative test with more robust selectors
test.describe('Patient Registration - Alternative Selectors', () => {
  test('should register patient with fallback selectors', async ({ page }) => {
    // Set longer timeout for this test
    test.setTimeout(60000);
    
    try {
      await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/');
      await page.waitForLoadState('domcontentloaded');
      
      // More robust login approach
      const emailSelector = await page.locator('input[type="email"]').first();
      await emailSelector.fill('amol.shete+TP@medarch.com');
      
      const passwordSelector = await page.locator('input[type="password"]').first();
      await passwordSelector.fill('Test@123$');
      
      // Submit login
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
      
      // Navigate through the application with more flexible selectors
      await page.getByRole('button', { name: /let's get started/i }).click();
      await page.waitForTimeout(2000);
      
      await page.getByRole('button', { name: /create/i }).click();
      await page.waitForTimeout(1000);
      
      await page.getByRole('button', { name: /new patient/i }).click();
      await page.waitForTimeout(2000);
      
      // Fill form with getByLabel and getByPlaceholder
      await page.getByLabel(/first name/i).fill('Tony');
      await page.getByLabel(/last name/i).fill('Stark');
      await page.getByLabel(/date of birth/i).fill('1999-07-05');
      
      // Handle gender selection
      await page.getByLabel(/gender/i).selectOption('Male');
      
      await page.getByLabel(/mobile/i).fill('9876544400');
      await page.getByLabel(/email/i).fill('tony.stark@yopmail.com');
      
      await page.getByRole('button', { name: /save/i }).click();
      
      // Verify success
      await expect(page.getByText(/tony stark/i)).toBeVisible({ timeout: 10000 });
      
    } catch (error) {
      console.error('Test failed:', error);
      await page.screenshot({ path: 'test-failure.png' });
      throw error;
    }
  });
});