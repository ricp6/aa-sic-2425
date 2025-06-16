package com.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginTest implements WebTest {

    @Override
    public String getName() {
        return "LoginTest";
    }

    @Override
    public boolean run(WebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // Esperar pelo botão "Login" na navbar e clicar
            WebElement tracksButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("login-button")));
            tracksButton.click();
            Thread.sleep(500);

            // Esperar até que o formulário esteja visível
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-form")));

            // Preencher email
            WebElement emailInput = driver.findElement(By.id("email"));
            emailInput.sendKeys("autotest@gmail.com");
            Thread.sleep(500);

            // Preencher password
            WebElement passwordInput = driver.findElement(By.cssSelector("input[formControlName='password']"));
            passwordInput.sendKeys("ao309sjd");
            Thread.sleep(500);

            // Clicar no botão de visibilidade da password e voltar a esconder
            WebElement eyeButton = driver.findElement(By.id("eye-button"));
            eyeButton.click();
            eyeButton.click();
            Thread.sleep(500);

            // Submeter o formulário
            WebElement loginButton = driver.findElement(By.id("primary-button"));
            wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            loginButton.click();
            Thread.sleep(500);

            // Esperar pelo botão notificacoes na navbar
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("notifications-button")));

            System.out.println("Login submitted successfully.");
            return true;

        } catch (Exception e) {
            System.out.println("Error in LoginTest: " + e.getMessage());
            return false;
        }
    }
}
