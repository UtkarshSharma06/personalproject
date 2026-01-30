import { useEffect } from 'react';
import { Device } from '@capacitor/device';
import OneSignal from 'onesignal-cordova-plugin';

export const OneSignalManager = ({ user }: { user: any }) => {
    useEffect(() => {
        const initOneSignal = async () => {
            const info = await Device.getInfo();
            if (info.platform !== 'android' && info.platform !== 'ios') return;

            try {
                // Initialize OneSignal
                OneSignal.initialize("36b31128-46ae-4b7c-a5ab-b4c483327a59");

                // Request permission for Android 13+
                setTimeout(async () => {
                    await OneSignal.Notifications.requestPermission(true);
                }, 1000);

            } catch (e) {
                console.error("OneSignal Error:", e);
            }
        };

        initOneSignal();
    }, []);

    // Sync User ID
    useEffect(() => {
        const syncExternalId = async () => {
            const info = await Device.getInfo();
            if (info.platform !== 'android' && info.platform !== 'ios') return;

            if (user?.id) {
                OneSignal.login(user.id);
            } else {
                OneSignal.logout();
            }
        };

        syncExternalId();
    }, [user?.id]);

    return null;
};
