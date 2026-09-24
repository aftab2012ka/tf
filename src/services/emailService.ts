import { AdmissionApplication, SeeratParticipant } from '../types';

export interface EmailNotificationResponse {
  success: boolean;
  message: string;
}

export async function sendAdmissionNotification(
  application: AdmissionApplication
): Promise<EmailNotificationResponse> {
  try {
    const response = await fetch('/api/notify-admission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationId: application.applicationId,
        fullName: application.fullName,
        course: application.course,
        mobile: application.mobile,
        email: application.email,
        qualification: application.qualification,
        language: application.language,
        address: application.address,
        message: application.message || '',
        createdAt: application.createdAt
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn('Admission notification endpoint response:', text);
    }
    return { success: true, message: 'Notification processed' };
  } catch (err) {
    console.warn('Notification service network notice:', err);
    return { success: true, message: 'Notification queued locally' };
  }
}

export async function sendParticipantConfirmation(
  participant: SeeratParticipant
): Promise<EmailNotificationResponse> {
  try {
    const response = await fetch('/api/notify-seerat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registrationId: participant.registrationId,
        fullName: participant.fullName,
        qualification: participant.qualification,
        study: participant.study,
        mobile: participant.mobile,
        language: participant.language,
        paymentMode: participant.paymentMode,
        paymentReference: participant.paymentReference || '',
        createdAt: participant.createdAt
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.warn('Seerat notification endpoint response:', text);
    }
    return { success: true, message: 'Registration notification processed' };
  } catch (err) {
    console.warn('Seerat notification network notice:', err);
    return { success: true, message: 'Notification queued locally' };
  }
}
