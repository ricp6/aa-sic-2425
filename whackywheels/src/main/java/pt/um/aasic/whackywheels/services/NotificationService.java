package pt.um.aasic.whackywheels.services;

import pt.um.aasic.whackywheels.dtos.NotificationCreateRequestDTO;
import pt.um.aasic.whackywheels.dtos.NotificationResponseDTO;
import pt.um.aasic.whackywheels.entities.Notification;
import pt.um.aasic.whackywheels.entities.User;
import pt.um.aasic.whackywheels.repositories.NotificationRepository;
import pt.um.aasic.whackywheels.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static NotificationRepository notificationRepository = null;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationResponseDTO createNotification(NotificationCreateRequestDTO request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + request.getUserId() + " not found."));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.getTitle());
        notification.setBody(request.getBody());
        notification.setIsRead(false);

        Notification savedNotification = notificationRepository.save(notification);

        return new NotificationResponseDTO(
                savedNotification.getId(),
                savedNotification.getUser().getId(),
                savedNotification.getTitle(),
                savedNotification.getBody(),
                savedNotification.getIsRead(),
                savedNotification.getCreatedAt()
        );
    }

    public static Long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationResponseDTO markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification with ID " + notificationId + " not found."));

        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }

        return new NotificationResponseDTO(
                notification.getId(),
                notification.getUser().getId(),
                notification.getTitle(),
                notification.getBody(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }

    public List<NotificationResponseDTO> findAllNotifications() {
        return notificationRepository.findAll().stream()
                .map(notification -> new NotificationResponseDTO(
                        notification.getId(),
                        notification.getUser().getId(),
                        notification.getTitle(),
                        notification.getBody(),
                        notification.getIsRead(),
                        notification.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElse(null);

        if (notification == null) {
            return false;
        }

        if (!notification.getUser().getId().equals(userId)) {
            throw new SecurityException("User is not authorized to delete this notification.");
        }

        notificationRepository.delete(notification);
        return true;
    }

    @Transactional
    public int deleteReadNotifications(Long userId) {
        List<Notification> readNotifications = notificationRepository.findByUserIdAndIsReadTrue(userId);
        notificationRepository.deleteAll(readNotifications);
        return readNotifications.size();
    }

    @Transactional
    public int markAllNotificationsAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
        return unreadNotifications.size();
    }
}
