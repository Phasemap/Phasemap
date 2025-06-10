
import math
import random
from typing import List, Dict, Tuple
import numpy as np


class AnomalyDetector:
    def __init__(self, threshold: float = 0.5):
        self.threshold = threshold

    def detect(self, data: List[float]) -> List[bool]:
        mean = np.mean(data)
        std_dev = np.std(data)
        return [(abs(x - mean) / std_dev) > self.threshold for x in data]


class PatternClassifier:
    def __init__(self, patterns: Dict[str, List[float]]):
        self.patterns = patterns

    def classify(self, sample: List[float]) -> str:
        def cosine_similarity(a: List[float], b: List[float]) -> float:
            a_np, b_np = np.array(a), np.array(b)
            return np.dot(a_np, b_np) / (np.linalg.norm(a_np) * np.linalg.norm(b_np))

        similarities = {label: cosine_similarity(sample, pattern) for label, pattern in self.patterns.items()}
        return max(similarities, key=similarities.get)


class ScoreNormalizer:
    def normalize(self, values: List[float], scale: Tuple[float, float] = (0, 1)) -> List[float]:
        min_val, max_val = min(values), max(values)
        range_min, range_max = scale
        return [(range_max - range_min) * (val - min_val) / (max_val - min_val + 1e-9) + range_min for val in values]


class ForecastModel:
    def __init__(self, decay: float = 0.9):
        self.decay = decay
        self.history = []

    def update(self, new_value: float):
        if not self.history:
            self.history.append(new_value)
        else:
            last = self.history[-1]
            self.history.append(self.decay * last + (1 - self.decay) * new_value)

    def forecast(self, steps: int = 1) -> float:
        return self.history[-1] if self.history else 0.0


class RiskScoreCalculator:
    def compute(self, factors: Dict[str, float]) -> float:
        weights = {
            "volatility": 0.4,
            "liquidity": 0.3,
            "age_factor": 0.2,
            "social_signal": 0.1
        }
        return sum(factors.get(k, 0.0) * w for k, w in weights.items())


def entropy(values: List[float]) -> float:
    total = sum(values)
    probs = [v / total for v in values if v > 0]
    return -sum(p * math.log2(p) for p in probs)


def peak_spread(signal: List[float]) -> float:
    max_val = max(signal)
    avg = sum(signal) / len(signal)
    return max_val - avg


def moving_average(data: List[float], window_size: int) -> List[float]:
    if len(data) < window_size:
        return []
    return [sum(data[i:i+window_size]) / window_size for i in range(len(data) - window_size + 1)]


def generate_synthetic_data(length: int) -> List[float]:
    return [random.uniform(0.2, 1.0) * math.sin(i / 3.0) + random.gauss(0, 0.1) for i in range(length)]


def signal_strength(values: List[float]) -> float:
    return max(values) / (sum(values) / len(values) + 1e-9)


def score_fluctuation_rate(scores: List[float]) -> float:
    diffs = [abs(scores[i] - scores[i-1]) for i in range(1, len(scores))]
    return sum(diffs) / len(diffs)


def cluster_density(points: List[Tuple[float, float]]) -> float:
    if not points:
        return 0.0
    center_x = sum(p[0] for p in points) / len(points)
    center_y = sum(p[1] for p in points) / len(points)
    return sum(math.hypot(p[0] - center_x, p[1] - center_y) for p in points) / len(points)


def deviation_from_mean(values: List[float]) -> float:
    mean = sum(values) / len(values)
    return sum((x - mean) ** 2 for x in values) / len(values)
