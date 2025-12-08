import { LocalNotifications } from '@capacitor/local-notifications';

export class NotificationService {
	static async init() {
		await LocalNotifications.requestPermissions();
		await LocalNotifications.createChannel({
			id: 'mindtask_alerts',
			name: 'MindTask',
			description: 'Připomenutí úkolu',
			importance: 5,
			visibility: 1,
			sound: 'default',
			vibration: false
		});
	}

	static async scheduleTaskNotification(taskId: string, title: string, date: Date) {
		await LocalNotifications.schedule({
			notifications: [
				{
					id: Number(taskId.replace(/\D/g, '').slice(0, 9)),
					title: 'Připomenutí úkolu',
					largeIcon: 'ic_launcher',
					body: title,
					schedule: {
						at: date
					},
					channelId: 'mindtask_alerts'
				}
			]
		});
	}

	static async cancelTaskNotification(taskId: string) {
		await LocalNotifications.cancel({
			notifications: [{ id: Number(taskId.replace(/\D/g, '').slice(0, 9)) }]
		});
	}
}
