package com.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;

public class TestRunner {
    public static void main(String[] args) {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");

        WebDriver driver = new ChromeDriver(options);
        driver.get("http://localhost:4200/");

        WebDriverWait wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(5));

        List<WebTest> tests = List.of(
                new GetTrackTest(),
                new LoginTest(),
                new CreateReservationTest()
                // add more like: new LoginTest(), new SettingsTest(), etc.
        );

        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        for (WebTest test : tests) {

            // Reset to the home page
            driver.get("http://localhost:4200/");

            // Run test
            System.out.println("Running test: " + test.getName());
            boolean success = test.run(driver);

            // Print status
            if (success) {
                passed.add(test.getName());
                System.out.println("PASSED: " + test.getName());
            } else {
                failed.add(test.getName());
                System.out.println("FAILED: " + test.getName());
            }

            // Wait a moment before next test
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        driver.quit();

        System.out.println("\n--- Test Report ---");
        System.out.println("Passed: " + passed);
        System.out.println("Failed: " + failed);
    }
}
