package pt.um.aasic.whackywheels;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WhackywheelsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WhackywheelsApplication.class, args);
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
