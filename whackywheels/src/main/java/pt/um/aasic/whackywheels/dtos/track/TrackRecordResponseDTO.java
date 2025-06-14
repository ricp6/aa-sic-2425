package pt.um.aasic.whackywheels.dtos.track;

public class TrackRecordResponseDTO {
    private Long id;
    private Double personalRecord;
    private Double trackRecord;

    public TrackRecordResponseDTO() {}

    public TrackRecordResponseDTO(Long id, Double personalRecord, Double trackRecord) {
        this.id = id;
        this.personalRecord = personalRecord;
        this.trackRecord = trackRecord;
    }

    public Long getId(){return this.id;}

    public Double getPersonalRecord() {return personalRecord;}
    public Double getTrackRecord() {return trackRecord;}
}
