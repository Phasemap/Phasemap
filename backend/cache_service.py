import threading
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Deque, Generic, List, Optional, TypeVar

T = TypeVar('T')

@dataclass
class CachedResult(Generic[T]):
    value: T
    timestamp: float = field(default_factory=time.time)

class ResultCache(Generic[T]):
    """
    Thread-safe, size-limited cache of results, with optional TTL.
    """
    def __init__(self, max_size: int = 10, ttl: Optional[float] = None):
        """
        :param max_size: Maximum number of items to keep
        :param ttl: Time-to-live in seconds; if set, entries older than ttl are evicted on access
        """
        self._cache: Deque[CachedResult[T]] = deque(maxlen=max_size)
        self._lock = threading.Lock()
        self._ttl = ttl

    def add_result(self, result: T) -> None:
        """Add a new result to the cache."""
        with self._lock:
            self._cache.append(CachedResult(result))

    def get_latest(self, count: Optional[int] = None) -> List[T]:
        """
        Retrieve the most recent `count` results (or all if count is None),
        evicting any entries older than TTL if configured.
        """
        with self._lock:
            now = time.time()
            if self._ttl is not None:
                # Evict stale entries
                while self._cache and now - self._cache[0].timestamp > self._ttl:
                    self._cache.popleft()
            items = list(self._cache)
        # Return values, limited if requested
        if count is not None:
            return [c.value for c in items[-count:]]
        return [c.value for c in items]

    def clear(self) -> None:
        """Remove all cached results."""
        with self._lock:
            self._cache.clear()

    def __len__(self) -> int:
        """Current number of items in cache."""
        with self._lock:
            return len(self._cache)

    def peek_oldest(self) -> Optional[T]:
        """View the oldest cached result without removing it."""
        with self._lock:
            if not self._cache:
                return None
            return self._cache[0].value
