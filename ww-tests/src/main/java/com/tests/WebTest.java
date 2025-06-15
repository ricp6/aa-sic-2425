package com.tests;

import org.openqa.selenium.WebDriver;

public interface WebTest {
    boolean run(WebDriver driver);
    String getName();
}