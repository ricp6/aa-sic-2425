package pt.um.aasic.whackywheels.dtos;

public class TrackResponseDTO {
    private Long id;
    private String name;
    private String address;
    private String image; // URL da primeira imagem
    private boolean isAvailable;

    public TrackResponseDTO() {}

    public TrackResponseDTO(Long id, String name, String address, String image, boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.image = image;
        this.isAvailable = isAvailable;
    }

    public Long getId(){return this.id;}

    public String getName(){return this.name;}

    public String getAddress(){return this.address;}
    public String getImage(){return this.image;}
    public boolean isAvailable(){return this.isAvailable;}

}
