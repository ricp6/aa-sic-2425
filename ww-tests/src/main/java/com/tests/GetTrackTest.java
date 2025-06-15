package com.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.time.Duration;
import java.util.List;


public class GetTrackTest implements WebTest {

    @Override
    public String getName() {
        return "GetTrackTest";
    }

    @Override
    public boolean run(WebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // Esperar pelo botão "Tracks" na navbar e clicar
            WebElement tracksButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("tracks-link")));
            tracksButton.click();

            // Esperar que os cards de pistas estejam visíveis
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".track-card")));

            // Obter a lista de pistas
            List<WebElement> tracks = driver.findElements(By.cssSelector(".track-card"));
            if (tracks.isEmpty()) {
                System.out.println("No tracks found.");
                return false;
            }

            // Clicar na primeira pista
            tracks.get(0).click();

            // Esperar pelo elemento de detalhes
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("details-card")));

            System.out.println("Track details loaded successfully.");
            return true;

        } catch (Exception e) {
            System.out.println("Error in TrackDetailsTest: " + e.getMessage());
            return false;
        }
    }
}
