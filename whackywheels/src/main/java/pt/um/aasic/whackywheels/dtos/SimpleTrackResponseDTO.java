package pt.um.aasic.whackywheels.dtos;

public class SimpleTrackResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String image; // URL da primeira imagem
    private boolean isAvailable;

    public SimpleTrackResponseDTO() {}

    public SimpleTrackResponseDTO(Long id, String name, String address, String image, boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.image = image;
        this.isAvailable = isAvailable;
    }

}
