package pt.um.aasic.whackywheels.dtos.track;

import java.time.DayOfWeek;
import java.util.List;

public class TrackFilterResponseDTO {
    private long trackId;
    private Integer maxKarts;
    private List<DayOfWeek> notOpen;

    public TrackFilterResponseDTO() {}
    public TrackFilterResponseDTO(long trackId, Integer maxKarts, List<DayOfWeek> notOpen) {
        this.trackId = trackId;
        this.maxKarts = maxKarts;
        this.notOpen = notOpen;
    }
    public long getTrackId() {
        return trackId;
    }
    public void setTrackId(long trackId) {
        this.trackId = trackId;
    }
    public Integer getMaxKarts() {
        return maxKarts;
    }
    public void setMaxKarts(Integer maxKarts) {
        this.maxKarts = maxKarts;
    }
    public List<DayOfWeek> getNotOpen() {
        return notOpen;
    }
    public void setNotOpen(List<DayOfWeek> notOpen) {
        this.notOpen = notOpen;
    }
    
}
