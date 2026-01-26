import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            settings: {
                title: "Settings",
                account: "Account",
                account_sub: "Security notifications, change number",
                privacy: "Privacy",
                privacy_sub: "Block contacts, disappearing messages",
                subscription: "Subscription",
                notifications: "Notifications",
                notifications_sub: "Message, group & call tones",
                language: "App Language",
                language_sub: "English (device's language)",
                appearance: "Appearance",
                appearance_sub: "Theme, wallpapers",
                help: "Help",
                help_sub: "Help center, contact us, privacy policy",
                invite: "Invite a Friend",
                logout: "Log Out",
                status: "Available • Study Mode",
                account_edit: "Edit Profile",
                display_name: "Display Name",
                username: "Username",
                save_profile: "Save Profile",
                avatar_updated: "Profile picture updated!",
                profile_updated: "Profile updated successfully.",
                privacy_options: {
                    last_seen: "Last Seen",
                    profile_photo: "Profile Photo",
                    about: "About",
                    status: "Status",
                    read_receipts: "Read Receipts",
                    everyone: "Everyone",
                    contacts: "My Contacts",
                    nobody: "Nobody"
                },
                security: {
                    mfa: "Two-Factor Auth",
                    change_password: "Change Password",
                    google_managed: "Managed by Google",
                    mfa_sub: "Extra layer of security"
                }
            },
            menu: {
                main: "Main Menu",
                history: "Practice History",
                mock: "Mock Exams",
                bookmarks: "Saved Questions",
                labs: "3D Virtual Labs",
                apply: "Apply University",
                community: "Study Community",
                admin: "Admin Terminal",
                settings: "App Settings",
                logout: "Log Out",
                restricted: "Restricted Access",
                online: "Status: Online",
                exam_change: "Change Exam",
                active_course: "Active Course",
                dashboard: "Dashboard"
            },
            dashboard: {
                daily_stats: "Daily Stats",
                solved: "Questions Solved",
                accuracy: "Accuracy",
                streak: "Day Streak",
                total_q: "Total Questions",
                recent_activity: "Recent Activity",
                continue: "Continue",
                score: "Score",
                champions_league: "Champions League",
                top_students: "Top Students",
                mastery: "Subject Mastery",
                mastery_sub: "Your strength analysis",
                weak: "Needs Work",
                strong: "Strong",
                average: "Average",
                no_data: "No data available",
                start_practicing: "Start Practicing"
            },
            common: {
                save: "Save",
                cancel: "Cancel",
                back: "Back",
                loading: "Loading..."
            }
        }
    },
    it: {
        translation: {
            settings: {
                title: "Impostazioni",
                account: "Account",
                account_sub: "Notifiche di sicurezza, cambia numero",
                privacy: "Privacy",
                privacy_sub: "Blocca contatti, messaggi effimeri",
                subscription: "Abbonamento",
                notifications: "Notifiche",
                notifications_sub: "Toni per messaggi, gruppi e chiamate",
                language: "Lingua App",
                language_sub: "Italiano (lingua del dispositivo)",
                appearance: "Aspetto",
                appearance_sub: "Tema, sfondi",
                help: "Aiuto",
                help_sub: "Centro assistenza, contattaci, privacy",
                invite: "Invita un amico",
                logout: "Disconnettiti",
                status: "Disponibile • Modalità Studio",
                account_edit: "Modifica Profilo",
                display_name: "Nome Visualizzato",
                username: "Nome Utente",
                save_profile: "Salva Profilo",
                avatar_updated: "Immagine del profilo aggiornata!",
                profile_updated: "Profilo aggiornato con successo.",
                privacy_options: {
                    last_seen: "Ultimo accesso",
                    profile_photo: "Immagine del profilo",
                    about: "Info",
                    status: "Stato",
                    read_receipts: "Conferme di lettura",
                    everyone: "Tutti",
                    contacts: "I miei contatti",
                    nobody: "Nessuno"
                },
                security: {
                    mfa: "Autenticazione a due fattori",
                    change_password: "Cambia password",
                    google_managed: "Gestito da Google",
                    mfa_sub: "Livello extra di sicurezza"
                }
            },
            menu: {
                main: "Menu Principale",
                history: "Cronologia Pratica",
                mock: "Esami Simulati",
                bookmarks: "Domande Salvate",
                labs: "Laboratori 3D",
                apply: "Candidatura Università",
                community: "Community di Studio",
                admin: "Terminale Admin",
                settings: "Impostazioni App",
                logout: "Disconnettiti",
                restricted: "Accesso Riservato",
                online: "Stato: Online",
                exam_change: "Cambia Esame",
                active_course: "Corso Attivo",
                dashboard: "Dashboard"
            },
            dashboard: {
                daily_stats: "Statistiche Giornaliere",
                solved: "Domande Risolte",
                accuracy: "Precisione",
                streak: "Giorni consecutivi",
                total_q: "Domande Totali",
                recent_activity: "Attività Recente",
                continue: "Continua",
                score: "Punteggio",
                champions_league: "Champions League",
                top_students: "Studenti Migliori",
                mastery: "Padronanza Materie",
                mastery_sub: "Analisi dei tuoi punti di forza",
                weak: "Da Migliorare",
                strong: "Forte",
                average: "Media",
                no_data: "Nessun dato disponibile",
                start_practicing: "Inizia a Esercitarti"
            },
            common: {
                save: "Salva",
                cancel: "Annulla",
                back: "Indietro",
                loading: "Caricamento..."
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
