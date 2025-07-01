from dataclasses import dataclass
from enum import Enum


class RiskLabel(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    SEVERE = "Severe"


@dataclass
class TokenRiskInput:
    volume_shift_ratio: float        # 0.0–1.0
    has_flashloan: bool
    smart_wallet_ratio: float        # 0.0–1.0
    sybil_cluster_score: float       # 0.0–1.0
    whale_trade_volume_ratio: float  # 0.0–1.0


RISK_WEIGHTS = {
    "volume_shift": 0.25,
    "flashloan": 0.3,
    "smart_wallet": 0.15,
    "sybil_cluster": 0.15,
    "whale_volume": 0.15,
}


def compute_token_risk_score(input: TokenRiskInput) -> float:
    score = (
        input.volume_shift_ratio * RISK_WEIGHTS["volume_shift"] +
        (1 if input.has_flashloan else 0) * RISK_WEIGHTS["flashloan"] +
        input.smart_wallet_ratio * RISK_WEIGHTS["smart_wallet"] +
        input.sybil_cluster_score * RISK_WEIGHTS["sybil_cluster"] +
        input.whale_trade_volume_ratio * RISK_WEIGHTS["whale_volume"]
    )
    return round(score * 100, 1)


def map_score_to_label(score: float) -> RiskLabel:
    if score >= 85:
        return RiskLabel.SEVERE
    if score >= 65:
        return RiskLabel.HIGH
    if score >= 40:
        return RiskLabel.MODERATE
    return RiskLabel.LOW
