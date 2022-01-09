import { DateTime } from "luxon";
import { TFunction } from "react-i18next";

export const formatTimeSince = (date: string, t: TFunction<string>): string => {
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
