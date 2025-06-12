package pt.um.aasic.whackywheels.dtos;

public class KartResponseDTO {
    private Long id;
    private Integer kartNumber;
    private String model;

    public KartResponseDTO(Long id, Integer kartNumber, String model) {
        this.id = id;
        this.kartNumber = kartNumber;
        this.model = model;
    }

    public Long getId() { return id; }
    public Integer getKartNumber() { return kartNumber; }
    public String getModel() { return model; }

    public void setId(Long id) { this.id = id; }
    public void setKartNumber(Integer kartNumber) { this.kartNumber = kartNumber; }
    public void setModel(String model) { this.model = model; }
}