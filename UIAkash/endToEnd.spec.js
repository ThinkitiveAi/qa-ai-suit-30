import { test, expect } from '@playwright/test';

// Dynamic data generation utilities
class TestDataGenerator {
  constructor() {
    this.firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'Phoenix', 'Cameron', 'Blake', 'Drew', 'Emery', 'Finley'];
    this.lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Jackson'];
    this.appointmentReasons = ['Fever', 'Headache', 'Back Pain', 'Cold Symptoms', 'Check-up', 'Stomach Pain', 'Allergies', 'Fatigue', 'Joint Pain', 'Skin Rash'];
  }

  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  generateEmail(firstName, lastName) {
    const randomNum = Math.floor(Math.random() * 1000);
    return `${firstName.toLowerCase()}${randomNum}@mailinator.com`;
  }

  generatePhone() {
    return '9' + Math.floor(Math.random() * 900000000 + 100000000).toString();
  }

  generateDateOfBirth() {
    const year = Math.floor(Math.random() * 40) + 1970; // 1970-2009
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // Safe day range
    return `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
  }

  generateTestData() {
    const providerFirstName = this.getRandomElement(this.firstNames);
    const providerLastName = this.getRandomElement(this.lastNames);
    const patientFirstName = this.getRandomElement(this.firstNames);
    const patientLastName = this.getRandomElement(this.lastNames);

    return {
      provider: {
        firstName: providerFirstName,
        lastName: providerLastName,
        fullName: `${providerFirstName} ${providerLastName}`,
        email: this.generateEmail(providerFirstName, providerLastName),
        phone: this.generatePhone(),
        dateOfBirth: this.generateDateOfBirth()
      },
      patient: {
        firstName: patientFirstName,
        lastName: patientLastName,
        fullName: `${patientFirstName} ${patientLastName}`,
        email: this.generateEmail(patientFirstName, patientLastName),
        phone: this.generatePhone(),
        dateOfBirth: this.generateDateOfBirth()
      },
      appointment: {
        reason: this.getRandomElement(this.appointmentReasons)
      }
    };
  }
}

test('Dynamic Provider Creation ➝ Patient Registration ➝ Appointment Scheduling', async ({ page, context }) => {
  // Generate dynamic test data
  const dataGenerator = new TestDataGenerator();
  const testData = dataGenerator.generateTestData();
  
  // Log generated data
  console.log('🎲 Generated Test Data:');
  console.log(`Provider: ${testData.provider.fullName} (${testData.provider.email})`);
  console.log(`Patient: ${testData.patient.fullName} (${testData.patient.email})`);
  console.log(`Appointment Reason: ${testData.appointment.reason}`);
  
  // Test configuration
  test.setTimeout(120000); // Increase timeout for complex operations
  
  // Step 1: Login & Setup
  console.log('🚀 Starting dynamic test: Provider Creation ➝ Patient Registration ➝ Appointment Scheduling');
  
  // Launch browser and maximize window
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to the login page
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.waitForLoadState('networkidle');
  
  // Login with credentials
  await page.fill('input[name="username"]', 'rose.gomez@jourrapide.com');
  await page.fill('input[type="password"]', 'Pass@123');
  
  // Click "Let's Get Started"
  await page.click('button:has-text("Let\'s get Started")');
  await page.waitForLoadState('networkidle');
  
  console.log('✅ Login completed successfully');

  // Step 2: Dynamic Provider Creation
  console.log(`👩‍⚕️ Creating Provider: ${testData.provider.fullName}`);
  
  // Click "Settings"
  await page.click('text=Settings');
  await page.waitForTimeout(1000);
  
  // Click "User Settings" > "Providers"
  await page.click('text=User Settings');
  await page.waitForTimeout(1000);
  await page.click('text=Providers');
  await page.waitForTimeout(1000);
  
  // Click "Add Provider User"
  await page.click('text=Add Provider User');
  await page.waitForTimeout(2000);
  
  // Fill mandatory Provider Details with dynamic data
  await page.fill('input[name="firstName"]', testData.provider.firstName);
  await page.fill('input[name="lastName"]', testData.provider.lastName);
  
  // Select Role: Provider
  await page.click('input[name="role"]');
  await page.waitForTimeout(500);
  await page.click('[role="option"]:has-text("Provider")');
  
  // Fill Date of Birth with dynamic data
  await page.fill('input[placeholder="MM-DD-YYYY"]', testData.provider.dateOfBirth);
  
  // Select Gender: Male (keeping this static for simplicity, but could be randomized)
  await page.click('input[name="gender"]');
  await page.waitForTimeout(500);
  await page.click('[role="option"]:has-text("Male")');
  
  // Fill Email with dynamic data
  await page.fill('input[name="email"]', testData.provider.email);
  
  // Fill Contact Info - Mobile with dynamic data
  await page.fill('input[name="phone"]', testData.provider.phone);
  
  // Click "Save"
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(3000);
  
  console.log(`✅ Provider ${testData.provider.fullName} created successfully`);

  // Step 3: Provider Availability Setup
  console.log('📅 Setting up Provider Availability');
  
  // Click "Scheduling" > "Availability"
  await page.click('text=Scheduling');
  await page.waitForTimeout(1000);
  await page.click('text=Availability');
  await page.waitForTimeout(2000);
  
  // Select Provider using dynamic name
  await page.click('input[placeholder="Select Provider"]');
  await page.waitForTimeout(1000);
  await page.click(`[role="option"]:has-text("${testData.provider.fullName}")`);
  await page.waitForTimeout(1000);
  await page.click('input[placeholder="Visit Mode"]');
  await page.waitForTimeout(1000);
  await page.click('[role="option"]:has-text("Telehealth")');
  await page.waitForTimeout(1000);
  await page.click('input[placeholder="Appointment Type"]');
  await page.waitForTimeout(1000);
  await page.click('[role="option"]:has-text("New Patient Visit")');
  
  // Click "Edit Availability"
  await page.click('text=Edit Availability');
  await page.waitForTimeout(2000);
  
  // Select Timezone: Indian Standard Time (UTC +5:30)
  await page.click('input[name="timezone"]');
  await page.waitForTimeout(1000);
  await page.click('[role="option"]:has-text("Indian Standard Time (UTC +5:30)")');
  
  // Set Booking Window: 3 Week
  await page.click('input[name="bookingWindow"]');
  await page.waitForTimeout(1000);
  await page.click('[role="option"]:has-text("3 Week")');
  
  // Select "Set to Weekdays"
  await page.click('text=Set to Weekdays');
  await page.waitForTimeout(1000);
  
  // Set Day Slot - Start Time: 12:00 AM
  await page.click('role=combobox[name="Start Time *"]');
  await page.waitForSelector('role=option[name="12:00 AM"]', { timeout: 5000 });
  await page.click('role=option[name="12:00 AM"]');

  // Open End Time dropdown
  await page.click('role=combobox[name="End Time *"]');
  await page.waitForSelector('text=02:00 AM (2 hrs)', { timeout: 5000 });
  await page.click('text=02:00 AM (2 hrs)');
  
  // Select Checkbox of "Telehealth"
  await page.locator('xpath=/html/body/div[3]/div[3]/div/div[1]/div/div/div/div[2]/div/div[1]/div/div[3]/div[3]/label/span[1]/input').check();
  await page.waitForTimeout(1000);

  await page.click('role=combobox[name="Duration"]');
  await page.waitForSelector('text=15 minutes', { timeout: 5000 });
  await page.click('text=15 minutes');

  await page.click('role=combobox[name="Schedule Notice"]');
  await page.waitForSelector('text=8 hours Away', { timeout: 5000 });
  await page.click('text=8 hours Away');

  // Click "Save"
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(3000);
  
  console.log('✅ Provider availability configured successfully');

  // Step 4: Dynamic Patient Registration
  console.log(`🏥 Registering Patient: ${testData.patient.fullName}`);
  
  // Wait for dashboard to load
  await page.waitForSelector('text=Create');
  
  // Click "Create" button to open dropdown
  await page.click('div[aria-haspopup="true"]:has-text("Create")');
  await page.waitForSelector('li[role="menuitem"]:has-text("New Patient")');
  await page.click('li[role="menuitem"]:has-text("New Patient")');
  
  // Wait for the "Add Patient" modal to appear
  await page.waitForSelector('text=Add Patient');
  
  // Click on the "Enter Patient Details" tile (third option)
  await page.click('text=Enter Patient Details');
  
  // Click the "Next" button to proceed
  await page.click('button:has-text("Next")');
  
  // Wait for the patient form to load
  await page.waitForSelector('text=PATIENT DETAILS');
  
  // Fill mandatory Patient Details with dynamic data
  await page.fill('input[name="firstName"]', testData.patient.firstName);
  await page.fill('input[name="lastName"]', testData.patient.lastName);
  
  // Date of Birth with dynamic data
  await page.click('label:has-text("Date Of Birth") + div input');
  await page.fill('label:has-text("Date Of Birth") + div input', testData.patient.dateOfBirth);
  
  // Gender: Male (keeping static for simplicity)
  await page.click('div:has-text("Gender") + div .MuiSelect-select, [aria-labelledby*="gender"], [name*="gender"]');
  await page.waitForSelector('li:has-text("Male")');
  await page.click('li:has-text("Male")');
  
  // Fill Contact Info with dynamic data
  // Mobile Number
  await page.fill('input[name*="mobile"]:not([name*="emergency"]):not([name*="subscriber"])', testData.patient.phone);
  
  // Email
  await page.fill('input[name*="email"]:not([name*="emergency"]):not([name*="subscriber"])', testData.patient.email);

  // Click "Save"
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(3000);
  
  console.log(`✅ Patient ${testData.patient.fullName} registered successfully`);

  // Step 5: Dynamic Appointment Creation
  console.log('📝 Creating Appointment with dynamic data');
  
  // Click "Create" > "New Appointment"
  await page.click('div[aria-haspopup="true"] .css-6qz1f6');
  
  // Click "New Appointment"
  await page.click('li[role="menuitem"]:has-text("New Appointment")');
  
  // Wait for the appointment form to load
  await page.waitForSelector('div[title="Schedule Appointment"]');
  
  // Select Patient Name using dynamic data
  await page.click('input[name="patientId"]');
  await page.fill('input[name="patientId"]', testData.patient.fullName);
  await page.click(`li[role="option"]:has-text("${testData.patient.fullName}")`);
  
  // Select Appointment Type - New Patient Visit
  await page.click('input[name="type"]');
  await page.fill('input[name="type"]', 'New Patient Visit');
  await page.click('li[role="option"]:has-text("New Patient Visit")');
  
  // Fill Reason for Visit with dynamic data
  await page.fill('input[name="chiefComplaint"]', testData.appointment.reason);
  
  // Select Time Zone - Indian Standard Time
  await page.click('input[name="timezone"]');
  await page.fill('input[name="timezone"]', 'Indian Standard Time (UTC +5:30)');
  
  // Select Visit Type - Telehealth
  await page.locator('xpath=/html/body/div[3]/div[3]/div/div/div[1]/div/div/div[6]/div/div/button[2]').click();
  
  // Select Provider using dynamic data
  await page.click('input[placeholder="Search Provider"]');
  await page.fill('input[placeholder="Search Provider"]', testData.provider.fullName);
  await page.waitForSelector(`li[role="option"]:has-text("${testData.provider.fullName}")`, { timeout: 5000 });
  await page.click(`li[role="option"]:has-text("${testData.provider.fullName}")`);
  
  await page.waitForTimeout(2000);
  // Click "View Availability"
  await page.click('//button[normalize-space(text())="View availability"]');
  await page.waitForTimeout(2000);
  
  // Handle date/time selection dialog
  const dateDialog = page.locator('.MuiDialog-paper[role="dialog"]');
  if (await dateDialog.isVisible()) {
    // Select August 11th as an available date
    await page.click('.MuiDialog-paper [role="gridcell"]:has-text("11"):not([aria-disabled="true"])');
    // Click on the desired time slot
    await page.click('button:has-text("12:30 AM - 12:45 AM")');
  }
  
  // Click "Save and Close"
  await page.click('button:has-text("Save And Close")');
  await page.waitForTimeout(3000);

  // Click on user avatar to open menu
  await page.click('.MuiAvatar-root');
  
  // Wait for menu to appear and click logout
  await page.click('text="Log Out"');
  await page.click('button:has-text("Yes,Sure")');

  // Wait for logout to complete and redirect
  await page.waitForURL('**/auth/login');
  
  // Take screenshot after logout
  await page.screenshot({ path: `dynamic_test_${Date.now()}.png`, fullPage: true });
  
  // Verify we're back on the login page
  await expect(page).toHaveURL(/.*auth\/login/);
  await expect(page.locator('input[name="username"]')).toBeVisible();
  
  console.log('✅ Dynamic test completed successfully!');
  console.log('✅ Appointment created with dynamic data:');
  console.log(`   - Patient: ${testData.patient.fullName} (${testData.patient.email})`);
  console.log(`   - Provider: ${testData.provider.fullName} (${testData.provider.email})`);
  console.log(`   - Type: New Patient Visit`);
  console.log(`   - Reason: ${testData.appointment.reason}`);
  console.log(`   - Visit Type: Telehealth`);
});

// Enhanced helper functions for robust element interaction
async function waitAndClick(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
  } catch (error) {
    console.warn(`Could not click ${selector}: ${error.message}`);
    throw error;
  }
}

async function waitAndFill(page, selector, value, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.fill(selector, value);
  } catch (error) {
    console.warn(`Could not fill ${selector}: ${error.message}`);
    throw error;
  }
}

async function waitAndSelect(page, selector, value, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    await page.waitForTimeout(500);
    await page.click(`[role="option"]:has-text("${value}")`);
  } catch (error) {
    console.warn(`Could not select ${value} from ${selector}: ${error.message}`);
    throw error;
  }
}

// Export the data generator for potential reuse
export { TestDataGenerator };