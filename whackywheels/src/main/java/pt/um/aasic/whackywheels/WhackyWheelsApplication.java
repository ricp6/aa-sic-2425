package pt.um.aasic.whackywheels;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class WhackyWheelsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhackyWheelsApplication.class, args);
	}

	@PostConstruct
	public void init() {
		System.out.println("Initializing!");
	}

	@PreDestroy
	public void shutdown() {
		System.out.println("Shutdown!");
	}
}
