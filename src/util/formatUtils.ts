import { TFunction } from "i18next";
import { DateTime } from "luxon";

export const formatTimeSince = (date: string, t: TFunction): string => {
    const parsed = DateTime.fromISO(date);
    const duration = -parsed.diffNow().as("seconds");

    if (duration < 10) {
        return t("duration.ago.fewSeconds");
    }

    if (duration < 60) {
        return t("duration.ago.lessThanOneMinute");
    }

    if (duration < 120) {
        return t("duration.ago.oneMinute");
    }

    if (duration < 3600) {
        return t("duration.ago.minutes", { minutes: Math.floor(duration / 60) });
    }

    if (duration < 7200) {
        return t("duration.ago.oneHour");
    }

    if (duration < 86400) {
        return t("duration.ago.hours", { hours: Math.floor(duration / 3600) });
    }

    if (duration < 172800) {
        return t("duration.ago.oneDay");
    }

    return parsed.toLocaleString(DateTime.DATE_SHORT);
};

export const reformatDate = (date: string | undefined): string => {
    const language = window.localStorage.getItem("language") ? window.localStorage.getItem("language") : "default";
    if (language === "custom") {
        if (date) {
            const standardDate = `${date.substring(8, 10)}.${date.substring(5, 7)}.${date.substring(0, 4)}`;
            const time = date.split("T")[1].substring(0, 5);
            return `${standardDate} | ${time}`;
        }
    } else if (date) {
        const americanDate = `${date.substring(5, 7)}/${date.substring(8, 10)}/${date.substring(0, 4)}`;
        const time = date.split("T")[1].substring(0, 5);
        return `${americanDate} | ${time}`;
    }
    return "01.01.2000";
};
