package pt.um.aasic.whackywheels.dtos.kart;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class KartDTO {

    @NotNull(message = "Kart number cannot be null")
    @Min(value = 1, message = "Kart number must be at least 0")
    private Integer kartNumber;

    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;

    public KartDTO() {}

    public KartDTO(Integer kartNumber, String model) {
        this.kartNumber = kartNumber;
        this.model = model;
    }

    public Integer getKartNumber() { return kartNumber; }
    public void setKartNumber(Integer kartNumber) { this.kartNumber = kartNumber; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
}
