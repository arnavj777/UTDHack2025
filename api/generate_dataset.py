import argparse
import csv
import random
from pathlib import Path
from typing import Dict, List


CHANGE_TYPES = ["Feature", "Bug Fix", "Refactor"]
MODULE_AREAS = [
    "Authentication",
    "Payments",
    "UI",
    "Analytics",
    "Notifications",
    "Search",
    "Onboarding",
    "Performance",
]
IMPACT_LEVELS = ["Low", "Medium", "High", "Critical"]

FIELDNAMES: List[str] = [
    "change_type",
    "module_area",
    "impact_level",
    "affected_users_pct",
    "sentiment_score",
    "feedback_length",
    "competitor_mentions",
    "historical_bug_rate",
    "days_since_release",
    "rating_avg",
    "prior_issue_count",
    "is_mobile",
    "is_enterprise_tenant",
    "decision_yes",
]


def choose_impact(change_type: str) -> str:
    # Slightly different distributions per change type
    r = random.random()
    if change_type == "Bug Fix":
        # bug fixes skew higher impact
        if r < 0.1:
            return "Low"
        elif r < 0.45:
            return "Medium"
        elif r < 0.8:
            return "High"
        else:
            return "Critical"
    if change_type == "Feature":
        # features often medium/high, sometimes critical for enterprise modules
        if r < 0.15:
            return "Low"
        elif r < 0.6:
            return "Medium"
        elif r < 0.9:
            return "High"
        else:
            return "Critical"
    # Refactor tends to be low/medium
    if r < 0.55:
        return "Low"
    elif r < 0.9:
        return "Medium"
    else:
        return "High"


def synthesize_row() -> Dict[str, object]:
    change_type = random.choices(
        CHANGE_TYPES,
        weights=[0.45, 0.35, 0.20],  # more features, then bug fixes, then refactors
        k=1,
    )[0]
    module_area = random.choice(MODULE_AREAS)
    impact_level = choose_impact(change_type)

    # Numeric features with sensible ranges
    affected_users_pct = max(0, min(95, int(random.gauss(40, 18))))  # % of active users affected
    sentiment_score = max(-0.8, min(0.9, random.gauss(0.18, 0.28)))  # -1..1
    feedback_length = max(30, min(220, int(random.gauss(95, 35))))  # tokens/words
    competitor_mentions = 1 if random.random() < 0.2 else 0
    historical_bug_rate = round(max(0.03, min(0.35, random.gauss(0.14, 0.06))), 2)
    days_since_release = max(1, min(30, int(random.gauss(12, 8))))
    rating_avg = round(max(3.2, min(4.7, random.gauss(4.05, 0.25))), 1)
    prior_issue_count = max(0, min(35, int(random.gauss(9, 5))))
    is_mobile = 1 if random.random() < 0.55 else 0
    is_enterprise_tenant = 1 if random.random() < 0.35 else 0

    # Apply decision rules for realism
    decision_yes = 0
    if change_type == "Bug Fix":
        if impact_level in ["High", "Critical"]:
            decision_yes = 1
        elif impact_level == "Medium":
            decision_yes = 1 if (affected_users_pct >= 25 or sentiment_score <= -0.1) else 0
        else:  # Low
            decision_yes = 1 if (affected_users_pct >= 40 and sentiment_score <= -0.2) else 0

    elif change_type == "Feature":
        enterprise_critical = (
            is_enterprise_tenant == 1
            and module_area in ["Authentication", "Payments"]
            and impact_level in ["Medium", "High", "Critical"]
        )
        strong_demand = affected_users_pct >= 50 or sentiment_score >= 0.4 or competitor_mentions == 1
        decision_yes = 1 if (strong_demand or enterprise_critical) else 0

    else:  # Refactor
        perf_case = (
            module_area == "Performance"
            and (historical_bug_rate >= 0.2 or (is_mobile == 1 and affected_users_pct >= 30))
        )
        analytics_case = module_area == "Analytics" and historical_bug_rate >= 0.2
        high_risk_refactor = impact_level == "High" and historical_bug_rate >= 0.22
        decision_yes = 1 if (perf_case or analytics_case or high_risk_refactor) else 0

    return {
        "change_type": change_type,
        "module_area": module_area,
        "impact_level": impact_level,
        "affected_users_pct": affected_users_pct,
        "sentiment_score": round(sentiment_score, 2),
        "feedback_length": feedback_length,
        "competitor_mentions": competitor_mentions,
        "historical_bug_rate": historical_bug_rate,
        "days_since_release": days_since_release,
        "rating_avg": rating_avg,
        "prior_issue_count": prior_issue_count,
        "is_mobile": is_mobile,
        "is_enterprise_tenant": is_enterprise_tenant,
        "decision_yes": decision_yes,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=1250)
    parser.add_argument("--out", type=Path, default=Path("data/feedback_logit_dataset.csv"))
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    random.seed(args.seed)
    args.out.parent.mkdir(parents=True, exist_ok=True)

    with args.out.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for _ in range(args.rows):
            writer.writerow(synthesize_row())

    print(f"Wrote {args.rows} rows to {args.out}")


if __name__ == "__main__":
    main()


