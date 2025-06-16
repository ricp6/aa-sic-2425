package com.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class CreateReservationTest implements WebTest {

    @Override
    public String getName() {
        return "CreateReservationTest";
    }

    @Override
    public boolean run(WebDriver driver) {
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

            // Esperar pelo botão Reservations na navbar e clicar
            WebElement reservationsButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("reservations-link")));
            reservationsButton.click();
            Thread.sleep(500);

            // Esperar pelo botao de criar reserva
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("new-reservation-button")));
            WebElement bookButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("new-reservation-button")));
            bookButton.click();
            Thread.sleep(500);

            // STEP 1: selecionar pista
            WebElement trackInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[aria-label='Search Track']")));
            trackInput.sendKeys("Braga");
            Thread.sleep(500);

            WebElement option = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("mat-option")));
            option.click();
            Thread.sleep(500);

            driver.findElement(By.cssSelector("button[matStepperNext]")).click();
            System.out.println("Track selected successfully.");
            Thread.sleep(500);

            // STEP 2: procurar slots disponíveis nos próximos 7 dias
            int maxDaysToCheck = 7;
            boolean foundAvailableSlot = false;

            // Esperar pelo calendário
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("mat-calendar")));

            // Obter todos os dias clicáveis do mês visível
            List<WebElement> days = driver.findElements(By.cssSelector(".mat-calendar-body-cell:not(.mat-calendar-body-disabled)"));

            outerLoop:
            for (int i = 1; i <= maxDaysToCheck; i++) {

                if (days.size() < i) {
                    System.out.println("Not enough selectable days in calendar to reach day " + i);
                    return false;
                }

                // Selecionar o i-ésimo dia a partir de amanhã
                days.get(i).click();
                Thread.sleep(500);

                // Esperar pelo container de slots ou mensagem
                wait.until(ExpectedConditions.presenceOfElementLocated(By.className("compact-slot")));
                List<WebElement> slots = driver.findElements(By.className("compact-slot"));
                Thread.sleep(500);
                for (WebElement slot : slots) {
                    if (slot.isEnabled()) {
                        wait.until(ExpectedConditions.elementToBeClickable(slot)).click();
                        foundAvailableSlot = true;
                        break outerLoop;
                    }
                }
                // Se não havia slots, repetir no próximo dia
            }

            if (!foundAvailableSlot) {
                System.out.println("No available slots found in the next 7 days.");
                return false;
            }

            // Avançar para o próximo passo
            driver.findElements(By.cssSelector("button[matStepperNext]")).get(1).click();
            System.out.println("Date and slot selected successfully.");
            Thread.sleep(500);

            // STEP 3: adicionar participante
            WebElement addParticipantButton = wait.until(ExpectedConditions.elementToBeClickable(By.className("add-participant-button")));
            addParticipantButton.click();
            Thread.sleep(500);

            // Inserir nome do utilizador
            List<WebElement> userInputs = wait.until(ExpectedConditions.visibilityOfAllElementsLocatedBy(
                    By.cssSelector("input[aria-label='Search User']")));
            WebElement secondUserInput = userInputs.get(1);
            wait.until(ExpectedConditions.elementToBeClickable(secondUserInput));
            secondUserInput.sendKeys("Ric");
            Thread.sleep(500);

            WebElement userOption = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("mat-option")));
            userOption.click();
            Thread.sleep(500);

            // Selecionar karts
            List<WebElement> kartSelect = driver.findElements(By.cssSelector("mat-select[formcontrolname='kart']"));
            kartSelect.get(0).click();
            List<WebElement> options = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("mat-option")));
            options.get(0).click();
            Thread.sleep(500);

            kartSelect.get(1).click();
            options = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("mat-option")));
            options.get(1).click();
            Thread.sleep(500);

            // Submeter reserva
            WebElement submitBtn = driver.findElement(By.id("submit-button"));
            submitBtn.click();
            Thread.sleep(500);

            // Esperar carregar a pagina dos detalhes da reserva
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("reservation-details-container")));

            System.out.println("Reservation submitted successfully.");
            return true;

        } catch (Exception e) {
            System.out.println("Error in CreateReservationTest: " + e.getMessage());
            return false;
        }
    }
}
